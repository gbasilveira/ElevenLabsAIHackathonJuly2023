import axios from 'axios';
import { Settings } from './types/Settings';
import fs from 'fs';

class ElevenLabsSpeechSynthesis {
  private apiKey: string;
  private voiceId: string;
  private baseUrl: string;

  constructor(settings: Settings) {
    this.apiKey = settings.elevenLabs.apiKey;
    this.voiceId = settings.elevenLabs.voiceId; // Replace with the appropriate voiceId
    this.baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech/';
  }

  async generateSpeech(text: string): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl + this.voiceId,
        {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            'accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Tell Axios to expect binary data
        }
      );

      // Generate a unique filename for the audio file
      const uniqueFileName = `speech_${Date.now()}.mp3`;

      // Write the binary audio data to a file (You can store or play this file as needed)
      // For example, if you are using Node.js, you can use the fs module to write the file.
      fs.writeFileSync(uniqueFileName, response.data);

      return uniqueFileName; // Return the filename for reference if needed
    } catch (error) {
      console.error('Error in generating speech:', error);
      throw new Error('Failed to generate speech.');
    }
  }
}

export default ElevenLabsSpeechSynthesis;
