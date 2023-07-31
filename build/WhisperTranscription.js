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
const openai_1 = require("openai");
const fs_1 = __importDefault(require("fs"));
class WhisperTranscription {
    constructor(settings) {
        const configuration = new openai_1.Configuration({
            apiKey: settings.openai.apiKey
        });
        this.openai = new openai_1.OpenAIApi(configuration);
    }
    processAudioMessage(audioFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Perform Whisper transcription using OpenAI API
                const response = yield this.openai.createTranscription(fs_1.default.createReadStream(audioFile), "whisper-1");
                // Extract and return the transcribed text
                if (response.data && response.data.text) {
                    return response.data.text;
                }
                else {
                    throw new Error("Whisper transcription failed.");
                }
            }
            catch (error) {
                console.error("Error during Whisper transcription:", error);
                throw error;
            }
        });
    }
}
exports.default = WhisperTranscription;
