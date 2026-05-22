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


4. Лабораторна робота №4. Інтеграція frontend і backend

4.1. Запуск frontend і backend

У лабораторній роботі №4 frontend і backend запускаються як окремі процеси на різних портах.

Backend запускається з папки backend:

bash
cd backend
npm install
npm run dev

Після запуску backend працює за адресою: http://localhost:3000

Frontend запускається з кореневої папки проєкту: npx http-server "C:\Users\Vivonook\Desktop\lab-1" -p 5500 -c-1
Після запуску frontend відкривається у браузері за адресою: http://localhost:5500

Frontend не звертається напряму до бази даних або файлів. Уся взаємодія з backend відбувається тільки через HTTP API.

4.2. Версійність API та сумісність DTO

У проєкті використовується проста версійність API через префікс /api/v1.

Усі актуальні endpoint-и мають однаковий формат:

- GET /api/v1/resources
- GET /api/v1/resources/:id
- POST /api/v1/resources
- PUT /api/v1/resources/:id
- DELETE /api/v1/resources/:id

Аналогічний префікс використовується для сутностей users, comments і ratings.

Принцип “не ламати формат”
Frontend працює з DTO, які повертає backend. Тому backend не повинен перейменовувати або видаляти поля, які вже використовуються у frontend-частині.

Для сутності Resource frontend очікує такі поля:

- id — ідентифікатор ресурсу;
- title — назва ресурсу;
- url — посилання на ресурс;
- type — тип ресурсу;
- author — автор ресурсу;
- description — опис ресурсу;
- createdAt — дата створення;
- averageRating — середній рейтинг ресурсу.

Наприклад, не можна перейменувати title у name, url у link, id у resourceId, тому що frontend уже використовує ці поля для відображення таблиці, редагування та видалення записів.

Правила сумісності DTO
1. Поля, які вже використовує frontend, не можна перейменовувати або видаляти без створення нової версії API.
2. Нові поля можна додавати тільки як необов’язкові, щоб старий frontend продовжував працювати без змін.
3. Якщо потрібно змінити структуру відповіді несумісним способом, треба створювати нову версію API, наприклад /api/v2.
4. Формат помилки також має залишатися стабільним. Frontend очікує відповідь у форматі:

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": ["url must be valid"]
  }
}

Поля code, message і details не можна перейменовувати, тому що frontend використовує їх для показу зрозумілих повідомлень користувачу.

Приклад зворотно сумісного розширення DTO
Дозволено додавати нові необов’язкові поля. Наприклад, backend може додати поле difficulty:

{
  "id": 1,
  "title": "JavaScript Guide",
  "url": "https://javascript.info",
  "type": "article",
  "author": "Поліна",
  "description": "Довідник з JavaScript",
  "createdAt": "2026-05-21T10:00:00.000Z",
  "averageRating": 4.5,
  "difficulty": "beginner"
}

Таке розширення не ламає frontend, тому що всі старі поля залишаються без змін, а нове поле є необов’язковим.

4.3. Тонкий API-шар frontend

Для взаємодії frontend з backend створено окремий файл apiClient.js.

У цьому файлі зібрана логіка HTTP-запитів до backend. Frontend-код у app.js не виконує fetch() напряму, а використовує готові API-методи.

У apiClient.js реалізовано спільну функцію fetchJson(), яка централізовано обробляє:

- виконання fetch()-запиту;
- перевірку response.ok;
- парсинг JSON-відповіді;
- статус 204 No Content;
- мережеві помилки;
- HTTP-помилки backend.

Також реалізовано універсальний CRUD-клієнт з методами:

- getList() — отримання списку записів;
- getById() — отримання одного запису за id;
- create() — створення запису;
- update() — оновлення запису;
- remove() — видалення запису.

Для сутностей створено окремі API-об’єкти:
resourcesApi
usersApi
commentsApi
ratingsApi

Завдяки цьому app.js відповідає за UI, форми, рендеринг і події, а apiClient.js — за HTTP-запити до backend.

4.4. CORS
Backend налаштований так, щоб дозволяти запити тільки з конкретних frontend-origin, без використання wildcard *.

Дозволені origin:
http://localhost:5500
http://127.0.0.1:5500
http://localhost:5173
http://127.0.0.1:5173

Також явно вказані дозволені HTTP-методи: GET, POST, PUT, PATCH, DELETE, OPTIONS

Дозволені заголовки: Content-Type, Authorization

Frontend працює на порту `5500`, а backend — на порту `3000`, тому для коректної взаємодії між ними необхідне налаштування CORS.

4.5. Обробка помилок
Backend повертає помилки в узгодженому форматі:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": ["url must be valid"]
  }
}

Frontend обробляє такі помилки через apiClient.js і функцію getApiErrorMessage() в app.js.

Якщо backend повертає помилку валідації, frontend показує користувачу зрозуміле повідомлення, наприклад:
Invalid request body:
url must be valid


Обробляються такі сценарії:
- backend повернув `400 Bad Request`;
- backend повернув `404 Not Found`;
- backend повернув `409 Conflict`;
- backend повернув `500 Internal Server Error`;
- backend недоступний або виникла мережева помилка.

