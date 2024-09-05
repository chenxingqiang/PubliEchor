// chrome-extension/lib/background/queryOptimizer.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function optimizeQuery(originalQuery: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that optimizes search queries for academic research. Your task is to take a given query and improve it for use in Google Scholar searches.',
        },
        {
          role: 'user',
          content: `Please optimize the following search query for Google Scholar: "${originalQuery}"`,
        },
      ],
      max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error optimizing query:', error);
    return originalQuery; // 如果优化失败，返回原始查询
  }
}
