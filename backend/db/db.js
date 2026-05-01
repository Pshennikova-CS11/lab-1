const path = require("path"); // Модуль Node.js для роботи зі шляхами до файлів і папок
const fs = require("fs"); // Модуль Node.js для роботи з файловою системою
const sqlite3 = require("sqlite3").verbose(); // підключення бібліотеки sqlite3 для роботи з SQLite

const dataDir = path.join(__dirname, "..", "data"); //шлях до папки data
const dbPath = path.join(dataDir, "app.db"); //повний шлях до файлу бази даних app.db

if (!fs.existsSync(dataDir)) { //перевірка чи існує папка
    fs.mkdirSync(dataDir, { recursive: true });
}

// Відкриваємо або створюємо файл SQLite-бази
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) { // якщо сталася помилка — виводимо її в консоль і завершуємо програму
        console.error("Failed to open SQLite DB:", err.message);
        process.exit(1);
    }

    console.log("SQLite DB opened:", dbPath); // Якщо все добре - виводимо шлях до відкритої бази
});

module.exports = { db }; // експортуємо підключення до бази, щоб використовувати його в інших файлах