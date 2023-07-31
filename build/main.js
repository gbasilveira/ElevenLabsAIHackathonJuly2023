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
const ChatGPT_1 = __importDefault(require("./ChatGPT"));
const ElevenLabsSpeechSynthesis_1 = __importDefault(require("./ElevenLabsSpeechSynthesis"));
const Database_1 = __importDefault(require("./Database"));
const WhisperTranscription_1 = __importDefault(require("./WhisperTranscription"));
const fs_1 = __importDefault(require("fs"));
const getDefaultHistory_1 = require("./utils/getDefaultHistory");
// Parse command line arguments
const [settingsFile, callerId, messageWavFile] = process.argv.slice(2);
// Load settings from the provided settings file
let settings = JSON.parse(fs_1.default.readFileSync(settingsFile, 'utf8'));
// Create instances of the components
const db = new Database_1.default();
const chatGPT = new ChatGPT_1.default(settings);
const whisperTranscription = new WhisperTranscription_1.default(settings);
const elevenLabs = new ElevenLabsSpeechSynthesis_1.default(settings);
let audioProcesseed = false;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const voice = yield elevenLabs.getVoice();
        if (voice.name) {
            settings.voice = voice.name;
        }
        let caller = yield db.getCaller(callerId);
        if (caller === null) {
            const c = yield db.upsertCaller({
                callerId,
                history: (0, getDefaultHistory_1.getDefaultHistory)(callerId, settings)
            });
            caller = yield db.getCaller(callerId);
            if (caller === null) {
                throw new Error("Caller not found");
            }
        }
        let history = caller.history;
        let elevenLabsResponse = "";
        let finish = false;
        if (messageWavFile !== undefined && !audioProcesseed) {
            const audioText = yield whisperTranscription.processAudioMessage(messageWavFile);
            history.push({
                callerId,
                type: "message",
                role: "user",
                message: JSON.stringify({
                    message: audioText
                })
            });
            audioProcesseed = true;
            yield db.upsertCaller({
                callerId,
                history
            });
        }
        while (!finish) {
            const chatResponse = yield chatGPT.newMessage(history);
            if (chatResponse.db) {
                const table = chatResponse.db.table;
                let msg = "";
                switch (table) {
                    case "flights":
                        const flight = yield db.getFlight(chatResponse.db.query.from, chatResponse.db.query.to);
                        msg = JSON.stringify({
                            db: {
                                table: "flights",
                                result: flight
                            }
                        });
                        break;
                    case "bookings":
                        //No need for the hackathon context
                        // const booking = await db.createBooking(message.db.query);
                        msg = JSON.stringify({
                            db: {
                                table: "bookings",
                                result: "ok"
                            }
                        });
                        break;
                    default:
                        throw new Error("Unknown table");
                }
                history.push({
                    callerId,
                    type: "message",
                    role: "user",
                    message: msg
                });
            }
            if (chatResponse.message) {
                history.push({
                    callerId,
                    type: "message",
                    role: "assistant",
                    message: JSON.stringify(chatResponse)
                });
                elevenLabsResponse = yield elevenLabs.generateSpeech(chatResponse.message || "");
                finish = true;
            }
            yield db.upsertCaller({
                callerId,
                history
            });
        }
        console.log(elevenLabsResponse);
    });
}
main();
