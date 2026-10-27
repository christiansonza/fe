interface ScoreBoardProps {
  playerOne: string;
  playerTwo: string;
  playerOneScore: number;
  playerTwoScore: number;
  draws: number;
  activePlayer: string | null;
}

interface PlayerScoreProps {
  name: string;
  score: number;
  isActive: boolean;
  align: "left" | "right";
}

function PlayerScore({ name, score, isActive, align }: PlayerScoreProps) {
  return (
    <div className={`px-4 py-4 ${align === "right" ? "text-right" : "text-left"}`}>
      <p
        className={`truncate border-t-2 pt-2 text-sm font-medium ${
          isActive ? "border-accent text-accent" : "border-transparent text-stone-600"
        }`}
      >
        {name}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-stone-900">{score}</p>
    </div>
  );
}

export default function ScoreBoard({
  playerOne,
  playerTwo,
  playerOneScore,
  playerTwoScore,
  draws,
  activePlayer,
}: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-stone-200 bg-white">
      <PlayerScore name={playerOne} score={playerOneScore} isActive={activePlayer === playerOne} align="left" />
      <div className="border-x border-stone-200 px-3 py-4 text-center">
        <p className="border-t-2 border-transparent pt-2 text-sm font-medium text-stone-600">Draws</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-stone-700">{draws}</p>
      </div>
      <PlayerScore name={playerTwo} score={playerTwoScore} isActive={activePlayer === playerTwo} align="right" />
    </div>
  );
}
