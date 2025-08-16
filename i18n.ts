/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {createContext, ReactNode, useContext, useState} from 'react';

const translations = {
  en: {
    galleryTitle: 'Veo Gallery',
    gallerySubtitle:
      'Select a video to generate your own variations or create a new one from a prompt.',
    generateNewVideo: 'Generate a New Video',
    promptPlaceholder:
      'e.g., A cinematic shot of a koala bear DJing in a forest',
    generate: 'Generate',
    generatingFrom: 'Generated: "{prompt}"',
    remixOf: 'Remix of "{title}"',
    generationFailed: 'Generation Failed',
    errorPaidTier: 'Video generation is only available on the Paid Tier.',
    errorSelectProject: 'Please select your Cloud Project to get started',
    addApiKey: 'Add API Key',
    close: 'Close',
    creatingRemix: 'Creating your remix...',
    animatingPixels: 'Animating pixels...',
    composingShot: 'Composing the perfect shot...',
    renderingMasterpiece: 'Rendering your masterpiece...',
    takeAFewMoments: 'This can take a few moments...',
    waitForVision: 'Please wait while we bring your vision to life.',
    playVideo: 'Play video: {title}',
    closeVideoPlayer: 'Close video player',
    videoTextPrompt: 'Video text prompt',
    cancel: 'Cancel',
    editAndGenerate: 'Edit & Generate',
    editVideoDetails: 'Edit video details',
    language: 'Language',
    english: 'English',
    traditionalChinese: '繁體中文',
    favoriteVideo: 'Favorite Video',
    unfavoriteVideo: 'Unfavorite Video',
    deleteVideo: 'Delete Video',
  },
  'zh-TW': {
    galleryTitle: 'Veo 畫廊',
    gallerySubtitle:
      '選擇一個影片來生成您自己的變體，或根據提示創建一個新的影片。',
    generateNewVideo: '生成新影片',
    promptPlaceholder: '例如：一隻無尾熊在森林裡當 DJ 的電影鏡頭',
    generate: '生成',
    generatingFrom: '生成自：「{prompt}」',
    remixOf: '"{title}" 的混音版',
    generationFailed: '生成失敗',
    errorPaidTier: '影片生成功能僅在付費方案中提供。',
    errorSelectProject: '請選擇您的雲端專案以開始使用。',
    addApiKey: '新增 API 金鑰',
    close: '關閉',
    creatingRemix: '正在創建您的混音版...',
    animatingPixels: '正在為像素注入活力...',
    composingShot: '正在構圖完美鏡頭...',
    renderingMasterpiece: '正在渲染您的傑作...',
    takeAFewMoments: '這可能需要一些時間...',
    waitForVision: '請稍候，我們正在將您的想法變為現實。',
    playVideo: '播放影片：{title}',
    closeVideoPlayer: '關閉影片播放器',
    videoTextPrompt: '影片文字提示',
    cancel: '取消',
    editAndGenerate: '編輯與生成',
    editVideoDetails: '編輯影片詳情',
    language: '語言',
    english: 'English',
    traditionalChinese: '繁體中文',
    favoriteVideo: '收藏影片',
    unfavoriteVideo: '取消收藏',
    deleteVideo: '刪除影片',
  },
};

type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('zh-TW'); // Default to Chinese as requested.
  const t = translations[language];

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {language, setLanguage, t},
    },
    children,
  );
};

export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};
