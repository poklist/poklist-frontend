// Idempotency-Key（BE §1）：一次使用者操作一個 key；重送同一份內容沿用原 key，內容改變才換新 key
export interface IdempotencyEntry {
  payload: string;
  key: string;
}

export const resolveIdempotencyKey = (
  previous: IdempotencyEntry | undefined,
  payload: string,
  createKey: () => string = () => crypto.randomUUID()
): IdempotencyEntry =>
  previous?.payload === payload ? previous : { payload, key: createKey() };
