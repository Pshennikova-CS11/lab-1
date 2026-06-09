"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = all;
exports.get = get;
exports.run = run;
exports.exec = exec;
const db_1 = require("./db");
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.all(sql, params, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.get(sql, params, (err, row) => {
            if (err)
                return reject(err);
            resolve(row);
        });
    });
}
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.run(sql, params, function (err) {
            if (err)
                return reject(err);
            resolve({
                lastID: this.lastID,
                changes: this.changes
            });
        });
    });
}
function exec(sql) {
    return new Promise((resolve, reject) => {
        db_1.db.exec(sql, (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
