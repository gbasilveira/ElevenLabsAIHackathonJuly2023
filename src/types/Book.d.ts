// TypeScript type for the Book schema
export type Book  = {
    flightNumber: string;
    seatNumber: string;
    client: {
        name: string;
        ID: string;
        location: string;
    };
};



