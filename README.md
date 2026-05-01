У папці з бекенд-кодом створити файл README.md, в якому описати:
2.1. як запустити:

Створити папку: mkdir backend
Перейти в папку backend командою: cd backend
Ініціалізувати npm: npm init -y
Встановити залежності: npm install express cors uuid
Встановити dev-залежність: npm install -D nodemon
Створити файл server.js
Додати в package.json скрипт: "dev": "nodemon server.js"
Запустити сервер: npm run dev, після запуску в терміналі з’явиться повідомлення: Server started on http://localhost:3000
Відкрити застосунок у браузері: http://localhost:3000
Перевірити API через термінал: curl http://localhost:3000/api/resources

2.2. список реалізованих сутностей:

У проєкті реалізовано такі сутності: Users, Resources, Ratings, Comments
Основні сутності для оцінювання: Users, Resources

Реалізовані маршрути
Users
GET /api/users — отримати список користувачів
GET /api/users/:id — отримати користувача за ID
POST /api/users — створити користувача
PUT /api/users/:id — оновити користувача
DELETE /api/users/:id — видалити користувача

Resources
GET /api/resources — отримати список ресурсів
GET /api/resources/:id — отримати ресурс за ID
POST /api/resources — створити ресурс
PUT /api/resources/:id — оновити ресурс
DELETE /api/resources/:id — видалити ресурс

Ratings
POST /api/ratings — додати рейтинг
GET /api/resources/:id/ratings — отримати рейтинги ресурсу

Comments
POST /api/comments — додати коментар
GET /api/resources/:id/comments — отримати коментарі ресурсу

2.3. приклади запитів (curl)

Отримати список ресурсів: curl http://localhost:3000/api/resources
Створити ресурс: curl -X POST http://localhost:3000/api/resources \
                 -H "Content-Type: application/json" \
                 -d "{\"title\":\"JavaScript Guide\",\"url\":\"https://javascript.info\",\"type\":\"article\",\"description\":\"Довідник з JavaScript\",\"author\":\"Поліна\"}"

Отримати ресурс за ID: curl http://localhost:3000/api/resources/RESOURCE_ID

Оновити ресурс: curl -X PUT http://localhost:3000/api/resources/RESOURCE_ID \
                     -H "Content-Type: application/json" \
                     -d "{\"title\":\"Оновлений ресурс\",\"url\":\"https://example.com\",\"type\":\"course\",\"description\":\"Оновлений опис\",\"author\":\"Поліна\"}"

Видалити ресурс: curl -X DELETE http://localhost:3000/api/resources/RESOURCE_ID

Створити користувача: curl -X POST http://localhost:3000/api/users \
                           -H "Content-Type: application/json" \
                           -d "{\"name\":\"Поліна\",\"email\":\"polina@example.com\"}"

Отримати список користувачів: curl http://localhost:3000/api/users

Помилка валідації (400 Bad Request): curl -X POST http://localhost:3000/api/resources \
                                     -H "Content-Type: application/json" \
                                     -d "{\"title\":\"Без автора\",\"url\":\"https://example.com\",\"type\":\"article\"}"

Неіснуючий ID (404 Not Found): curl http://localhost:3000/api/resources/non-existing-id



3.1. Як запустити
Перейти в папку backend командою: cd backend
Встановити залежності: npm install
Запустити сервер: npm run dev

Після запуску в терміналі з’являються повідомлення:
SQLite DB opened: ...\backend\data\app.db
DB schema initialized
Server started on http://localhost:3000

Після цього застосунок можна відкрити у браузері за адресою:
http://localhost:3000

Файл бази даних SQLite створюється автоматично при першому запуску сервера за шляхом:
backend/data/app.db

Ініціалізація таблиць також виконується автоматично при старті сервера через CREATE TABLE IF NOT EXISTS, тому вручну створювати таблиці не потрібно.

Перевірити API можна через браузер, Postman, HTTP Client або curl, наприклад:
curl http://localhost:3000/api/resources

3.2. Список реалізованих сутностей
У проєкті реалізовано такі сутності: Users, Resources, Ratings, Comments
Основні сутності для оцінювання: Users, Resources

