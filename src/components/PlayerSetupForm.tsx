"use client";

import { useState, type FormEvent } from "react";

interface PlayerSetupFormProps {
  onStart: (playerOne: string, playerTwo: string) => void;
  onCancel: () => void;
}

const inputClasses =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:border-accent focus:outline-none";

export default function PlayerSetupForm({ onStart, onCancel }: PlayerSetupFormProps) {
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const first = playerOne.trim();
    const second = playerTwo.trim();

    if (!first || !second) {
      setError("Enter a name for both players.");
      return;
    }

    if (first.toLowerCase() === second.toLowerCase()) {
      setError("The two names need to be different.");
      return;
    }

    setError(null);
    onStart(first, second);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-base font-semibold text-stone-900">Player names</h2>
      <p className="mt-1 text-sm text-stone-600">These are saved with the match when you stop playing.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Player 1</span>
          <input
            className={inputClasses}
            value={playerOne}
            onChange={(event) => setPlayerOne(event.target.value)}
            placeholder="Name"
            maxLength={24}
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Player 2</span>
          <input
            className={inputClasses}
            value={playerTwo}
            onChange={(event) => setPlayerTwo(event.target.value)}
            placeholder="Name"
            maxLength={24}
            autoComplete="off"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
