import GPTChat from "./ChatGPT";
import ElevenLabsSpeechSynthesis from "./ElevenLabsSpeechSynthesis";
import Database from "./Database";
import WhisperTranscription from "./WhisperTranscription";
import fs from "fs";
import { Settings } from "./types/Settings";
import { getDefaultHistory } from "./utils/getDefaultHistory";
import readline from "readline";

// Parse command line arguments
const [settingsFile, callerId, messageWavFile] = process.argv.slice(2);

// Load settings from the provided settings file
const settings: Settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));

// Create instances of the components
const db = new Database();
const chatGPT = new GPTChat(settings);
const whisperTranscription = new WhisperTranscription(settings);
const elevenLabs = new ElevenLabsSpeechSynthesis(settings);

let audioProcesseed = false;


async function main() {

    let caller = await db.getCaller(callerId);

    if (caller === null) {
        const c = await db.upsertCaller({
            callerId,
            history: getDefaultHistory(callerId)
        });

        caller = await db.getCaller(callerId);

        if (caller === null) {
            throw new Error("Caller not found");
        }
    }

    let history = caller.history;
    let elevenLabsResponse = "";
    let finish = false;

    if (messageWavFile !== undefined && !audioProcesseed) {
        const audioText = await whisperTranscription.processAudioMessage(messageWavFile);
        history.push({
            callerId,
            type: "message",
            role: "user",
            message: JSON.stringify({
                message: audioText
            })
        });

        audioProcesseed = true;

        await db.upsertCaller({
            callerId,
            history
        });
    }

    while(!finish) {
        const chatResponse = await chatGPT.newMessage(history);

        if(chatResponse.db) {

            const table = chatResponse.db.table;
            let msg = "";

            switch (table) {
                case "flights":
                    const flight = await db.getFlight(chatResponse.db.query.from, chatResponse.db.query.to);
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

        if(chatResponse.message) {
            history.push({
                callerId,
                type: "message",
                role: "assistant",
                message: JSON.stringify(chatResponse)
            });


            elevenLabsResponse = await elevenLabs.generateSpeech(chatResponse.message || "");

            finish = true;
        }

        await db.upsertCaller({
            callerId,
            history
        });
    }

    console.log(elevenLabsResponse);
}

main();
