/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useRef} from 'react';
import {Video} from '../types';
import {useTranslations} from '../i18n';
import {PlayIcon, StarIcon, TrashIcon} from './icons';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onToggleFavorite: (videoId: string) => void;
  onDelete: (videoId: string) => void;
}

/**
 * A component that renders a video card with a thumbnail, title, and play button.
 */
export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onToggleFavorite,
  onDelete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {t} = useTranslations();

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group relative w-full text-left bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:shadow-purple-500/30 hover:border-white/20 hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(video.id);
          }}
          className={`p-2 rounded-full bg-black/40 backdrop-blur-lg text-white hover:bg-black/60 transition-colors ${
            video.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : ''
          }`}
          aria-label={
            video.isFavorite ? t.unfavoriteVideo : t.favoriteVideo
          }
          title={video.isFavorite ? t.unfavoriteVideo : t.favoriteVideo}>
          <StarIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.id);
          }}
          className="p-2 rounded-full bg-black/40 backdrop-blur-lg text-white hover:bg-black/60 hover:text-red-400 transition-colors"
          aria-label={t.deleteVideo}
          title={t.deleteVideo}>
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        className="w-full"
        onClick={() => onPlay(video)}
        aria-label={t.playVideo.replace('{title}', video.title)}>
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-48 object-cover pointer-events-none"
            src={video.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"></video>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <PlayIcon className="w-16 h-16 text-white opacity-80 drop-shadow-lg group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <div className="p-4">
          <h3
            className="text-base font-semibold text-gray-200 truncate"
            title={video.title}>
            {video.title}
          </h3>
        </div>
      </button>
    </div>
  );
};
