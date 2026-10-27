"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerSetupForm from "../components/PlayerSetupForm";
import SessionHistoryList from "../components/SessionHistoryList";
import { getSessions, type GameSession } from "../lib/api";

export default function HomePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [gameSearch, setGameSearch] = useState("");

  const normalizedSearch = gameSearch.trim().toLocaleLowerCase();
  const filteredSessions = normalizedSearch
    ? sessions.filter(
        (session) =>
          session.playerOne.toLocaleLowerCase().includes(normalizedSearch) ||
          session.playerTwo.toLocaleLowerCase().includes(normalizedSearch),
      )
    : sessions;

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      setSessions(await getSessions());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load previous games.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  function handleStart(playerOne: string, playerTwo: string) {
    const params = new URLSearchParams({ playerOne, playerTwo });
    router.push(`/play?${params.toString()}`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="border-b border-stone-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          Tic-Tac-Toe
        </h1>
        <p className="mt-2 max-w-prose text-sm text-stone-600">
          Play one round at a time. After each round you can keep going or stop and save the match
          to the history below.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
        {isSettingUp ? (
          <PlayerSetupForm onStart={handleStart} onCancel={() => setIsSettingUp(false)} />
        ) : (
          <>
            <h2 className="text-base font-semibold text-stone-900">Let's Play!</h2>
            <p className="mt-1 text-sm text-stone-600">
              Enter both player names to open the board.
            </p>
            <button
              type="button"
              onClick={() => setIsSettingUp(true)}
              className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Start New Game
            </button>
          </>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold text-stone-900">
            Previous games
            {sessions.length > 0 && (
              <span className="ml-2 text-sm font-normal text-stone-500">
                {sessions.length} saved
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={loadSessions}
            disabled={isLoading}
            className="text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover disabled:cursor-not-allowed disabled:text-stone-400"
          >
            {isLoading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="mt-3">
          {isLoading ? (
            <p className="rounded-lg border border-stone-200 bg-white px-4 py-6 text-sm text-stone-500">
              Loading games…
            </p>
          ) : loadError ? (
            <div className="rounded-lg border border-stone-200 bg-white px-4 py-6">
              <p className="text-sm text-red-700">{loadError}</p>
              <button
                type="button"
                onClick={loadSessions}
                className="mt-3 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50"
              >
                Try again
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-8 text-center">
              <p className="text-sm text-stone-700">No games saved yet.</p>
              <p className="mt-1 text-sm text-stone-500">
                Your saved matches will appear here once you finish a round.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block">
                <span className="sr-only">Search previous games by player name</span>
                <input
                  type="search"
                  value={gameSearch}
                  onChange={(event) => setGameSearch(event.target.value)}
                  placeholder="Search player names"
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>
              {filteredSessions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-6 text-center text-sm text-stone-500">
                  No previous games match “{gameSearch.trim()}”.
                </p>
              ) : (
                <SessionHistoryList sessions={filteredSessions} />
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
