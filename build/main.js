"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatGPT_1 = __importDefault(require("./ChatGPT"));
const ElevenLabsSpeechSynthesis_1 = __importDefault(require("./ElevenLabsSpeechSynthesis"));
const Database_1 = __importDefault(require("./Database"));
const WhisperTranscription_1 = __importDefault(require("./WhisperTranscription"));
const fs_1 = __importDefault(require("fs"));
// Parse command line arguments
const [settingsFile, callerId, messageWavFile] = process.argv.slice(2);
// Load settings from the provided settings file
const settings = JSON.parse(fs_1.default.readFileSync(settingsFile, 'utf8'));
// Create instances of the components
const db = new Database_1.default();
const chatGPT = new ChatGPT_1.default(settings);
const whisperTranscription = new WhisperTranscription_1.default(settings);
const elevenLabs = new ElevenLabsSpeechSynthesis_1.default(settings);
process.exit(0);
// async function main () {
//   let caller = db.getCaller(callerId);
//   console.log({m: "Line 25", caller})
//   if(caller === null) {
//     const c = db.upsertCaller({
//       callerId,
//       history: getDefaultHistory(callerId)
//     });    
//     console.log({m: "Line 32", c})
//     caller = db.getCaller(callerId);
//     if(caller === null) {
//       throw new Error("Caller not found");
//     }
//   }
//   let history = caller.history;
//   if(messageWavFile !== undefined) {
//     const audioText = await whisperTranscription.processAudioMessage(messageWavFile);
//     history.push({
//       callerId,
//       type: "message",
//       role: "user",
//       message: audioText
//     });
//   }
//   const chatResponse = await chatGPT.newMessage(history);
//   // const elevenLabsResponse = await elevenLabs.generateSpeech(chatResponse.message || "");
//   console.log({
//     // audioText,~
//     history,
//     chatResponse,
//     // elevenLabsResponse
//   });
// }
// main();
