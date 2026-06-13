import { kanaRomajiTable } from "@/app/apps/nishida/_lib/romaji-table";

export type TypingUnit = Readonly<{
  /** このユニットが表すかな(「っこ」「んじ」のように結合済みの場合がある)。 */
  kana: string;
  /** 受け付けるローマ字綴りの一覧。同一ユニット内でprefix関係を持たない。 */
  alternatives: readonly string[];
}>;

export type TypingSession = Readonly<{
  units: readonly TypingUnit[];
  /** 現在入力中のユニットの位置。units.lengthに達したら完了。 */
  unitIndex: number;
  /** 現在のユニットで入力済みのキー列。 */
  typedInUnit: string;
  /** typedInUnitと矛盾しない綴りの残り候補。 */
  candidates: readonly string[];
  /** 完了済みユニットの確定した綴りの連結。 */
  completedRomaji: string;
}>;

export type TypeKeyResult = Readonly<{
  session: TypingSession;
  kind: "hit" | "miss" | "completed";
}>;

export class UnsupportedKanaError extends Error {
  readonly kana: string;

  constructor(kana: string) {
    super(`変換表にないかな「${kana}」が含まれています`);
    this.name = "UnsupportedKanaError";
    this.kana = kana;
  }
}

const MAX_UNIT_LENGTH = Math.max(...Object.keys(kanaRomajiTable).map((key) => key.length));

/**
 * 読みを入力ユニットの列へ変換する。
 *
 * 変換表は「んっきゃ」のような、綴りが前後関係に依存する組み合わせまで
 * 展開済みなので、ここでは最長一致でキーを引くだけでよい。
 */
export function buildUnits(reading: string): TypingUnit[] {
  const units: TypingUnit[] = [];
  let index = 0;

  while (index < reading.length) {
    let matched: TypingUnit | undefined;
    const maxLength = Math.min(MAX_UNIT_LENGTH, reading.length - index);
    for (let length = maxLength; length >= 1; length--) {
      const kana = reading.slice(index, index + length);
      const alternatives = kanaRomajiTable[kana];
      if (alternatives) {
        matched = { kana, alternatives };
        index += length;
        break;
      }
    }
    if (!matched) {
      throw new UnsupportedKanaError(reading[index]);
    }
    units.push(matched);
  }

  return units;
}

export function createSession(reading: string): TypingSession {
  const units = buildUnits(reading);
  return {
    units,
    unitIndex: 0,
    typedInUnit: "",
    candidates: units.length > 0 ? units[0].alternatives : [],
    completedRomaji: "",
  };
}

export function isCompleted(session: TypingSession): boolean {
  return session.unitIndex >= session.units.length;
}

export function typeKey(session: TypingSession, key: string): TypeKeyResult {
  if (isCompleted(session)) {
    return { session, kind: "miss" };
  }

  const position = session.typedInUnit.length;
  const remaining = session.candidates.filter((c) => c[position] === key);
  if (remaining.length === 0) {
    return { session, kind: "miss" };
  }

  const typed = session.typedInUnit + key;
  const exact = remaining.find((c) => c.length === typed.length);
  if (!exact) {
    return {
      session: { ...session, typedInUnit: typed, candidates: remaining },
      kind: "hit",
    };
  }

  const unitIndex = session.unitIndex + 1;
  const nextSession: TypingSession = {
    ...session,
    unitIndex,
    typedInUnit: "",
    candidates: unitIndex < session.units.length ? session.units[unitIndex].alternatives : [],
    completedRomaji: session.completedRomaji + exact,
  };
  return {
    session: nextSession,
    kind: unitIndex >= session.units.length ? "completed" : "hit",
  };
}

/** 確定済み + 入力中のローマ字。画面の「打った部分」の表示に使う。 */
export function getTypedRomaji(session: TypingSession): string {
  return session.completedRomaji + session.typedInUnit;
}

function shortest(values: readonly string[]): string {
  return values.reduce((best, value) => (value.length < best.length ? value : best));
}

/** 残りの最短ローマ字。入力済みのキーと矛盾しない綴りへ追従する。 */
export function getRemainingRomaji(session: TypingSession): string {
  if (isCompleted(session)) {
    return "";
  }
  const current = shortest(session.candidates).slice(session.typedInUnit.length);
  const rest = session.units
    .slice(session.unitIndex + 1)
    .map((unit) => shortest(unit.alternatives))
    .join("");
  return current + rest;
}
