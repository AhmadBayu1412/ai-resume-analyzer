/**
 * Represents a file system item within the Puter environment.
 */
interface FSItem {
  /** Unique identifier for the item. */
  id: string;
  /** Unique user-assigned identifier. */
  uid: string;
  /** Name of the file or directory. */
  name: string;
  /** Full system path. */
  path: string;
  /** Boolean indicating if the item is a directory. */
  is_dir: boolean;
  /** ID of the parent directory. */
  parent_id: string;
  /** UID of the parent directory. */
  parent_uid: string;
  /** Creation timestamp (Unix epoch). */
  created: number;
  /** Last modification timestamp (Unix epoch). */
  modified: number;
  /** Last access timestamp (Unix epoch). */
  accessed: number;
  /** Size in bytes, null if not applicable (e.g., directory). */
  size: number | null;
  /** Permission flag indicating write access. */
  writable: boolean;
}

/**
 * Represents a user profile within the Puter system.
 */
interface PuterUser {
  /** Unique user identifier (UUID). */
  uuid: string;
  /** Display username. */
  username: string;
}

/**
 * Represents a key-value pair, typically used for storage settings.
 */
interface KVItem {
  key: string;
  value: string;
}

/**
 * Defines the content structure for a chat message, supporting both text and file references.
 */
interface ChatMessageContent {
  /** Type of content being sent. */
  type: "file" | "text";
  /** Path reference if the type is 'file'. */
  puter_path?: string;
  /** Text body if the type is 'text'. */
  text?: string;
}

/**
 * Represents a single message in a chat conversation.
 */
interface ChatMessage {
  /** The source or role of the message. */
  role: "user" | "assistant" | "system";
  /** The message payload, either a raw string or an array of rich content items. */
  content: string | ChatMessageContent[];
}

/**
 * Configuration options for AI chat requests.
 */
interface PuterChatOptions {
  /** The specific AI model to utilize. */
  model?: string;
  /** Whether to enable streaming responses. */
  stream?: boolean;
  /** Maximum number of tokens for the generated response. */
  max_tokens?: number;
  /** Sampling temperature (creativity level). */
  temperature?: number;
  /** Definitions for external functions/tools the model can execute. */
  tools?: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: { type: string; properties: {} };
    }[];
  };
}

/**
 * The standard response object returned by the AI service.
 */
interface AIResponse {
  /** Index of the choice in the response array. */
  index: number;
  /** The actual message object returned by the AI. */
  message: {
    role: string;
    content: string | any[];
    refusal: null | string;
    annotations: any[];
  };
  /** Token probability information (if requested). */
  logprobs: null | any;
  /** Reason why the generation finished (e.g., 'stop', 'length'). */
  finish_reason: string;
  /** Usage statistics regarding tokens and cost. */
  usage: {
    type: string;
    model: string;
    amount: number;
    cost: number;
  }[];
  /** Boolean indicator if the response was processed via the AI chat service. */
  via_ai_chat_service: boolean;
}
