/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {useTranslations} from '../i18n';
import {XMarkIcon} from './icons';

interface ErrorModalProps {
  message: string[];
  onClose: () => void;
  onSelectKey: () => void;
}

/**
 * A modal component that displays an error message to the user.
 * It includes a title, the error message, a close button, and a visual error icon.
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  onClose,
  onSelectKey,
}) => {
  const {t} = useTranslations();
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="error-modal-title">
      <div
        className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-md relative p-8 m-4 text-center"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors"
          aria-label="Close error message">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-5 border border-red-500/30">
          <svg
            className="h-8 w-8 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2
          id="error-modal-title"
          className="text-2xl font-bold text-white mb-2">
          {t.generationFailed}
        </h2>
        {message.map((m, i) => (
          <p key={i} className="text-gray-300">
            {m}
          </p>
        ))}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onSelectKey}
            className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg">
            {t.addApiKey}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
