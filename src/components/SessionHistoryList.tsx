import type { GameSession } from "../lib/api";

interface SessionHistoryListProps {
  sessions: GameSession[];
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const day = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} · ${time}`;
}

export default function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  return (
    <ul className="divide-y divide-stone-100 overflow-hidden rounded-lg border border-stone-200 bg-white">
      {sessions.map((session) => {
        const oneWon = session.winner === session.playerOne;
        const twoWon = session.winner === session.playerTwo;

        return (
          <li
            key={session.id}
            className="grid grid-cols-1 gap-3 px-4 py-4 transition-colors duration-150 hover:bg-stone-50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="truncate text-sm">
                <span className={oneWon ? "font-semibold text-accent" : "font-medium text-stone-800"}>
                  {session.playerOne}
                </span>
                <span className="mx-2 text-stone-400">vs</span>
                <span className={twoWon ? "font-semibold text-accent" : "font-medium text-stone-800"}>
                  {session.playerTwo}
                </span>
              </p>

              <p className="mt-1 text-xs text-stone-500">
                {session.playerOneScore} – {session.playerTwoScore}
                {session.draws > 0 && ` · ${session.draws} ${session.draws === 1 ? "draw" : "draws"}`}
                {` · ${session.rounds.length} ${session.rounds.length === 1 ? "round" : "rounds"}`}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-stone-700">
                {session.winner ? `${session.winner} won` : "Drawn"}
              </p>
              <p className="mt-0.5 text-xs text-stone-500">{formatDateTime(session.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
