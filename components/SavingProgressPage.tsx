/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import {useTranslations} from '../i18n';

/**
 * A fullscreen overlay that displays a loading animation and text indicating that
 * a video remix is being created.
 */
export const SavingProgressPage: React.FC = () => {
  const {t} = useTranslations();
  const MESSAGES = [
    t.creatingRemix,
    t.animatingPixels,
    t.composingShot,
    t.renderingMasterpiece,
    t.takeAFewMoments,
  ];
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % MESSAGES.length;
      setMessage(MESSAGES[messageIndex]);
    }, 2500);

    return () => clearInterval(interval);
  }, [MESSAGES]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in"
      aria-live="polite"
      aria-busy="true">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <div className="mt-8 text-center">
        <h2
          key={message}
          className="text-2xl font-bold text-white animate-fade-in drop-shadow-lg">
          {message}
        </h2>
        <p className="text-gray-300 mt-2 drop-shadow-lg">{t.waitForVision}</p>
      </div>
    </div>
  );
};
