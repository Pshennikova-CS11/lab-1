const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");

const app = express();

/* КРИТЕРІЙ: працюючий Express-сервер із базовою структурою. */
app.use(cors());
app.use(express.json());

/* Щоб на localhost:3000 відкривався frontend */
app.use(express.static(path.join(__dirname, "..")));

/* КРИТЕРІЙ: логування запитів */
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
            `${req.method} ${req.originalUrl} -> ${res.statusCode} [${duration}ms]`
        );
    });

    next();
});

/* Дані зберігаються в оперативній пам’яті */
let users = [];
let resources = [];
let ratings = [];
let comments = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/* КРИТЕРІЙ: серверна валідація вхідних даних. перевіряє required + прості правила. */
function validateUser(data) {
    const errors = [];

    if (!data.name) {
        errors.push("name is required");
    } else if (typeof data.name !== "string") {
        errors.push("name must be a string");
    } else if (data.name.trim().length < 2 || data.name.trim().length > 50) {
        errors.push("name must be between 2 and 50 characters");
    }

    if (!data.email) {
        errors.push("email is required");
    } else if (typeof data.email !== "string") {
        errors.push("email must be a string");
    } else if (!data.email.includes("@")) {
        errors.push("email must be valid");
    }

    return errors;
}

/* Валідація ресурсу */
function validateResource(data) {
    const errors = [];

    if (!data.title) errors.push("title is required");
    else if (typeof data.title !== "string") errors.push("title must be a string");

    if (!data.url) errors.push("url is required");

    if (!data.type) errors.push("type is required");
    else if (!["article", "video", "course"].includes(data.type)) {
        errors.push("type must be one of article, video, course");
    }

    if (!data.author) errors.push("author is required");

    return errors;
}

/* Валідація рейтингу */
function validateRating(data) {
    const errors = [];

    if (!data.resourceId) errors.push("resourceId is required");
    if (!data.userId) errors.push("userId is required");

    if (data.value === undefined) errors.push("value is required");
    else if (typeof data.value !== "number") errors.push("value must be a number");
    else if (data.value < 1 || data.value > 5) errors.push("value must be 1-5");

    return errors;
}

/* Валідація коментаря */
function validateComment(data) {
    const errors = [];

    if (!data.resourceId) errors.push("resourceId is required");
    if (!data.userId) errors.push("userId is required");

    if (!data.text) errors.push("text is required");
    else if (typeof data.text !== "string") errors.push("text must be a string");
    else if (data.text.length > 500) errors.push("text max length 500 chars");

    return errors;
}

/*КРИТЕРІЙ: POST повертає 201 і створений об’єкт. працює валідація і DTO: запит не містить id, а відповідь містить id.*/
app.post("/api/users", (req, res, next) => {
    const errors = validateUser(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    const user = {
        id: uuidv4(),
        name: req.body.name.trim(),
        email: req.body.email.trim()
    };

    users.push(user);

    res.status(201).json(user);
});

/*КРИТЕРІЙ: GET повертає 200 і коректний JSON.*/
app.get("/api/users", (req, res) => {
    res.status(200).json(users);
});

/*КРИТЕРІЙ: GET by id для другої обов’язкової сутності. якщо користувача не існує — повертає 404.*/
app.get("/api/users/:id", (req, res, next) => {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return next({
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        });
    }

    res.status(200).json(user);
});

/* КРИТЕРІЙ: PUT повертає 200. перевірка існування ресурсу і валідація.*/
app.put("/api/users/:id", (req, res, next) => {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return next({
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        });
    }

    const errors = validateUser(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    user.name = req.body.name.trim();
    user.email = req.body.email.trim();

    res.status(200).json(user);
});

/* КРИТЕРІЙ: DELETE повертає 204. якщо користувача не знайдено — 404.*/
app.delete("/api/users/:id", (req, res, next) => {
    const exists = users.some(u => u.id === req.params.id);

    if (!exists) {
        return next({
            code: "NOT_FOUND",
            message: "User not found",
            status: 404
        });
    }

    users = users.filter(u => u.id !== req.params.id);

    res.status(204).send();
});

/*КРИТЕРІЙ: POST повертає 201 і створений об’єкт. основна доменна сутність реалізована.*/
app.post("/api/resources", (req, res, next) => {
    const errors = validateResource(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    const resource = {
        id: uuidv4(),
        title: req.body.title,
        url: req.body.url,
        type: req.body.type,
        description: req.body.description || "",
        author: req.body.author,
        createdAt: Date.now()
    };

    resources.push(resource);

    res.status(201).json(resource);
});

/*КРИТЕРІЙ: GET list повертає 200 і JSON.*/
app.get("/api/resources", (req, res) => {
    res.status(200).json(resources);
});

/*КРИТЕРІЙ: GET by id повертає 200 або 404.*/
app.get("/api/resources/:id", (req, res, next) => {
    const resource = resources.find(r => r.id === req.params.id);

    if (!resource) {
        return next({
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        });
    }

    res.status(200).json(resource);
});

/*КРИТЕРІЙ: PUT повертає 200. валідація та 404 якщо ресурс не існує.*/
app.put("/api/resources/:id", (req, res, next) => {
    const resource = resources.find(r => r.id === req.params.id);

    if (!resource) {
        return next({
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        });
    }

    const errors = validateResource(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    resource.title = req.body.title;
    resource.url = req.body.url;
    resource.type = req.body.type;
    resource.description = req.body.description || "";
    resource.author = req.body.author;

    res.status(200).json(resource);
});

/*КРИТЕРІЙ:DELETE повертає 204.*/
app.delete("/api/resources/:id", (req, res, next) => {
    const exists = resources.some(r => r.id === req.params.id);

    if (!exists) {
        return next({
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        });
    }

    resources = resources.filter(r => r.id !== req.params.id);

    res.status(204).send();
});

/* RATINGS */
app.post("/api/ratings", (req, res, next) => {
    const errors = validateRating(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    const rating = {
        id: uuidv4(),
        resourceId: req.body.resourceId,
        userId: req.body.userId,
        value: req.body.value
    };

    ratings.push(rating);

    res.status(201).json(rating);
});

app.get("/api/resources/:id/ratings", (req, res) => {
    const resourceRatings = ratings.filter(r => r.resourceId === req.params.id);
    res.status(200).json(resourceRatings);
});

/* COMMENTS */
app.post("/api/comments", (req, res, next) => {
    const errors = validateComment(req.body);

    if (errors.length) {
        return next({
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        });
    }

    const comment = {
        id: uuidv4(),
        resourceId: req.body.resourceId,
        userId: req.body.userId,
        text: req.body.text
    };

    comments.push(comment);

    res.status(201).json(comment);
});

app.get("/api/resources/:id/comments", (req, res) => {
    const resourceComments = comments.filter(c => c.resourceId === req.params.id);
    res.status(200).json(resourceComments);
});

/*КРИТЕРІЙ: є єдиний формат помилки + централізований error-handler. ловить і очікувані, і неочікувані помилки.*/
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const response = {
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "Unexpected error"
        }
    };
    if (err.details) {
        response.error.details = err.details;
    }
    res.status(status).json(response);
});

/*КРИТЕРІЙ: Сервер запускається локально.*/
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});