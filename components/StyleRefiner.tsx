/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {useTranslations} from '../i18n';
import {SparklesIcon} from './icons';

interface StyleRefinerProps {
  onGenerate: (prompt: string) => Promise<void>;
  onOptimize: (prompt: string) => Promise<string>;
  isBusy: boolean;
}

export const StyleRefiner: React.FC<StyleRefinerProps> = ({
  onGenerate,
  onOptimize,
  isBusy,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState(false);
  const [hasBeenOptimized, setHasBeenOptimized] = useState(false);
  const {t} = useTranslations();

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    // If user edits the prompt, it's no longer the "optimized" version
    setHasBeenOptimized(false);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || isBusy || isProcessing) return;

    // If optimization is on AND the prompt hasn't been optimized yet,
    // just run optimization and update the text area.
    if (isOptimizationEnabled && !hasBeenOptimized) {
      setIsProcessing(true);
      try {
        const optimizedPrompt = await onOptimize(prompt);
        setPrompt(optimizedPrompt);
        setHasBeenOptimized(true); // Mark as optimized
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
      return; // Stop here, wait for the next click to generate.
    }

    // Otherwise, proceed with generation.
    setIsProcessing(true);
    try {
      await onGenerate(prompt);
      setPrompt(''); // Clear input on success
      setHasBeenOptimized(false);
    } catch (e) {
      // Error will be handled in parent component
      console.error(e);
    } finally {
      // isProcessing will be reset when the component remounts after generation
    }
  };

  const isDisabled = isBusy || isProcessing;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 animate-fade-in">
      <div className="mx-auto max-w-[1080px] px-4 pb-4">
        <div className="relative bg-gradient-to-b from-white/10 to-transparent bg-black/20 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 shadow-inner shadow-black/20 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              rows={1}
              className="flex-grow bg-white/5 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 text-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-shadow duration-200 resize-none placeholder:text-gray-400"
              placeholder={t.promptPlaceholder}
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isDisabled}
              aria-label="Prompt for new video generation"
            />
            <button
              onClick={handleSubmit}
              disabled={isDisabled || !prompt.trim()}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:scale-100 text-base shadow-lg disabled:shadow-none">
              <SparklesIcon className="w-5 h-5" />
              <span>{isProcessing ? t.generating : t.generate}</span>
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center sm:justify-start">
            <label
              htmlFor="ai-optimization-toggle"
              className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  id="ai-optimization-toggle"
                  className="sr-only peer"
                  checked={isOptimizationEnabled}
                  onChange={() => {
                    setIsOptimizationEnabled(!isOptimizationEnabled);
                    setHasBeenOptimized(false); // Reset optimization state on toggle
                  }}
                  disabled={isDisabled}
                />
                <div className="toggle-track block bg-white/10 border border-white/20 w-11 h-6 rounded-full transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300">
                {t.aiOptimization}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
