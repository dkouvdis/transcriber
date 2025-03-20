import { Button } from "@/components/ui/button";
import { Mic, MicOff, MessageSquareX } from "lucide-react";

type ControlsProps = {
  isListening: boolean;
  browserSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
};

export const Controls = ({
  isListening,
  browserSupport,
  startListening,
  stopListening,
  clearTranscript,
}: ControlsProps) => {
  return (
    <div className="flex justify-between items-center p-4 rounded">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isListening ? "bg-teal-500 animate-pulse" : "bg-gray-300"
          }`}
        />
        <p className="text-sm text-white font-medium">
          {isListening ? "Listening..." : "Not listening"}
        </p>
      </div>
      <div className="flex gap-2">
        {isListening ? (
          <Button
            className="inline-flex gap-2 items-center px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
            onClick={stopListening}
            disabled={!browserSupport}
          >
            <MicOff className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <>
            <Button
              className="inline-flex gap-2 items-center px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
              onClick={clearTranscript}
            >
              <MessageSquareX className="h-4 w-4" />
              Clear
            </Button>
            <Button
              className="inline-flex gap-2 items-center px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
              onClick={startListening}
              disabled={!browserSupport}
            >
              <Mic className="h-4 w-4" />
              Start
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
