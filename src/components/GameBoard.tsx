import type { Board, Mark } from "../lib/gameLogic";

interface GameBoardProps {
  board: Board;
  currentMark: Mark;
  winningLine: number[];
  disabled: boolean;
  onSelectCell: (cell: number) => void;
}

export default function GameBoard({
  board,
  currentMark,
  winningLine,
  disabled,
  onSelectCell,
}: GameBoardProps) {
  return (
    <div className="grid aspect-square w-full grid-cols-3 grid-rows-3 gap-2 sm:gap-3">
      {board.map((mark, cell) => {
        const isWinningCell = winningLine.includes(cell);
        const isPlayable = !disabled && mark === null;

        return (
          <button
            key={cell}
            type="button"
            onClick={() => onSelectCell(cell)}
            disabled={!isPlayable}
            data-preview-mark={isPlayable ? currentMark : undefined}
            aria-label={`Cell ${cell + 1}${mark ? `, ${mark}` : ", empty"}`}
            className={`flex items-center justify-center rounded-lg border text-4xl font-semibold transition-colors duration-150 select-none sm:text-5xl ${
              isWinningCell ? "border-accent bg-accent-soft" : "border-stone-200 bg-white"
            } ${
              isPlayable
                ? "cursor-pointer hover:border-stone-300 hover:bg-stone-50"
                : "cursor-not-allowed"
            } ${mark === "X" ? "text-accent" : "text-stone-800"}`}
          >
            {mark}
          </button>
        );
      })}
    </div>
  );
}
