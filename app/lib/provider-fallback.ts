export type ProviderName = "puter" | "openrouter";

export type ChatPayload = {
  prompt: string | unknown[];
  imageURL?: string | File | Blob | null;
  testMode?: boolean;
  options?: Record<string, unknown>;
};

export interface AiProvider {
  name: ProviderName | string;
  enabled: boolean;
  chat: (payload: ChatPayload) => Promise<any>;
}

export interface FallbackLogItem {
  provider: string;
  attempt: number;
  error: unknown;
}

export interface FallbackResult<T = unknown> {
  data: T;
  provider: string;
  attempts: number;
}

export interface FallbackOptions {
  delayMs?: number;
  onFallback?: (item: FallbackLogItem) => void;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;

  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export function shouldFallback(err: unknown): boolean {
  const message = getErrorMessage(err).toLowerCase();

  console.log("[Fallback Checker]", message);

  return [
    "429",
    "402",
    "rate limit",
    "too many requests",
    "timeout",
    "timed out",
    "network",
    "fetch",
    "failed to fetch",
    "service unavailable",
    "temporarily unavailable",
    "overloaded",
    "bad gateway",
    "gateway timeout",

    // OPENROUTER
    "no endpoints found",
    "provider unavailable",
    "model overloaded",
    "invalid model",
    "unsupported model",
    "not found",

    // PUTER QUOTA
    "quota",
    "credits",
    "insufficient_funds",
    "payment required",
    "no usage left for request",
    "low balance",
    "billing",

    // GENERIC
    "server error",
    "internal error",
  ].some((keyword) => message.includes(keyword));
}

export async function runWithFallback<T>(
  providers: AiProvider[],
  payload: ChatPayload,
  options: FallbackOptions = {}
): Promise<FallbackResult<T>> {
  const activeProviders = providers.filter((p) => p.enabled);

  if (!activeProviders.length) {
    throw new Error("No AI providers enabled");
  }

  let lastError: unknown;

  for (let i = 0; i < activeProviders.length; i++) {
    const provider = activeProviders[i];

    try {
      const data = await provider.chat(payload);

      return {
        data,
        provider: provider.name,
        attempts: i + 1,
      };
    } catch (err) {
      lastError = err;

      options.onFallback?.({
        provider: provider.name,
        attempt: i + 1,
        error: err,
      });

      const isLast = i === activeProviders.length - 1;

      if (isLast || !shouldFallback(err)) {
        throw err;
      }

      if (options.delayMs) {
        await sleep(options.delayMs);
      }
    }
  }

  throw lastError;
}