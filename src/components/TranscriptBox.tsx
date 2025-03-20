type TranscriptionBoxProps = {
  transcript: string;
  isListening: boolean;
};

export const TranscriptionBox = ({
  transcript,
  isListening,
}: TranscriptionBoxProps) => {
  return (
    <div className="relative p-4 bg-black rounded-lg max-h-[300px] overflow-auto h-[50vh] flex flex-col-reverse">
      {transcript ? (
        <p
          className={`whitespace-pre-wrap break-words text-white text-lg leading-snug antialiased`}
        >
          {transcript}
        </p>
      ) : (
        <p className={`text-gray-200 leading-snug`}>
          {isListening
            ? "Listening... Speak now"
            : "Press Start to begin transcription"}
        </p>
      )}
    </div>
  );
};
