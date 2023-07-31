export type Settings  = {
    language: string;
    openai: {
        apiKey: string;
    };
    elevenLabs: {
        apiKey: string;
        voiceId: string;
    };
};