/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {Video} from '../types';
import {useTranslations} from '../i18n';
import {PencilSquareIcon, StarIcon, TrashIcon, XMarkIcon} from './icons';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onSave: (newDescription: string) => void;
  onToggleFavorite: (videoId: string) => void;
  onDelete: (videoId: string) => void;
}

/**
 * A component that renders a video player with controls, description, and edit button.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onClose,
  onSave,
  onToggleFavorite,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(video.description);
  const {t} = useTranslations();

  const handleSave = () => {
    onSave(description);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(video.description);
  };

  const handleDelete = () => {
    onDelete(video.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-2 sm:p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            aria-label={t.closeVideoPlayer}>
            <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden">
            <video
              key={video.id}
              className="w-full h-full"
              src={video.videoUrl}
              controls
              autoPlay
              loop
              aria-label={video.title}
            />
          </div>
        </div>
        <div className="flex-1 p-4 pt-2 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              {isEditing ? (
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-2">
                    {t.videoTextPrompt}
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-shadow duration-200"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label={t.videoTextPrompt}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-300 mt-0 whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 self-start sm:self-end w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
                    {t.generate}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onToggleFavorite(video.id)}
                    className={`flex items-center justify-center p-2.5 rounded-full transition-colors text-sm bg-white/10 hover:bg-white/20 ${
                      video.isFavorite
                        ? 'text-yellow-400'
                        : 'text-white'
                    }`}
                    aria-label={
                      video.isFavorite ? t.unfavoriteVideo : t.favoriteVideo
                    }>
                    <StarIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-red-400 transition-colors text-sm"
                    aria-label={t.deleteVideo}>
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
                    aria-label={t.editVideoDetails}>
                    <PencilSquareIcon className="w-5 h-5" />
                    <span className="sm:inline">{t.editAndGenerate}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
