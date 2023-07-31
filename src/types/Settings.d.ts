export type Settings  = {
    language: string;
    agency: string;
    voice: string = "Rachel";
    openai: {
        apiKey: string;
    };
    elevenLabs: {
        apiKey: string;
        voiceId?: string;
        voice?: {
            accent?: string;
            gender?: string;
            age?: string;
        }
    };
};