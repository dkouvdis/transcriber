import { Controls } from "@/components/Controls";
import { TranscriptionBox } from "@/components/TranscriptBox";
import { useTranscription } from "@/hooks/useTranscription";

export function TranscriptionPanel() {
  const {
    transcript,
    isListening,
    browserSupport,
    startListening,
    stopListening,
    clearTranscript,
  } = useTranscription();

  return (
    <div className="w-full mx-auto overflow-hidden bg-black/90 min-h-screen">
      <div className="p-4 h-screen">
        <TranscriptionBox transcript={transcript} isListening={isListening} />

        <Controls
          isListening={isListening}
          browserSupport={browserSupport}
          startListening={startListening}
          stopListening={stopListening}
          clearTranscript={clearTranscript}
        />
      </div>
    </div>
  );
}
