const { db } = require("./db"); //імпортуємо вже відкрите підключення до SQLite з файлу db.js

// SELECT many, функція all виконує SELECT-запит, який повертає багато рядків
function all(sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// SELECT one, функція get виконує SELECT-запит, який повертає один рядок
function get(sql) {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Функція run використовується для SQL-запитів, які змінюють дані: INSERT, UPDATE, DELETE
function run(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) return reject(err);

            resolve({
                lastID: this.lastID, // id щойно створеного запису
                changes: this.changes, // кількість змінених або видалених рядків
            });
        });
    });
}

module.exports = { all, get, run }; // експортуємо три універсальні функції для роботи з БД