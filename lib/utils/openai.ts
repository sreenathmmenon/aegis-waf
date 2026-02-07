import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Claude client (Anthropic SDK)
let claude: any = null;
try {
  // Dynamically import Anthropic SDK if available
  if (process.env.ANTHROPIC_API_KEY) {
    import('@anthropic-ai/sdk').then(module => {
      const Anthropic = module.default;
      claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }).catch(() => {
      console.log('Anthropic SDK not available, using OpenAI only');
    });
  }
} catch (e) {
  // Claude SDK not installed, that's fine
}

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  provider?: 'openai' | 'claude';
}

/**
 * Call GPT model with system and user prompts (backward compatible)
 * @param systemPrompt - The system prompt to set context
 * @param userPrompt - The user's input/question
 * @returns The model's response as a string
 */
export async function callGPT(
  systemPrompt: string,
  userPrompt: string
): Promise<string>;

/**
 * Call LLM with messages array (supports OpenAI and Claude)
 * @param messages - Array of conversation messages
 * @param options - Model configuration
 * @returns The model's response as a string
 */
export async function callGPT(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<string>;

export async function callGPT(
  systemPromptOrMessages: string | LLMMessage[],
  userPromptOrOptions?: string | LLMOptions
): Promise<string> {
  try {
    // Parse arguments
    let messages: LLMMessage[];
    let options: LLMOptions = {};

    if (typeof systemPromptOrMessages === 'string') {
      // Legacy signature: callGPT(systemPrompt, userPrompt)
      messages = [
        { role: 'system', content: systemPromptOrMessages },
        { role: 'user', content: userPromptOrOptions as string }
      ];
    } else {
      // New signature: callGPT(messages, options)
      messages = systemPromptOrMessages;
      options = userPromptOrOptions as LLMOptions || {};
    }

    const provider = options.provider || 'openai';

    // Call Claude if requested and available
    if (provider === 'claude' && claude) {
      return await callClaude(messages, options);
    }

    // Default to OpenAI
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: messages as any,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.max_tokens ?? 500,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling LLM:', error);
    return 'Unable to process request at this time';
  }
}

/**
 * Call Claude API
 * @param messages - Conversation messages
 * @param options - Model configuration
 * @returns Claude's response
 */
async function callClaude(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<string> {
  if (!claude) {
    throw new Error('Claude SDK not initialized');
  }

  // Extract system message
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await claude.messages.create({
    model: options.model || 'claude-3-haiku-20240307',
    max_tokens: options.max_tokens ?? 500,
    temperature: options.temperature ?? 0.3,
    system: systemMessage?.content || undefined,
    messages: conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  });

  return response.content[0]?.text || 'No response generated';
}

/**
 * Get embedding vector for a given text
 * @param text - The text to generate embeddings for
 * @returns Array of numbers representing the embedding
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Fallback behavior - return empty embedding
    return [];
  }
}

/**
 * Call GPT with structured JSON output
 * @param systemPrompt - The system prompt to set context
 * @param userPrompt - The user's input/question
 * @param schema - Expected JSON structure
 * @returns Parsed JSON response
 */
export async function callGPTStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  schema?: object
): Promise<T | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\nYou must respond with valid JSON only, no other text.${schema ? `\n\nExpected schema: ${JSON.stringify(schema)}` : ''}`
        },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as T;
  } catch (error) {
    console.error('Error calling GPT with structured output:', error);
    return null;
  }
}

// Export the client instance for direct use if needed
export { openai };