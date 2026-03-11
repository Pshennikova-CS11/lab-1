У папці з бекенд-кодом створити файл README.md, в якому описати:
3.1. як запустити:

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

3.2. список реалізованих сутностей:

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

3.3. приклади запитів (curl)

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
