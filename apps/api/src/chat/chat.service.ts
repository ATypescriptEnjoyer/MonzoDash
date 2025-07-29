import { Injectable, Logger } from '@nestjs/common';
import { Ollama } from "@langchain/ollama";
import { Transactions } from '../transactions/schemas/transactions.schema';
import { AIOSystemPrompt, AnswerSystemPrompt, ChatSystemPrompt } from './prompts';
import dayjs from 'dayjs';

const { OLLAMA_BASE_URL, USE_AIO_MODEL } = process.env;

interface ChatResponse {
  response: string;
}

interface ModelConfig {
  temperature: number;
  maxRetries: number;
  baseUrl: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly answerModel: Ollama;
  private readonly chatModel: Ollama;
  private readonly aioModel: Ollama;

  private readonly answerModelName = "qwen3:4b";
  private readonly chatModelName = "gemma3:4b";
  private readonly aioModelName = "qwen2.5:32b-instruct-q2_K";

  private readonly baseConfig: ModelConfig = {
    temperature: 0,
    maxRetries: 2,
    baseUrl: OLLAMA_BASE_URL,
  };

  constructor() {
    this.answerModel = new Ollama({
      model: this.answerModelName,
      ...this.baseConfig
    });
    this.chatModel = new Ollama({
      model: this.chatModelName,
      ...this.baseConfig
    });
    this.aioModel = new Ollama({
      model: this.aioModelName,
      ...this.baseConfig
    });
  }

  private formatTransactions(transactions: Transactions[]): string {
    return transactions
      .map(tx =>
        `Id = ${tx.id}, Merchant = ${tx.description}, Amount = ${tx.amount.toFixed(2)}, Category = ${tx.category}, Date = ${dayjs(tx.created).format('YYYY-MM-DD')}`
      )
      .join('\n');
  }

  private async invokeModel(model: Ollama, messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await model.invoke(messages);
      return response;
    } catch (error) {
      this.logger.error(`Error invoking model: ${error.message}`, error.stack);
      throw new Error(`Failed to get response from AI model: ${error.message}`);
    }
  }

  private extractResponseFromThinking(response: string): string {
    const thinkSplit = response.split("</think>");
    return thinkSplit[thinkSplit.length - 1] || response;
  }

  private async handleAioModel(prompt: string, docs: string): Promise<string> {
    this.logger.log("Using AIO model for chat response");

    const response = await this.invokeModel(this.aioModel, [
      { role: 'system', content: AIOSystemPrompt(docs) },
      { role: 'user', content: prompt }
    ]);

    return this.extractResponseFromThinking(response);
  }

  private async handleTwoStageModel(prompt: string, docs: string): Promise<string> {
    this.logger.log("Using two-stage model (answer + chat) for chat response");

    const answer = await this.invokeModel(this.answerModel, [
      { role: 'system', content: AnswerSystemPrompt(docs) },
      { role: 'user', content: prompt }
    ]);

    const answerResponse = this.extractResponseFromThinking(answer);
    this.logger.debug(`Answer response: ${answerResponse}`);

    const chatPrompt = `
      Rewrite the following response in a concise, natural and human way: ${answerResponse}`;

    const chatResponse = await this.invokeModel(this.chatModel, [
      { role: 'system', content: ChatSystemPrompt },
      { role: 'user', content: chatPrompt }
    ]);

    this.logger.debug(`Chat response: ${chatResponse}`);

    return this.extractResponseFromThinking(chatResponse);
  }

  async chat(prompt: string, transactions: Transactions[]): Promise<ChatResponse> {
    if (!prompt?.trim()) {
      throw new Error('Prompt is required');
    }

    if (!Array.isArray(transactions)) {
      throw new Error('Transactions must be an array');
    }

    if (transactions.length === 0) {
      return { response: "You haven't had any transactions this month, so I can't answer your question!" };
    }

    const docs = this.formatTransactions(transactions);
    let chatResponse: string;

    try {
      if (USE_AIO_MODEL === "true") {
        chatResponse = await this.handleAioModel(prompt, docs);
      } else {
        chatResponse = await this.handleTwoStageModel(prompt, docs);
      }

      // Replace $ with £ for proper currency display
      const formattedResponse = chatResponse.replaceAll("$", "£");

      return { response: formattedResponse };
    } catch (error) {
      this.logger.error(`Chat service error: ${error.message}`, error.stack);
      throw error;
    }
  }
}