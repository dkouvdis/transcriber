import React from "react";
// We're using Tailwind CSS for styling, so no need for App.css
import { TranscriptionPanel } from "@/components/TranscriptionPanel";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Real-time Transcription App</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Powered by Web Speech API, React, and Tailwind CSS
        </p>
      </header>
      <main className="w-full max-w-4xl">
        <TranscriptionPanel />
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Note: For best results, use Chrome or Edge as they have the best
          support for the Web Speech API.
        </p>
      </footer>
    </div>
  );
}

export default App;
