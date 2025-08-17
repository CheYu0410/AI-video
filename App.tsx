/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useMemo, useState} from 'react';
import {ErrorModal} from './components/ErrorModal';
import {SparklesIcon, VideoCameraIcon} from './components/icons';
import {SavingProgressPage} from './components/SavingProgressPage';
import {StyleRefiner} from './components/StyleRefiner';
import {VideoGrid} from './components/VideoGrid';
import {VideoPlayer} from './components/VideoPlayer';
import {MOCK_VIDEOS} from './constants';
import {useTranslations} from './i18n';
import {Video} from './types';

import {
  GeneratedVideo,
  GoogleGenAI,
  GenerateContentResponse,
} from '@google/genai';

const VEO_MODEL_NAME = 'veo-2.0-generate-001';
const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// ---

function bloblToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

// ---

async function generateVideoFromText(
  prompt: string,
  numberOfVideos = 1,
): Promise<string[]> {
  let operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    config: {
      numberOfVideos,
      aspectRatio: '16:9',
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('...Generating...');
    operation = await ai.operations.getVideosOperation({operation});
  }

  if (operation?.response) {
    const videos = operation.response?.generatedVideos;
    if (videos === undefined || videos.length === 0) {
      throw new Error('No videos generated');
    }

    return await Promise.all(
      videos.map(async (generatedVideo: GeneratedVideo) => {
        const url = decodeURIComponent(generatedVideo.video.uri);
        const res = await fetch(`${url}&key=${process.env.API_KEY}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch video: ${res.status} ${res.statusText}`,
          );
        }
        const blob = await res.blob();
        return bloblToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

/**
 * Main component for the Veo3 Gallery app.
 * It manages the state of videos, playing videos, editing videos and error handling.
 */
export const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string[] | null>(
    null,
  );
  const {language, setLanguage, t} = useTranslations();

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const handleToggleFavorite = (videoId: string) => {
    setVideos((currentVideos) =>
      currentVideos.map((v) =>
        v.id === videoId ? {...v, isFavorite: !v.isFavorite} : v,
      ),
    );
    if (playingVideo?.id === videoId) {
      setPlayingVideo((prev) =>
        prev ? {...prev, isFavorite: !prev.isFavorite} : null,
      );
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((currentVideos) => currentVideos.filter((v) => v.id !== videoId));
    if (playingVideo?.id === videoId) {
      setPlayingVideo(null);
    }
  };

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [videos]);

  const handleOptimizePrompt = async (promptText: string): Promise<string> => {
    try {
      const instruction =
        language === 'zh-TW'
          ? `請將以下用於影片生成的提示詞變得更豐富、更有電影感、更詳細。直接回覆優化後的提示詞，不要有任何額外說明。語言：繁體中文。使用者提示詞：「${promptText}」`
          : `Enhance and expand the following user prompt for a video generation model. Make it more vivid, detailed, and cinematic. Respond ONLY with the new prompt, without any extra explanation. Language: English. User prompt: "${promptText}"`;

      const response: GenerateContentResponse = await ai.models.generateContent(
        {
          model: GEMINI_MODEL_NAME,
          contents: instruction,
        },
      );

      const optimizedText = response.text.trim();
      console.log('Optimized prompt:', optimizedText);
      return optimizedText || promptText; // Fallback to original if response is empty
    } catch (error) {
      console.error('Prompt optimization failed:', error);
      // If optimization fails, just return the original prompt to not break the flow.
      return promptText;
    }
  };

  const handleGenerateFromPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsSaving(true);
    setGenerationError(null);

    try {
      console.log('Generating video from new prompt...', promptText);
      const videoObjects = await generateVideoFromText(promptText);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');
      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: t.generatingFrom.replace(
          '{prompt}',
          `${promptText.substring(0, 40)}${
            promptText.length > 40 ? '...' : ''
          }`,
        ),
        description: promptText,
        videoUrl: src,
        isFavorite: false,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo); // Play the new video immediately
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([t.errorPaidTier, t.errorSelectProject]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateNewVideo = async (
    originalVideo: Video,
    promptText: string,
  ) => {
    setPlayingVideo(null);
    setIsSaving(true);
    setGenerationError(null);

    try {
      console.log('Generating video...', promptText);
      const videoObjects = await generateVideoFromText(promptText);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');

      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: t.remixOf.replace('{title}', originalVideo.title),
        description: promptText,
        videoUrl: src,
        isFavorite: originalVideo.isFavorite,
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo); // Go to the new video
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([t.errorPaidTier, t.errorSelectProject]);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <SavingProgressPage />;
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-100 font-sans">
      <div className="mx-auto max-w-[1080px] p-4">
        <header className="relative p-6 md:p-8 text-center mb-8">
          <div className="absolute top-4 right-4 z-10">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'zh-TW')}
              className="bg-black/20 backdrop-blur-md border border-white/10 text-white text-sm rounded-full focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 appearance-none px-4"
              aria-label={t.language}>
              <option value="en">{t.english}</option>
              <option value="zh-TW">{t.traditionalChinese}</option>
            </select>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold inline-flex items-center gap-4">
            <VideoCameraIcon className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
            <span className="animated-title">{t.galleryTitle}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">{t.gallerySubtitle}</p>
        </header>

        <main className="px-4 md:px-0 pb-40">
          <VideoGrid
            videos={sortedVideos}
            onPlayVideo={handlePlayVideo}
            onToggleFavorite={handleToggleFavorite}
            onDeleteVideo={handleDeleteVideo}
          />
        </main>
      </div>

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={handleClosePlayer}
          onSave={(newDescription) =>
            handleGenerateNewVideo(playingVideo, newDescription)
          }
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDeleteVideo}
        />
      )}

      {generationError && (
        <ErrorModal
          message={generationError}
          onClose={() => setGenerationError(null)}
          onSelectKey={async () => await window.aistudio?.openSelectKey()}
        />
      )}
      <StyleRefiner
        onGenerate={handleGenerateFromPrompt}
        onOptimize={handleOptimizePrompt}
        isBusy={isSaving}
      />
    </div>
  );
};
