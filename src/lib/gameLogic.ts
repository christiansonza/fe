export type Mark = "X" | "O";

export type Cell = Mark | null;

export type Board = Cell[];

export interface WinResult {
  mark: Mark;
  line: number[];
}

const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createBoard(): Board {
  return Array<Cell>(9).fill(null);
}

export function getWinner(board: Board): WinResult | null {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    const mark = board[first];

    if (mark && mark === board[second] && mark === board[third]) {
      return { mark, line };
    }
  }

  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function isRoundOver(board: Board): boolean {
  return getWinner(board) !== null || isBoardFull(board);
}

export function otherMark(mark: Mark): Mark {
  return mark === "X" ? "O" : "X";
}
