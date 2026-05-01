const { initDb } = require("./initDb");
const { run } = require("./dbClient");

async function seed() {
    await initDb();

    const now = new Date().toISOString();

    console.log("Seeding database...");

    await run(`
        INSERT OR IGNORE INTO Users (id, name, email, createdAt)
        VALUES
            (1, 'Polina', 'polina@example.com', '${now}'),
            (2, 'Ivan', 'ivan@example.com', '${now}'),
            (3, 'Anna', 'anna@example.com', '${now}');
    `);

    await run(`
        INSERT OR IGNORE INTO Resources (id, title, url, type, description, author, createdAt)
        VALUES
            (1, 'Основи кібербезпеки', 'https://example.com/cyber-basics', 'course', 'Базовий курс з кібербезпеки', 'Олександр Петренко', '${now}'),
            (2, 'Мережеві атаки та захист', 'https://example.com/network-security', 'article', 'Стаття про типові мережеві атаки', 'Ірина Коваль', '${now}'),
            (3, 'SQLite для початківців', 'https://example.com/sqlite-beginners', 'video', 'Відео про роботу з SQLite', 'Андрій Бондар', '${now}'),
            (4, 'Архітектура комп’ютерних систем', 'https://example.com/computer-architecture-book', 'book', 'Книга з основ архітектури комп’ютерних систем', 'Микола Шевченко', '${now}');
    `);

    await run(`
        INSERT OR IGNORE INTO Ratings (id, resourceId, userId, value, createdAt)
        VALUES
            (1, 1, 1, 5, '${now}'),
            (2, 2, 1, 4, '${now}'),
            (3, 3, 2, 5, '${now}'),
            (4, 4, 3, 4, '${now}');
    `);

    await run(`
        INSERT OR IGNORE INTO Comments (id, resourceId, userId, text, createdAt)
        VALUES
            (1, 1, 1, 'Дуже корисний курс для початку.', '${now}'),
            (2, 2, 2, 'Стаття коротка, але змістовна.', '${now}'),
            (3, 3, 3, 'Відео пояснює SQLite дуже доступно.', '${now}');
    `);

    console.log("Seed completed");
}

seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});