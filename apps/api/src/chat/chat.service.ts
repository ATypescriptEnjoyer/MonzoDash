import { Injectable } from '@nestjs/common';
import { Ollama } from "@langchain/ollama";
import { Transactions } from '../transactions/schemas/transactions.schema';
import { AnswerSystemPrompt, ChatSystemPrompt } from './prompts';
import dayjs from 'dayjs';

@Injectable()
export class ChatService {
  private readonly answerModel: Ollama;
  private readonly chatModel: Ollama;

  private readonly answerModelName = "phi4-mini-reasoning:latest";
  private readonly chatModelName = "gemma3:4b";

  constructor() {
    this.answerModel = new Ollama({
      model: this.answerModelName,
      temperature: 0,
      maxRetries: 2,
      baseUrl: process.env.OLLAMA_BASE_URL,
    });
    this.chatModel = new Ollama({
      model: this.chatModelName,
      temperature: 0,
      maxRetries: 2,
      baseUrl: process.env.OLLAMA_BASE_URL,
    });
  }

  async chat(prompt: string, transactions: Transactions[]): Promise<{ response: string }> {
    const docs = transactions.map(tx =>
      `Id = ${tx.id}, Merchant = ${tx.description}, Amount = ${tx.amount.toFixed(2)}, Category = ${tx.category}, Date = ${dayjs(tx.created).format('YYYY-MM-DD')}`
    ).join('\n');

    console.log("Sending prompt to answer model");

    const answer = await this.answerModel.invoke([
      { role: 'system', content: AnswerSystemPrompt },
      { role: 'user', content: `${docs}\n\nUser Question:\n\n${prompt}` }
    ]);

    //Support for thinking in the answer model
    const answerThinkSplit = answer.split("</think>");

    console.log("Sending prompt to chat model");

    const chatPrompt = `
    The user asked: ${prompt}, and the maths LLM answered ${answerThinkSplit[answerThinkSplit.length - 1]}. Rewrite this answer in a way that will present well in a chat interface.`;

    const chatResponse = await this.chatModel.invoke([
      { role: 'system', content: ChatSystemPrompt },
      { role: 'user', content: chatPrompt }
    ])

    //Support for thinking in the chat model
    const chatThinkSplit = chatResponse.split("</think>");

    return {
      response: chatThinkSplit[chatThinkSplit.length - 1].replaceAll("$", "£"), // The model won't use £, so we need to replace it
    };
  }
}