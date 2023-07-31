export type DBMessage  = {
    table: string;
    query?: any;
    sort?: any;
    limit?: string;
    insert?: any;
    result?: any;
};

export type SpeechMessage  = {
    language?: string;
    speaker?: string;
    stability?: number;
    clarity?: number;
    model?: string;
}

export type SettingsMessage  = {
    language: string;
};

export type GPTMessage  = {
    type?: "message" | "system" | "settings" | "db";
    role?: "system" | "user" | "assistant";
    callerId?: string;
    message?: string;
    db?: DBMessage;
    speech?: SpeechMessage;
    settings?: SettingsMessage;
    success?: boolean;
    error?: string;
};
