import type { Mark } from "./gameLogic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export interface RoundMove {
  player: string;
  mark: Mark;
  cell: number;
}

export interface RoundRecord {
  round: number;
  winner: string | null;
  winningLine: number[];
  moves: RoundMove[];
}

export interface GameSessionInput {
  playerOne: string;
  playerTwo: string;
  playerOneScore: number;
  playerTwoScore: number;
  draws: number;
  winner: string | null;
  rounds: RoundRecord[];
}

export interface GameSession extends GameSessionInput {
  id: string;
  createdAt: string;
}

interface StoredSession extends GameSessionInput {
  id?: string;
  _id?: string;
  createdAt?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function toGameSession(session: StoredSession): GameSession {
  return {
    ...session,
    id: String(session.id ?? session._id),
    createdAt: session.createdAt ?? new Date().toISOString(),
  };
}

export async function getSessions(): Promise<GameSession[]> {
  const sessions = await request<StoredSession[]>("/games");
  return sessions.map(toGameSession);
}

export async function getSession(id: string): Promise<GameSession> {
  return request<StoredSession>(`/games/${id}`).then(toGameSession);
}

export async function createSession(input: GameSessionInput): Promise<GameSession> {
  return request<StoredSession>("/games", {
    method: "POST",
    body: JSON.stringify(input),
  }).then(toGameSession);
}
