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
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
class GPTChat {
    constructor(settings) {
        const configuration = new openai_1.Configuration({
            apiKey: settings.openai.apiKey
        });
        this.openai = new openai_1.OpenAIApi(configuration);
    }
    newMessage(history) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare the messages for OpenAI API input
            const messages = history.map((event) => ({
                role: event.role,
                content: JSON.stringify(event)
            }));
            // Call OpenAI API to get the response
            const response = yield this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            // Parse the response from OpenAI
            const assistantResponse = JSON.parse(response.data.choices[0].message.content);
            return assistantResponse;
        });
    }
}
exports.default = GPTChat;
