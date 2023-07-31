// TypeScript type for the Flight schema
export type Flight  = {
    flightNumber: string;
    airline: string;
    departureAirport: string;
    departureTime: Date;
    arrivalAirport: string;
    arrivalTime: Date;
    availableSeats: number;
};