"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameBoard from "../../components/GameBoard";
import ScoreBoard from "../../components/ScoreBoard";
import { createSession, type RoundMove, type RoundRecord } from "../../lib/api";
import {
  createBoard,
  getWinner,
  isBoardFull,
  otherMark,
  type Board,
  type Mark,
} from "../../lib/gameLogic";

interface RoundResult {
  winner: string | null;
  line: number[];
}

const primaryButton =
  "rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300";

const secondaryButton =
  "rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors duration-150 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-white";

function pluralDraws(count: number): string {
  return `${count} ${count === 1 ? "draw" : "draws"}`;
}

function PlaySession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerOne = searchParams.get("playerOne")?.trim() ?? "";
  const playerTwo = searchParams.get("playerTwo")?.trim() ?? "";

  const [board, setBoard] = useState<Board>(createBoard);
  const [startingMark, setStartingMark] = useState<Mark>("X");
  const [currentMark, setCurrentMark] = useState<Mark>("X");
  const [round, setRound] = useState(1);
  const [moves, setMoves] = useState<RoundMove[]>([]);
  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [scores, setScores] = useState({ playerOne: 0, playerTwo: 0, draws: 0 });
  const [result, setResult] = useState<RoundResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerOne || !playerTwo) {
      router.replace("/");
    }
  }, [playerOne, playerTwo, router]);

  const playerForMark = useCallback(
    (mark: Mark) => (mark === startingMark ? playerOne : playerTwo),
    [startingMark, playerOne, playerTwo],
  );

  function finishRound(roundMoves: RoundMove[], winner: string | null, line: number[]) {
    setRounds((previous) => [...previous, { round, winner, winningLine: line, moves: roundMoves }]);
    setScores((previous) => {
      if (winner === null) {
        return { ...previous, draws: previous.draws + 1 };
      }

      return winner === playerOne
        ? { ...previous, playerOne: previous.playerOne + 1 }
        : { ...previous, playerTwo: previous.playerTwo + 1 };
    });
    setResult({ winner, line });
  }

  function handleSelectCell(cell: number) {
    if (result || isSaving || board[cell]) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[cell] = currentMark;

    const nextMoves = [...moves, { player: playerForMark(currentMark), mark: currentMark, cell }];

    setBoard(nextBoard);
    setMoves(nextMoves);

    const win = getWinner(nextBoard);

    if (win) {
      finishRound(nextMoves, playerForMark(win.mark), win.line);
    } else if (isBoardFull(nextBoard)) {
      finishRound(nextMoves, null, []);
    } else {
      setCurrentMark(otherMark(currentMark));
    }
  }

  function handleContinue() {
    const nextStartingMark = otherMark(startingMark);

    setStartingMark(nextStartingMark);
    setCurrentMark(nextStartingMark);
    setRound((previous) => previous + 1);
    setBoard(createBoard());
    setMoves([]);
    setResult(null);
    setSaveError(null);
  }

  async function handleStop() {
    if (isSaving || rounds.length === 0) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const winner =
      scores.playerOne === scores.playerTwo
        ? null
        : scores.playerOne > scores.playerTwo
          ? playerOne
          : playerTwo;

    try {
      await createSession({
        playerOne,
        playerTwo,
        playerOneScore: scores.playerOne,
        playerTwoScore: scores.playerTwo,
        draws: scores.draws,
        winner,
        rounds,
      });

      router.push("/");
    } catch (error) {
      setIsSaving(false);
      setSaveError(error instanceof Error ? error.message : "Could not save the game.");
    }
  }

  if (!playerOne || !playerTwo) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-14 text-sm text-stone-500">
        Redirecting to the game list…
      </main>
    );
  }

  const activePlayer = result ? null : playerForMark(currentMark);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex items-start justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-sm text-stone-500">Round {round}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            {playerOne} vs {playerTwo}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleStop}
          disabled={rounds.length === 0 || isSaving}
          className={secondaryButton}
        >
          Stop match
        </button>
      </header>

      <div className="mt-6">
        <ScoreBoard
          playerOne={playerOne}
          playerTwo={playerTwo}
          playerOneScore={scores.playerOne}
          playerTwoScore={scores.playerTwo}
          draws={scores.draws}
          activePlayer={activePlayer}
        />
      </div>

      <div className="mt-6">
        <GameBoard
          board={board}
          currentMark={currentMark}
          winningLine={result?.line ?? []}
          disabled={Boolean(result) || isSaving}
          onSelectCell={handleSelectCell}
        />
      </div>

      <p className="mt-4 text-sm text-stone-600" aria-live="polite">
        {result
          ? result.winner
            ? `${result.winner} wins round ${round}.`
            : `Round ${round} is a draw.`
          : `${playerForMark(currentMark)}'s turn to play ${currentMark}.`}
      </p>

      {result && (
        <section className="mt-4 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-base font-semibold text-stone-900">
            {result.winner ? `${result.winner} takes the round` : "The round is a draw"}
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Score {scores.playerOne} – {scores.playerTwo}, {pluralDraws(scores.draws)} so far.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={handleContinue} disabled={isSaving} className={primaryButton}>
              Continue
            </button>
            <button type="button" onClick={handleStop} disabled={isSaving} className={secondaryButton}>
              {isSaving ? "Saving…" : "Stop"}
            </button>
          </div>
        </section>
      )}

      {saveError && <p className="mt-4 text-sm text-red-700">{saveError}</p>}
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-xl px-4 py-14 text-sm text-stone-500">Loading match…</main>
      }
    >
      <PlaySession />
    </Suspense>
  );
}
