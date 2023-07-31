"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
class ElevenLabsSpeechSynthesis {
    constructor(settings) {
        this.apiKey = settings.elevenLabs.apiKey;
        this.voiceId = settings.elevenLabs.voiceId ? settings.elevenLabs.voiceId : '21m00Tcm4TlvDq8ikWAM'; // Replace with the appropriate voiceId
        this.baseUrl = 'https://api.elevenlabs.io/v1/';
    }
    getVoice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.baseUrl + "voices/" + this.voiceId, {
                    headers: {
                        'accept': 'application/json',
                        'xi-api-key': this.apiKey,
                    },
                });
                return response.data;
            }
            catch (error) {
                console.error('Error in getting voice settings:', error);
                throw new Error('Failed to get voice settings.');
            }
        });
    }
    generateSpeech(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(this.baseUrl + "text-to-speech/" + this.voiceId, {
                    text: text,
                    model_id: 'eleven_multilingual_v1',
                    voice_settings: {
                        stability: 0.3,
                        similarity_boost: 0.1,
                    },
                }, {
                    headers: {
                        'accept': 'audio/mpeg',
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer', // Tell Axios to expect binary data
                });
                // Generate a unique filename for the audio file
                const uniqueFileName = `speech_${Date.now()}.mp3`;
                // Write the binary audio data to a file (You can store or play this file as needed)
                // For example, if you are using Node.js, you can use the fs module to write the file.
                fs_1.default.writeFileSync(uniqueFileName, response.data);
                return uniqueFileName; // Return the filename for reference if needed
            }
            catch (error) {
                console.error('Error in generating speech:', error);
                throw new Error('Failed to generate speech.');
            }
        });
    }
}
exports.default = ElevenLabsSpeechSynthesis;
