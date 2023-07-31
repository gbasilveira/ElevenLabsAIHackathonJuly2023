import axios from 'axios';
import { Settings } from './types/Settings';
import fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import lame from 'lame';
import wav from 'wav';

class ElevenLabsSpeechSynthesis {
  private apiKey: string;
  private voiceId: string;
  private baseUrl: string;

  constructor(settings: Settings) {
    this.apiKey = settings.elevenLabs.apiKey;
    this.voiceId = settings.elevenLabs.voiceId ? settings.elevenLabs.voiceId : '21m00Tcm4TlvDq8ikWAM'; // Replace with the appropriate voiceId
    this.baseUrl = 'https://api.elevenlabs.io/v1/';
  }

  async getVoice(): Promise<any> {

    try {
      const response = await axios.get(
        this.baseUrl + "voices/" + this.voiceId,
        {
          headers: {
            'accept': 'application/json',
            'xi-api-key': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error in getting voice settings:', error);
      throw new Error('Failed to get voice settings.');
    }
  }

  async generateSpeech(text: string): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl + "text-to-speech/" + this.voiceId,
        {
          text: text,
          model_id: 'eleven_multilingual_v1',
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.1,
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
