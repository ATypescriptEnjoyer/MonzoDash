import { Injectable } from '@nestjs/common';
import { Ollama } from "@langchain/ollama";
import { Transactions } from '../transactions/schemas/transactions.schema';

@Injectable()
export class ChatService {
  private readonly llm: Ollama;

  constructor() {
    this.llm = new Ollama({
      model: "deepseek-r1:1.5b",
      temperature: 0,
      maxRetries: 2,
      baseUrl: process.env.OLLAMA_BASE_URL,
    });
  }

  async chat(prompt: string, transactions: Transactions[]): Promise<AsyncGenerator<string>> {
    const docs = transactions.map(tx =>
      `£${tx.amount.toFixed(2)} at ${tx.description} on ${tx.created}`
    );

    const systemPrompt = `
      You are a helpful financial live chat assistant.
      You can analyze transaction data and provide insights about spending patterns, budgeting advice, and financial recommendations. 
      Always be concise and practical in your responses. Keep your response short and to the point.
      You can use **bold** markdown to format your responses, but no other formatting.
      You MUST keep your responses to 30 words or less.
      Do not mention any "based on the data" or "based on the transactions" in your responses.
      `;

    return this.llm.stream([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `User Transaction History:\n ${docs.join('\n')}\n\nUser Question: ${prompt}` }
    ], {});
  }
}