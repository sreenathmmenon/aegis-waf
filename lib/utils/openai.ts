import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Call GPT model with system and user prompts
 * @param systemPrompt - The system prompt to set context
 * @param userPrompt - The user's input/question
 * @returns The model's response as a string
 */
export async function callGPT(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling GPT:', error);
    // Fallback behavior - return a safe default response
    return 'Unable to process request at this time';
  }
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