4.6. Клієнтська валідація та UX
На frontend реалізовано клієнтську валідацію форм.
Для ресурсу перевіряються такі поля:
- назва ресурсу;
- автор;
- URL;
- тип ресурсу;
- опис.

Якщо поле не заповнене або URL має неправильний формат, користувач бачить повідомлення біля відповідного поля.

Також реалізовано базовий UX для видалення записів:
- перед видаленням показується підтвердження через confirm();
- якщо користувач натискає «Скасувати», DELETE-запит не виконується;
- якщо користувач підтверджує видалення, кнопка тимчасово блокується на час виконання запиту.

Після створення, редагування або видалення frontend повторно завантажує актуальні дані з backend. Це запобігає дублюванню або появі “фантомних” елементів у таблицях.

4.7. Сценарії перевірки

Перевірка GET-запиту: curl http://localhost:3000/api/v1/resources
Очікуваний результат: backend повертає список ресурсів.

Перевірка POST-запиту: curl -X POST http://localhost:3000/api/v1/resources ^
                            -H "Content-Type: application/json" ^
                            -d "{\"title\":\"JavaScript Guide\",\"url\":\"https://javascript.info\",\"type\":\"article\",\"description\":\"Довідник з JavaScript\",\"author\":\"Поліна\"}"
Очікуваний результат: backend створює ресурс і повертає статус `201 Created`.

Перевірка PUT-запиту: curl -X PUT http://localhost:3000/api/v1/resources/1 ^
                           -H "Content-Type: application/json" ^
                            -d "{\"title\":\"Оновлений ресурс\",\"url\":\"https://developer.mozilla.org\",\"type\":\"article\",\"description\":\"Оновлений опис\",\"author\":\"Поліна\"}"
Очікуваний результат: backend оновлює ресурс і повертає статус `200 OK`.

Перевірка DELETE-запиту: curl -X DELETE http://localhost:3000/api/v1/resources/1
Очікуваний результат: backend видаляє ресурс і повертає статус `204 No Content`.

Перевірка помилки валідації 400: curl -X POST http://localhost:3000/api/v1/resources ^
                                        -H "Content-Type: application/json" ^
                                        -d "{\"title\":\"Bad\",\"url\":\"abc\",\"type\":\"article\",\"description\":\"test\",\"author\":\"A\"}"
Очікуваний результат: backend повертає статус `400 Bad Request` і відповідь з кодом `VALIDATION_ERROR`.

Перевірка помилки 404: curl http://localhost:3000/api/v1/resources/999999
Очікуваний результат: backend повертає статус `404 Not Found`.

Перевірка помилки 500
Для перевірки внутрішньої помилки сервера можна тимчасово додати тестовий endpoint на backend:
app.get("/api/v1/test-500", (req, res, next) => {
    next(new Error("Test server error"));
});

Після цього виконати запит: curl http://localhost:3000/api/v1/test-500

Очікуваний результат: backend повертає статус 500 Internal Server Error і відповідь у стандартному форматі помилки:
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Test server error",
    "details": null
  }
}
Після перевірки тестовий endpoint потрібно видалити з фінального коду.

Перевірка CORS
1. Запустити backend на `http://localhost:3000`.
2. Запустити frontend на `http://localhost:5500`.
3. Відкрити frontend у браузері.
4. Відкрити DevTools → Network.
5. Виконати будь-який запит до API.
6. У відповіді перевірити заголовок: Access-Control-Allow-Origin: http://localhost:5500

Перевірка недоступного backend
1. Запустити frontend.
2. Зупинити backend-сервер.
3. Оновити сторінку frontend.
Очікуваний результат: frontend не ламається, а показує повідомлення про помилку завантаження або мережеву помилку.

4.8. TypeScript-версія frontend
Окремо реалізовано TypeScript-версію frontend.
Вихідні TypeScript-файли знаходяться в папці:
frontend-ts/
  types.ts
  apiClient.ts
  app.ts

Після компіляції результат зберігається у папці:
dist-frontend/
  types.js
  apiClient.js
  app.js

Для збірки TypeScript-frontend використовується команда: npm run build:frontend
Після успішної збірки сторінка index-ts.html підключає саме згенеровані JavaScript-файли з папки dist-frontend.

TypeScript-версія запускається окремо: npx http-server "C:\Users\Vivonook\Desktop\lab-1" -p 5173 -c-1

Після запуску сторінка доступна за адресою: http://localhost:5173/index-ts.html

У файлі types.ts описані DTO для сутностей:
ResourceDto, CreateResourceDto;
UserDto, CreateUserDto;
CommentDto, CreateCommentDto;
RatingDto, CreateRatingDto.

У файлі apiClient.ts реалізовано типізований API-клієнт.
Всі запити проходять через функцію fetchJson<T>(), яка обробляє:
response.ok;
JSON-парсинг;
статус 204 No Content;
HTTP-помилки backend;
мережеві помилки;
таймаут через AbortController.

Для запитів встановлено таймаут 15 секунд. Якщо backend не відповідає довше, запит скасовується через AbortController, а frontend показує користувачу зрозуміле повідомлення.