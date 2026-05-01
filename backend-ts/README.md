# backend-ts
TypeScript version of the REST API with SQLite database.

## Run in development
npm run dev

## Build
npm run build

## Start production build
npm run start

## Lint
npm run lint

## Example endpoints
- GET /api/resources
- GET /api/resources?page=1&pageSize=10
- GET /api/resources?search=js
- GET /api/resources?type=article
- GET /api/resources?sortBy=title&sortDir=asc
- POST /api/resources
- PATCH /api/resources/:id
- DELETE /api/resources/:id

## Migrations
У проєкті реалізовано спрощену систему міграцій без ORM.
Використовується папка db/migrations, у якій зберігаються SQL-файли з нумерацією:
001_init.sql
002_indexes.sql

Також використовується таблиця schema_migrations, у якій фіксуються вже застосовані міграції. Під час запуску застосунок перевіряє список застосованих змін і виконує тільки ті міграції, яких ще немає в schema_migrations.

## Database schema
Tables

Users
Поля:
id — первинний ключ
name — ім’я користувача
email — email користувача
createdAt — дата створення
updatedAt — дата останнього оновлення
deletedAt — дата м’якого видалення

Обмеження:
PRIMARY KEY
NOT NULL
UNIQUE(email)
Resources

Поля:
id — первинний ключ
title — назва ресурсу
url — посилання на ресурс
type — тип ресурсу
description — опис
author — автор
createdAt — дата створення

Обмеження:
PRIMARY KEY
NOT NULL
UNIQUE(url)
CHECK(type IN ('article', 'video', 'course', 'book'))
Comments

Поля:
id — первинний ключ
resourceId — посилання на ресурс
userId — посилання на користувача
text — текст коментаря
createdAt — дата створення
updatedAt — дата оновлення
deletedAt — дата м’якого видалення

Обмеження:
PRIMARY KEY
NOT NULL
FOREIGN KEY(resourceId) REFERENCES Resources(id)
FOREIGN KEY(userId) REFERENCES Users(id)
Ratings

Поля:
id — первинний ключ
resourceId — посилання на ресурс
userId — посилання на користувача
value — значення оцінки
createdAt — дата створення
updatedAt — дата оновлення
deletedAt — дата м’якого видалення

Обмеження:
PRIMARY KEY
NOT NULL
CHECK(value >= 1 AND value <= 5)
FOREIGN KEY(resourceId) REFERENCES Resources(id)
FOREIGN KEY(userId) REFERENCES Users(id)

schema_migrations
Службова таблиця для обліку застосованих міграцій.

## Relationships
Users 1:N Comments
Users 1:N Ratings
Resources 1:N Comments
Resources 1:N Ratings

## API endpoints
Resources
GET /api/resources
GET /api/resources?page=1&pageSize=10
GET /api/resources?search=js
GET /api/resources?type=article
GET /api/resources?sort=createdAt&order=desc
GET /api/resources/:id
POST /api/resources
PATCH /api/resources/:id
PUT /api/resources/:id
DELETE /api/resources/:id

Users
GET /api/users
GET /api/users?page=1&pageSize=10
GET /api/users/:id
POST /api/users
PATCH /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id

Comments
GET /api/comments
GET /api/comments?page=1&pageSize=10
GET /api/comments/:id
POST /api/comments
PATCH /api/comments/:id
PUT /api/comments/:id
DELETE /api/comments/:id

Ratings
GET /api/ratings
GET /api/ratings?page=1&pageSize=10
GET /api/ratings/:id
POST /api/ratings
PATCH /api/ratings/:id
PUT /api/ratings/:id
DELETE /api/ratings/:id

## JOIN endpoint
У проєкті реалізовано endpoint із JOIN:
GET /api/resources/:id/comments
Цей endpoint повертає ресурс разом із пов’язаними коментарями.

## Aggregation endpoint
У проєкті реалізовано endpoint з агрегацією:
GET /api/resources/:id/rating
Цей endpoint використовує SQL-функцію AVG для обчислення середнього рейтингу ресурсу.

## SQL injection demonstration
У проєкті навмисно залишено один небезпечний приклад формування SQL-запиту через рядкову конкатенацію в пошуку ресурсів.
Приклад:
sql += ` AND title LIKE '%${query.search}%'`;
Такий підхід є небезпечним, оскільки користувач може передати спеціально сформований рядок, який змінить логіку SQL-запиту.

Приклад небезпечного вводу:
' OR 1=1 --
У такому випадку пошук може повернути всі записи замість очікуваної вибірки.
У цій лабораторній роботі це залишено навмисно для навчальної демонстрації SQL injection. Виправлення не виконувалося, оскільки це окрема частина завдання.

## Error handling
У проєкті використовується централізована обробка помилок.
Повертаються коректні HTTP-коди:
200 — успішне отримання даних
201 — успішне створення
204 — успішне видалення без тіла відповіді
400 — некоректні вхідні дані
404 — ресурс не знайдено
409 — порушення унікальності, наприклад дубль email або url