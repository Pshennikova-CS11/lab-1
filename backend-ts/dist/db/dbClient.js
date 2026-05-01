"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = all;
exports.get = get;
exports.run = run;
const db_1 = require("./db");
function all(sql) {
    return new Promise((resolve, reject) => {
        db_1.db.all(sql, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}
function get(sql) {
    return new Promise((resolve, reject) => {
        db_1.db.get(sql, (err, row) => {
            if (err)
                return reject(err);
            resolve(row);
        });
    });
}
function run(sql) {
    return new Promise((resolve, reject) => {
        db_1.db.run(sql, function (err) {
            if (err)
                return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}
