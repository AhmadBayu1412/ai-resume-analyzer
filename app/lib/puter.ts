import { create } from "zustand";
import { runWithFallback, type AiProvider } from "./provider-fallback";

const RESUME_SYSTEM_PROMPT = `You are an expert Applicant Tracking System (ATS) and professional Resume Reviewer. Your task is to deeply analyze the provided resume and evaluate it based on industry standards, ATS readability, and overall impact.

CRITICAL INSTRUCTION:
You must output YOUR ENTIRE RESPONSE as a single, strictly valid, unescaped JSON object. Do NOT wrap the response in markdown code blocks (e.g., do not use \`\`\`json or \`\`\`). Do NOT include any conversational text.

Evaluate the resume and populate exactly this JSON structure:
{
  "candidateInfo": {
    "name": "Extracted full name, or null if not found",
    "email": "Extracted email, or null if not found",
    "phone": "Extracted phone number, or null if not found",
    "address": "Extracted city/address, or null if not found"
  },
  "overallScore": 0,
  "quickSummary": "Write a 2-3 sentence overall summary. State 1 main strength, and summarize the most critical areas to improve across all categories (tone, content, structure, skills) into a cohesive.",
  "metrics": {
    "atsScore": 0,
    "keywordMatch": 0,
    "readability": 0
  },
  "feedback": {
    "toneAndStyle": {
      "score": 0,
      "tips": [
        {
          "type": "good" | "improve",
          "tip": "Short title",
          "explanation": "Detailed explanation"
        }
      ]
    },
    "content": {
      "score": 0,
      "tips": []
    },
    "structure": {
      "score": 0,
      "tips": []
    },
    "skills": {
      "score": 0,
      "tips": []
    }
  },
  "jobFit": {
    "targetRole": "Role identified in resume",
    "experienceLevel": "Entry/Mid/Senior Level",
    "matchPercentage": 0,
    "matchReasons": ["Short reason 1"],
    "improvementAreas": ["Short area 1"]
  }
}
Note: Ensure there are at least 2 tips for each feedback category and 2 items for match/improve.`;


declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<any>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<any>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<any[] | undefined>;
      };
      ai: {
        chat: (
          prompt: any,
          imageURL?: any,
          testMode?: boolean,
          options?: any
        ) => Promise<Object>;
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        del: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

type PuterUser = any;
type FSItem = any;
type ChatMessage = any;
type PuterChatOptions = any;
type AIResponse = any;
type KVItem = any;

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;
  
  aiModel: string;
  setAiModel: (model: string) => void;

  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };
  fs: {
    write: (
      path: string,
      data: string | File | Blob
    ) => Promise<File | undefined>;
    read: (path: string) => Promise<Blob | undefined>;
    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
    delete: (path: string) => Promise<void>;
    readDir: (path: string) => Promise<FSItem[] | undefined>;
  };
  ai: {
    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;
    /**
     * Menganalisis resume berdasarkan model AI yang sedang aktif.
     * @param resumePath - Path file PDF di Puter FS (untuk Puter AI)
     * @param imageBase64 - Base64 string image resume (untuk OpenRouter)
     * @param message - Instruksi tambahan (opsional)
     */
    feedback: (
      resumePath: string,
      imageBase64: string | null,
      message?: string
    ) => Promise<any | undefined>;
    img2txt: (
      image: string | File | Blob,
      testMode?: boolean
    ) => Promise<string | undefined>;
  };
  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (
      pattern: string,
      returnValues?: boolean
    ) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };

  init: () => void;
  clearError: () => void;
}