Опис реалізованих таблиць
Users
Таблиця користувачів містить такі поля:
id — унікальний ідентифікатор користувача
name — ім’я користувача
email — електронна пошта користувача
createdAt — дата створення запису
Для таблиці Users використано такі обмеження:
id INTEGER PRIMARY KEY
name TEXT NOT NULL
email TEXT NOT NULL UNIQUE
createdAt TEXT NOT NULL

Resources
Таблиця навчальних ресурсів містить такі поля:
id — унікальний ідентифікатор ресурсу
title — назва ресурсу
url — посилання на ресурс
type — тип ресурсу
description — опис ресурсу
author — автор ресурсу
createdAt — дата створення запису
Для таблиці Resources використано такі обмеження:
id INTEGER PRIMARY KEY
title TEXT NOT NULL
url TEXT NOT NULL UNIQUE
type TEXT NOT NULL
description TEXT
author TEXT NOT NULL
createdAt TEXT NOT NULL
CHECK (type IN ('article', 'video', 'course', 'book'))

Ratings
Таблиця оцінок містить такі поля:
id — унікальний ідентифікатор оцінки
resourceId — ідентифікатор ресурсу
userId — ідентифікатор користувача
value — оцінка
createdAt — дата створення запису
Для таблиці Ratings використано такі обмеження:
id INTEGER PRIMARY KEY
resourceId INTEGER NOT NULL
userId INTEGER NOT NULL
value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5)
createdAt TEXT NOT NULL

У таблиці Ratings реалізовано зовнішні ключі:
resourceId → Resources.id
userId → Users.id

Для пов’язаних записів використано FOREIGN KEY та ON DELETE CASCADE, тобто при видаленні ресурсу або користувача пов’язані оцінки видаляються автоматично.

Реалізовані маршрути
Users
GET /api/users — отримати список користувачів
GET /api/users/:id — отримати користувача за ID
POST /api/users — створити користувача
PUT /api/users/:id — оновити користувача
DELETE /api/users/:id — видалити користувача

Resources
GET /api/resources — отримати список ресурсів
GET /api/resources/:id — отримати ресурс за ID
POST /api/resources — створити ресурс
PUT /api/resources/:id — оновити ресурс
DELETE /api/resources/:id — видалити ресурс

Ratings
GET /api/ratings — отримати список оцінок
POST /api/ratings — додати оцінку
PUT /api/ratings/:id — оновити оцінку
DELETE /api/ratings/:id — видалити оцінку

Comments
GET /api/comments — отримати список коментарів
POST /api/comments — додати коментар
PUT /api/comments/:id — оновити коментар
DELETE /api/comments/:id — видалити коментар

3.3. Приклади запитів (curl)

Отримати список ресурсів: curl http://localhost:3000/api/resources

Створити ресурс: curl -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d "{\"title\":\"JavaScript Guide\",\"url\":\"https://developer.mozilla.org\",\"type\":\"article\",\"description\":\"Довідник з JavaScript\",\"author\":\"Поліна\"}"

Отримати ресурс за ID: curl http://localhost:3000/api/resources/1

Оновити ресурс: curl -X PUT http://localhost:3000/api/resources/1 -H "Content-Type: application/json" -d "{\"title\":\"Оновлений ресурс\",\"url\":\"https://developer.mozilla.org/en-US/docs/Web/JavaScript\",\"type\":\"article\",\"description\":\"Оновлений опис\",\"author\":\"Поліна\"}"

Видалити ресурс: curl -X DELETE http://localhost:3000/api/resources/1

Створити користувача: curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Поліна\",\"email\":\"polina@example.com\"}"

Отримати список користувачів: curl http://localhost:3000/api/users

Помилка валідації (400 Bad Request): curl -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d "{\"title\":\"Без автора\",\"url\":\"https://example.com\",\"type\":\"article\"}"

Неіснуючий ID (404 Not Found): curl http://localhost:3000/api/resources/9999

Запит з WHERE + ORDER + LIMIT: curl "http://localhost:3000/api/resources?type=article&limit=5"
Цей запит повертає ресурси тільки типу article, сортує їх за датою створення та обмежує кількість записів до п’яти.
