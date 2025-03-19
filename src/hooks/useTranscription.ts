import { SpeechRecognition } from "@/types";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseTranscriptionOptions {
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseTranscriptionReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  browserSupport: boolean;
}

export function useTranscription({
  continuous = true,
  interimResults = true,
}: UseTranscriptionOptions = {}): UseTranscriptionReturn {
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean>(false);

  // Combine final and interim transcripts for display
  const transcript = finalTranscript + interimTranscript;

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setBrowserSupport(true);
    } else {
      setBrowserSupport(false);
      setError(
        "Your browser does not support the Web Speech API. Try using Chrome."
      );
    }
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (!browserSupport) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = "en-GB";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let newInterimTranscript = "";
      let newFinalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript;
        } else {
          newInterimTranscript += transcript;
        }
      }

      // Update with final results
      if (newFinalTranscript) {
        setFinalTranscript((prev) => prev + newFinalTranscript + " ");
        setInterimTranscript(""); // Clear interim transcript when we have final results
      } else if (newInterimTranscript) {
        // Only update interim transcript, don't touch final transcript
        setInterimTranscript(newInterimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      // Auto restart if we're supposed to be listening
      // but the recognition service stopped
      if (isListening && continuous) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  }, [browserSupport, continuous, interimResults, isListening]);

  // Start listening
  const startListening = useCallback(() => {
    setError(null);

    if (!browserSupport) {
      setError("Browser not supported");
      return;
    }

    if (!recognitionRef.current) {
      initRecognition();
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start listening");
    }
  }, [browserSupport, initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    error,
    browserSupport,
  };
}