const SAFE_OPENROUTER_MODELS = [
  "openai/gpt-4o-mini",
  "google/gemini-2.0-flash-001",
  "anthropic/claude-3.5-sonnet",
];

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
        });
        return true;
      } else {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to check auth status";
      setError(msg);
      return false;
    }
  };

  const signIn = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    }
  };

  const signOut = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signOut();
      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setError(msg);
    }
  };

  const refreshUser = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = await puter.auth.getUser();
      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to refresh user";
      setError(msg);
    }
  };

  const init = (): void => {
    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) {
        setError("Puter.js failed to load within 10 seconds");
      }
    }, 10000);
  };

  const write = async (path: string, data: string | File | Blob) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.write(path, data);
  };

  const readDir = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.readdir(path);
  };

  const readFile = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.read(path);
  };

  const upload = async (files: File[] | Blob[]) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.upload(files);
  };

  const deleteFile = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.delete(path);
  };

  // ─────────────────────────────────────────────
  // Provider: Puter AI
  // ─────────────────────────────────────────────
  const createPuterProvider = (): AiProvider | null => {
    const puter = getPuter();
    if (!puter) return null;

    return {
      name: "puter",
      enabled: true,
      chat: async ({ prompt, imageURL, testMode, options }) => {
        const model = get().aiModel;
        const validatedModel =
        SAFE_OPENROUTER_MODELS.includes(model)
          ? model
          : "openai/gpt-4o-mini";
        const puterOptions: any = {
          ...(typeof options === "object" ? options : {}),
        };

        // Puter API tidak mendukung model format "provider/model" — hanya pakai model default jika demikian
        if (model && !model.includes("/") && model !== "puter") {
          puterOptions.model = model;
        }

        return puter.ai.chat(prompt as any, imageURL as any, testMode, puterOptions);
      },
    };
  };

  // ─────────────────────────────────────────────
  // Provider: OpenRouter
  // ─────────────────────────────────────────────
  const createOpenRouterProvider = (): AiProvider => {
    return {
      name: "openrouter",
      enabled: true,
      chat: async ({ prompt }) => {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
        if (!apiKey) throw new Error("OpenRouter API key missing");

        const model = get().aiModel;
        const validatedModel =
        SAFE_OPENROUTER_MODELS.includes(model)
          ? model
          : "openai/gpt-4o-mini";

        // Normalisasi pesan: buang konten { type: "file" } karena OpenRouter tidak bisa baca Puter FS
        let formattedMessages: any[] = [];

        if (typeof prompt === "string") {
          formattedMessages = [{ role: "user", content: prompt }];
        } else if (Array.isArray(prompt)) {
          formattedMessages = prompt.map((msg: any) => {
            if (Array.isArray(msg.content)) {
              // Pisahkan konten berdasarkan tipe
              const textParts = msg.content
                .filter((c: any) => c.type === "text")
                .map((c: any) => c.text || "")
                .join("\n\n");

              // Jika ada image base64 yang disisipkan, sertakan sebagai vision message
              const imageParts = msg.content
                .filter((c: any) => c.type === "image_url")
                .map((c: any) => ({ type: "image_url", image_url: c.image_url }));

              if (imageParts.length > 0) {
                // Vision message: gabungkan image + text
                return {
                  role: msg.role,
                  content: [
                    ...imageParts,
                    { type: "text", text: textParts },
                  ],
                };
              }

              // Jika tidak ada image, kirim sebagai teks biasa
              return { role: msg.role, content: textParts };
            }
            return msg;
          });
        }

        // Tentukan model OpenRouter yang akan dipakai:
        // Jika model bukan "puter" (artinya user pilih OpenRouter model), gunakan itu.
        // Jika model "puter" tapi kita ada di sini (fallback), gunakan model default OpenRouter.
        const FALLBACK_OPENROUTER_MODEL =
        "openai/gpt-4o-min";

        const openRouterModel =
          model !== "puter"
            ? model
            : FALLBACK_OPENROUTER_MODEL;

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: validatedModel,
              messages: formattedMessages,
            }),
          }
        );

        if (!response.ok) {
  const errorText = await response.text();

  console.warn(
    "[OpenRouter] Model gagal:",
    openRouterModel,
    errorText
  );

  // AUTO RETRY PAKAI MODEL CADANGAN
  if (
  errorText.toLowerCase().includes("no endpoints found") ||
  errorText.toLowerCase().includes("not found") ||
  errorText.toLowerCase().includes("invalid model")
){
    console.warn(
      "[OpenRouter] Switching to backup model..."
    );

    const retryResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-min",
          messages: formattedMessages,
        }),
      }
    );

    if (!retryResponse.ok) {
      const retryText = await retryResponse.text();
      throw new Error(
        `Backup OpenRouter Failed: ${retryText}`
      );
    }

    const retryData = await retryResponse.json();

    return {
      message: {
        content:
          retryData.choices?.[0]?.message?.content || "",
      },
    };
    }

    throw new Error(
      `OpenRouter Error ${response.status}: ${errorText}`
    );
  }

        const data = await response.json();

        return {
          message: {
            content: data.choices?.[0]?.message?.content || "",
          },
        };
      },
    };
  };

  // ─────────────────────────────────────────────
  // Fungsi chat utama dengan fallback otomatis
  // ─────────────────────────────────────────────
  const chat = async (
    prompt: string | ChatMessage[],
    imageURL?: string | PuterChatOptions,
    testMode?: boolean,
    options?: PuterChatOptions
  ) => {
    const puterProvider = createPuterProvider();
    const openRouterProvider = createOpenRouterProvider();

    if (!puterProvider) {
      setError("Puter provider not available");
      return;
    }

    const model = get().aiModel;
    const validatedModel =
      SAFE_OPENROUTER_MODELS.includes(model)
        ? model
        : "openai/gpt-4o-mini";
    // Jika model mengandung "/" berarti format OpenRouter (misal: "google/gemma-3-27b-it:free")
    const isOpenRouterModel = model !== "puter";

    // Urutan provider: jika pilih OpenRouter model → OpenRouter duluan, Puter sebagai fallback
    // Jika pilih Puter (default) → Puter duluan, OpenRouter sebagai fallback
    const providerOrder = isOpenRouterModel
      ? [openRouterProvider, puterProvider]
      : [puterProvider, openRouterProvider];

    console.log(
      `[AI Engine] Model: "${model}" | Route: ${isOpenRouterModel ? "OpenRouter → Puter" : "Puter → OpenRouter"}`
    );

    try {
      const result = await runWithFallback(
        providerOrder,
        { prompt, imageURL: imageURL as any, testMode, options },
        {
          delayMs: 0,
          onFallback: ({ provider, attempt, error }) => {
            console.warn(
              `[Fallback] Provider "${provider}" gagal (Attempt ${attempt}). Beralih ke provider berikutnya.`,
              error
            );
          },
        }
      );

      console.log(`[AI Engine] Berhasil via provider: "${result.provider}"`);
      return result.data as AIResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      setError(msg);
      throw err;
    }
  };

  // ─────────────────────────────────────────────
  // Fungsi feedback — model-aware
  //
  // Strategi pengiriman resume berdasarkan model:
  //
  // [Puter AI]
  //   → Kirim file lewat { type: "file", puter_path } (native Puter FS)
  //   → Fallback ke OpenRouter jika gagal (OpenRouter akan pakai imageBase64)
  //
  // [OpenRouter model]
  //   → Kirim resume sebagai base64 image (vision) langsung ke OpenRouter
  //   → TIDAK mengirim puter_path (OpenRouter tidak support Puter FS)
  //   → Fallback ke Puter jika OpenRouter gagal
  // ─────────────────────────────────────────────
  const feedback = async (
    resumePath: string,
    imageBase64: string | null,
    message?: string
  ) => {
    const model = get().aiModel;
    const isOpenRouterModel = model !== "puter";

    const finalPrompt = message
      ? `${RESUME_SYSTEM_PROMPT}\n\nUser Context/Request: ${message}`
      : RESUME_SYSTEM_PROMPT;

    if (isOpenRouterModel) {
      // ── MODE OPENROUTER ──────────────────────────────────────────────
      // OpenRouter tidak bisa baca Puter FS. Kita kirim resume sebagai
      // vision (image_url base64) agar model bisa "melihat" isi resume.

      if (!imageBase64) {
        throw new Error(
          "imageBase64 wajib diberikan saat menggunakan OpenRouter model. " +
          "Pastikan convertPdfToImage() dipanggil sebelum feedback()."
        );
      }

      const prompt = [
        {
          role: "user",
          content: [
            {
              // Sisipkan gambar resume dalam format yang dikenali OpenRouter vision
              type: "image_url",
              image_url: {
                url: imageBase64, // format: "data:image/png;base64,..."
              },
            },
            {
              type: "text",
              text: finalPrompt,
            },
          ],
        },
      ];

      return chat(prompt);
    } else {
      // ── MODE PUTER AI ────────────────────────────────────────────────
      // Puter AI mendukung { type: "file", puter_path } secara native.
      // Jika Puter gagal, fallback ke OpenRouter akan otomatis terjadi
      // lewat runWithFallback di dalam chat(). OpenRouter akan menerima
      // versi teks-only (tanpa puter_path) karena difilter oleh provider.
      //
      // ⚠️ Catatan: saat fallback ke OpenRouter dari mode Puter, kualitas
      // analisis mungkin sedikit berkurang karena file dikirim via teks saja.
      // Untuk hasil terbaik, user bisa langsung pilih model OpenRouter dari Navbar.

      const prompt = [
        {
          role: "user",
          content: [
            {
              type: "file",
              puter_path: resumePath,
            },
            {
              type: "text",
              text: finalPrompt,
            },
          ],
        },
      ];

      return chat(prompt);
    }
  };

  const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.ai.img2txt(image, testMode);
  };

  const getKV = async (key: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.get(key);
  };

  const setKV = async (key: string, value: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.set(key, value);
  };

  const deleteKV = async (key: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.del(key);
  };

  const listKV = async (pattern: string, returnValues?: boolean) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.list(pattern, returnValues ?? false);
  };

  const flushKV = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.flush();
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,

    aiModel: "puter",
    setAiModel: (model: string) => set({ aiModel: model }),

    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write: (path: string, data: string | File | Blob) => write(path, data),
      read: (path: string) => readFile(path),
      readDir: (path: string) => readDir(path),
      upload: (files: File[] | Blob[]) => upload(files),
      delete: (path: string) => deleteFile(path),
    },
    ai: {
      chat: (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
      ) => chat(prompt, imageURL, testMode, options),
      feedback: (resumePath: string, imageBase64: string | null, message?: string) =>
        feedback(resumePath, imageBase64, message),
      img2txt: (image: string | File | Blob, testMode?: boolean) =>
        img2txt(image, testMode),
    },
    kv: {
      get: (key: string) => getKV(key),
      set: (key: string, value: string) => setKV(key, value),
      delete: (key: string) => deleteKV(key),
      list: (pattern: string, returnValues?: boolean) =>
        listKV(pattern, returnValues),
      flush: () => flushKV(),
    },
    init,
    clearError: () => set({ error: null }),
  };
});