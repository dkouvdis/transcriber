import { SpeechRecognition } from "@/types";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseTranscriptionOptions {
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseTranscriptionReturn {
  transcript: string;
  isListening: boolean;
  error: string | null;
  browserSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
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

  const transcript = finalTranscript + interimTranscript;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);

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

      if (newFinalTranscript) {
        setFinalTranscript((prev) => prev + newFinalTranscript + " ");
        setInterimTranscript("");
      } else if (newInterimTranscript) {
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

      if (shouldListenRef.current && continuous) {
        try {
          recognition.start();
        } catch (err) {
          console.error("Failed to restart recognition:", err);
        }
      }
    };

    recognitionRef.current = recognition;
  }, [browserSupport, continuous, interimResults]);

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
      shouldListenRef.current = true;
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start listening");
      shouldListenRef.current = false;
    }
  }, [browserSupport, initRecognition]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
  }, []);

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
    error,
    browserSupport,
    startListening,
    stopListening,
    clearTranscript,
  };
}
