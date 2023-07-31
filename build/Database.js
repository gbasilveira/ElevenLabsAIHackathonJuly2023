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
    constructor(dbPath = './db/database.db') {
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
        return new Promise((resolve, reject) => {
            const db = this.db.exec(createCallersTable + createFlightsTable + createBookingsTable);
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
                                history: row.history,
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
            const values = [caller.callerId, caller.history];
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
