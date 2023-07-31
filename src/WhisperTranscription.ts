import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import { Settings } from "./types/Settings";

class WhisperTranscription {
  private openai: any; // OpenAI API instance

  constructor(settings: Settings) {
    const configuration = new Configuration({
      apiKey: settings.openai.apiKey
    });

    this.openai = new OpenAIApi(configuration);
  }

  async processAudioMessage(audioFile: string): Promise<string> {
    try {
      // Perform Whisper transcription using OpenAI API
      const response = await this.openai.createTranscription(
        fs.createReadStream(audioFile),
        "whisper-1"
      );

      // Extract and return the transcribed text
      if (response.data && response.data.text) {
        return response.data.text;
      } else {
        throw new Error("Whisper transcription failed.");
      }
    } catch (error) {
      console.error("Error during Whisper transcription:", error);
      throw error;
    }
  }
}

export default WhisperTranscription;
