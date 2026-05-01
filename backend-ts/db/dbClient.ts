import { db } from "./db";

export function all<T = any>(sql: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

export function get<T = any>(sql: string): Promise<T> {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

export function run(sql: string): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

export function exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}