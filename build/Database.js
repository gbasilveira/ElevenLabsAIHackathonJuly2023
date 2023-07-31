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
const sqlite3_1 = __importDefault(require("sqlite3"));
class Database {
    constructor(dbPath = 'database.db') {
        this.db = new sqlite3_1.default.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
            }
        });
        this.createTables().then((db) => {
        }).catch((err) => {
            console.error('Error creating tables:', err.message);
        });
    }
    createTables() {
        const createCallersTable = `CREATE TABLE IF NOT EXISTS Callers (
      callerId TEXT PRIMARY KEY,
      history TEXT
    );`;
        const dropFlightsTable = `DROP TABLE IF EXISTS Flights;`;
        const createFlightsTable = `CREATE TABLE IF NOT EXISTS Flights (
      flightNumber TEXT PRIMARY KEY,
      airline TEXT,
      departureAirport TEXT,
      departureTime TEXT,
      arrivalAirport TEXT,
      arrivalTime TEXT,
      availableSeats INTEGER
    );`;
        const createBookingsTable = `CREATE TABLE IF NOT EXISTS Bookings (
      id INTEGER PRIMARY KEY,
      flightNumber TEXT,
      seatNumber TEXT,
      clientName TEXT,
      clientId TEXT,
      clientLocation TEXT,
      FOREIGN KEY (flightNumber) REFERENCES Flights(flightNumber)
    );`;
        const insertFlights = `INSERT INTO Flights (flightNumber, airline, departureAirport, departureTime, arrivalAirport, arrivalTime, availableSeats)
VALUES
  ('AA123', 'American Airlines', 'JFK Airport, New York', '2023-08-01 10:00:00', 'LAX Airport, Los Angeles', '2023-08-01 14:00:00', 150),
  ('UA456', 'United Airlines', 'LAX Airport, Los Angeles', '2023-08-02 12:00:00', 'JFK Airport, New York', '2023-08-02 16:00:00', 200),
  ('DL789', 'Delta Airlines', 'ATL Airport, Atlanta', '2023-08-03 08:30:00', 'ORD Airport, Chicago', '2023-08-03 11:30:00', 100),
  ('BA234', 'British Airways', 'LHR Airport, London', '2023-08-04 16:45:00', 'CDG Airport, Paris', '2023-08-04 19:30:00', 180),
  ('AF567', 'Air France', 'CDG Airport, Paris', '2023-08-05 09:15:00', 'FRA Airport, Frankfurt', '2023-08-05 11:00:00', 120),
  ('EK789', 'Emirates', 'DXB Airport, Dubai', '2023-08-06 13:00:00', 'JFK Airport, New York', '2023-08-06 19:30:00', 250),
  ('SQ345', 'Singapore Airlines', 'SIN Airport, Singapore', '2023-08-07 18:30:00', 'LAX Airport, Los Angeles', '2023-08-07 23:15:00', 170),
  ('QF678', 'Qantas', 'SYD Airport, Sydney', '2023-08-08 05:45:00', 'LHR Airport, London', '2023-08-08 13:30:00', 220),
  ('EY123', 'Etihad Airways', 'AUH Airport, Abu Dhabi', '2023-08-09 11:20:00', 'JFK Airport, New York', '2023-08-09 16:45:00', 190),
  ('CA987', 'Air China', 'PEK Airport, Beijing', '2023-08-10 14:00:00', 'JFK Airport, New York', '2023-08-10 20:45:00', 130);
    `;
        return new Promise((resolve, reject) => {
            const db = this.db.exec(createCallersTable + dropFlightsTable + createFlightsTable + insertFlights + createBookingsTable);
            if (db) {
                resolve(db);
            }
            else {
                reject();
            }
        });
    }
    getFlight(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM Flights WHERE departureAirport LIKE ? AND arrivalAirport LIKE ?';
            const values = [`%${from}%`, `%${to}%`];
            return new Promise((resolve, reject) => {
                this.db.get(query, values, (err, row) => {
                    if (err) {
                        console.error('Error retrieving flight:', err.message);
                        reject(err);
                    }
                    else {
                        if (row) {
                            const flight = {
                                flightNumber: row.flightNumber,
                                airline: row.airline,
                                departureAirport: row.departureAirport,
                                departureTime: new Date(row.departureTime),
                                arrivalAirport: row.arrivalAirport,
                                arrivalTime: new Date(row.arrivalTime),
                                availableSeats: row.availableSeats,
                            };
                            resolve(flight);
                        }
                        else {
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
    createBooking(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO Bookings (flightNumber, seatNumber, clientName, clientId, clientLocation) VALUES (?, ?, ?, ?, ?)';
            const values = [
                booking.flightNumber,
                booking.seatNumber,
                booking.client.name,
                booking.client.ID,
                booking.client.location,
            ];
            return new Promise((resolve, reject) => {
                this.db.run(query, values, (err) => {
                    if (err) {
                        console.error('Error creating booking:', err.message);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    getCaller(callerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM Callers WHERE callerId = ?';
            const values = [callerId];
            return new Promise((resolve, reject) => {
                this.db.get(query, values, (err, row) => {
                    if (err) {
                        console.error('Error retrieving caller:', err.message);
                        reject(err);
                    }
                    else {
                        if (row) {
                            const caller = {
                                callerId: row.callerId,
                                history: JSON.parse(row.history),
                            };
                            resolve(caller);
                        }
                        else {
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
    upsertCaller(caller) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT OR REPLACE INTO Callers (callerId, history) VALUES (?, ?)';
            const values = [caller.callerId, JSON.stringify(caller.history)];
            return new Promise((resolve, reject) => {
                this.db.run(query, values, (err) => {
                    if (err) {
                        console.error('Error upserting caller:', err.message);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
}
exports.default = Database;
