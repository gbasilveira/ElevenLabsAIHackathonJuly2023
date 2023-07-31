import SQLite3Database from "./Database";
import { Configuration, OpenAIApi } from "openai";
import { Settings } from "./types/Settings";
import { GPTMessage } from "./types/GPTMessage";

class GPTChat {
  private openai: any; // OpenAI API instance

  constructor(settings: Settings) {
    const configuration = new Configuration({
      apiKey: settings.openai.apiKey
    });

    this.openai = new OpenAIApi(configuration);
  }

  async newMessage(history: GPTMessage[]): Promise<GPTMessage> {
    // Prepare the messages for OpenAI API input

    const messages = history.map((event) => {
      let content = "";

      return {
        role: event.role,
        content: event.message || "",
      }
    });

    // Call OpenAI API to get the response
    try {
      const completion = {
        // model: "gpt-3.5-turbo",
        model: "gpt-3.5-turbo-16k",
        messages: messages,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      };

      const response = await this.openai.createChatCompletion(completion);

      // Parse the response from OpenAI
      const assistantResponse = JSON.parse(response.data.choices[0].message.content) as any

      return assistantResponse;
    } catch (e: any) {
      throw new Error(`Error calling OpenAI API: ${e.message}`);
    }
  }
}

export default GPTChat;
