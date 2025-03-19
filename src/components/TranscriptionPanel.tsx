import { useTranscription } from "@/hooks/useTranscription";
import { Mic, MicOff, AlertCircle } from "lucide-react";

export function TranscriptionPanel() {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    error,
    browserSupport,
  } = useTranscription();

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Real-time Transcription
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Speak clearly into your microphone to see real-time transcription
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="relative min-h-[200px] p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          {transcript ? (
            <p className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
              {transcript}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {isListening
                ? "Listening... Speak now"
                : "Press Start to begin transcription"}
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-4 p-2 text-sm text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20 rounded-md">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}

        {!browserSupport && (
          <div className="flex items-center gap-2 mt-4 p-2 text-sm text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20 rounded-md">
            <AlertCircle size={16} />
            <p>
              Your browser doesn't support the Web Speech API. Please try using
              Chrome.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isListening ? "Listening..." : "Not listening"}
          </p>
        </div>
        <div className="flex gap-2">
          {isListening ? (
            <button
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={stopListening}
              disabled={!browserSupport}
            >
              <MicOff className="mr-2 h-4 w-4" />
              Stop
            </button>
          ) : (
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={startListening}
              disabled={!browserSupport}
            >
              <Mic className="mr-2 h-4 w-4" />
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
