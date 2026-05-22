"use strict";
/// <reference path="./types.ts" />
const { resourcesApi, usersApi, commentsApi, ratingsApi } = window;
const state = {
    resources: [],
    users: [],
    comments: [],
    ratings: []
};
let editId = null;
let editUserId = null;
let editCommentId = null;
let editRatingId = null;
function byId(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element with id="${id}" not found`);
    }
    return el;
}
function getButtonFromEvent(e) {
    const target = e.target;
    if (!(target instanceof Element)) {
        return null;
    }
    return target.closest("button");
}
function toTimestamp(value) {
    return value ? new Date(value).getTime() : 0;
}
/* RESOURCES */
const form = byId("resourceForm");
const tbody = byId("resourcesTableBody");
const resetBtn = byId("resetBtn");
const searchInput = byId("searchInput");
const filterType = byId("filterType");
const sortSelect = byId("sortSelect");
const titleInput = byId("title");
const authorInput = byId("author");
const urlInput = byId("url");
const typeInput = byId("type");
const descriptionInput = byId("description");
const submitBtn = byId("submitBtn");
/* USERS */
const userForm = document.getElementById("userForm");
const usersTableBody = document.getElementById("usersTableBody");
const userResetBtn = document.getElementById("userResetBtn");
const userNameInput = byId("userName");
const userEmailInput = byId("userEmail");
const userSubmitBtn = byId("userSubmitBtn");
/* COMMENTS */
const commentForm = document.getElementById("commentForm");
const commentsTableBody = document.getElementById("commentsTableBody");
const commentResetBtn = document.getElementById("commentResetBtn");
const commentResourceIdInput = byId("commentResourceId");
const commentUserIdInput = byId("commentUserId");
const commentTextInput = byId("commentText");
const commentSubmitBtn = byId("commentSubmitBtn");
/* RATINGS */
const ratingForm = document.getElementById("ratingForm");
const ratingsTableBody = document.getElementById("ratingsTableBody");
const ratingResetBtn = document.getElementById("ratingResetBtn");
const ratingResourceIdInput = byId("ratingResourceId");
const ratingUserIdInput = byId("ratingUserId");
const ratingValueInput = byId("ratingValue");
const ratingSubmitBtn = byId("ratingSubmitBtn");
/* COMMON HELPERS */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)
        input.classList.add("invalid");
    if (error)
        error.textContent = message;
}
function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error")
        .forEach(el => el.textContent = "");
}
function setStatus(elementId, text, type = "") {
    const el = document.getElementById(elementId); /*знаходимо HTML-елемент за переданим id*/
    if (!el)
        return; /*якщо такого елемента немає на сторінці, функція просто завершується*/
    el.textContent = text; /*записуємо в цей елемент текст повідомлення*/
    el.className = type ? `status ${type}` : "status"; /*додаємо CSS-клас відповідно до типу стану*/
}
function clearStatus(elementId) {
    const el = document.getElementById(elementId);
    if (!el)
        return;
    el.textContent = "";
    el.className = "status";
}
function getApiErrorMessage(result, fallback = "Помилка") {
    if (result.ok) {
        return fallback;
    }
    const error = result.error;
    const details = error.details;
    if (Array.isArray(details)) {
        return `${error.message || fallback}:\n${details.join("\n")}`;
    }
    if (details &&
        typeof details === "object" &&
        "error" in details &&
        Array.isArray(details.error.details)) {
        return `${details.error.message || fallback}:\n${details.error.details.join("\n")}`;
    }
    if (details &&
        typeof details === "object" &&
        "error" in details) {
        return details.error.message || error.message || fallback;
    }
    return error.message || fallback;
}
function getResourceTitle(resourceId) {
    const resource = state.resources.find(r => Number(r.id) === Number(resourceId));
    return resource
        ? resource.title
        : `Ресурс видалено (id: ${resourceId})`;
}
function getUserName(userId) {
    const user = state.users.find(u => Number(u.id) === Number(userId));
    return user
        ? user.name
        : `Користувача видалено (id: ${userId})`;
}
function renderSelectOptions() {
    const commentResourceId = document.getElementById("commentResourceId");
    const commentUserId = document.getElementById("commentUserId");
    const ratingResourceId = document.getElementById("ratingResourceId");
    const ratingUserId = document.getElementById("ratingUserId");
    const resourceOptions = `
        <option value="">Оберіть ресурс</option>
        ${state.resources.map(r => `<option value="${r.id}">${r.title}</option>`).join("")}
    `;
    const userOptions = `
        <option value="">Оберіть користувача</option>
        ${state.users.map(u => `<option value="${u.id}">${u.name}</option>`).join("")}
    `;
    if (commentResourceId)
        commentResourceId.innerHTML = resourceOptions;
    if (ratingResourceId)
        ratingResourceId.innerHTML = resourceOptions;
    if (commentUserId)
        commentUserId.innerHTML = userOptions;
    if (ratingUserId)
        ratingUserId.innerHTML = userOptions;
}
/* RESOURCE FORM */
function readForm() {
    return {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        url: urlInput.value.trim(),
        type: typeInput.value,
        description: descriptionInput.value.trim()
    };
}
function validate(data) {
    let isValid = true;
    clearErrors();
    if (!data.title) {
        showError("title", "titleError", "Назва обов'язкова");
        isValid = false;
    }
    if (!data.author) {
        showError("author", "authorError", "Автор обов'язковий");
        isValid = false;
    }
    if (!data.url) {
        showError("url", "urlError", "URL обов'язковий");
        isValid = false;
    }
    else if (!isValidURL(data.url)) {
        showError("url", "urlError", "Некоректний URL");
        isValid = false;
    }
    if (!data.type) {
        showError("type", "typeError", "Оберіть тип");
        isValid = false;
    }
    if (!data.description) {
        showError("description", "descriptionError", "Опис обов'язковий");
        isValid = false;
    }
    return isValid;
}
/* USER FORM */
function readUserForm() {
    return {
        name: userNameInput.value.trim(),
        email: userEmailInput.value.trim()
    };
}
function validateUserForm(data) {
    let isValid = true;
    clearErrors();
    if (!data.name) {
        showError("userName", "userNameError", "Ім’я обов'язкове");
        isValid = false;
    }
    if (!data.email) {
        showError("userEmail", "userEmailError", "Email обов'язковий");
        isValid = false;
    }
    else if (!data.email.includes("@")) {
        showError("userEmail", "userEmailError", "Некоректний email");
        isValid = false;
    }
    return isValid;
}
/* COMMENT FORM */
function readCommentForm() {
    return {
        resourceId: commentResourceIdInput.value,
        userId: commentUserIdInput.value,
        text: commentTextInput.value.trim()
    };
}
function validateCommentForm(data) {
    let isValid = true;
    clearErrors();
    if (!data.resourceId) {
        showError("commentResourceId", "commentResourceIdError", "Оберіть ресурс");
        isValid = false;
    }
    if (!data.userId) {
        showError("commentUserId", "commentUserIdError", "Оберіть користувача");
        isValid = false;
    }
    if (!data.text) {
        showError("commentText", "commentTextError", "Коментар обов'язковий");
        isValid = false;
    }
    return isValid;
}
/* RATING FORM */
function readRatingForm() {
    return {
        resourceId: ratingResourceIdInput.value,
        userId: ratingUserIdInput.value,
        value: Number(ratingValueInput.value)
    };
}
function validateRatingForm(data) {
    let isValid = true;
    clearErrors();
    if (!data.resourceId) {
        showError("ratingResourceId", "ratingResourceIdError", "Оберіть ресурс");
        isValid = false;
    }
    if (!data.userId) {
        showError("ratingUserId", "ratingUserIdError", "Оберіть користувача");
        isValid = false;
    }
    if (!data.value || data.value < 1 || data.value > 5) {
        showError("ratingValue", "ratingValueError", "Оберіть оцінку від 1 до 5");
        isValid = false;
    }
    return isValid;
}
/* LOAD DATA */
async function loadResources() {
    setStatus("resourcesStatus", "Завантаження...", "loading");
    tbody.innerHTML = "";
    const result = await resourcesApi.getList();
    if (!result.ok) {
        state.resources = [];
        tbody.innerHTML = "";
        setStatus("resourcesStatus", result.error?.message || "Помилка завантаження ресурсів", "error");
        return;
    }
    state.resources = result.data || [];
    if (state.resources.length === 0) {
        render();
        setStatus("resourcesStatus", "Немає даних", "empty");
        return;
    }
    render();
    renderSelectOptions();
    clearStatus("resourcesStatus");
}
async function loadUsers() {
    if (!usersTableBody)
        return;
    setStatus("usersStatus", "Завантаження...", "loading");
    usersTableBody.innerHTML = "";
    /*const result = await fetchJson(USERS_API_URL);*/
    const result = await usersApi.getList();
    if (!result.ok) {
        state.users = [];
        usersTableBody.innerHTML = "";
        setStatus("usersStatus", result.error?.message || "Помилка завантаження користувачів", "error");
        return;
    }
    state.users = result.data || [];
    if (state.users.length === 0) {
        renderUsers();
        setStatus("usersStatus", "Немає даних", "empty");
        return;
    }
    renderUsers();
    renderSelectOptions();
    clearStatus("usersStatus");
}
async function loadComments() {
    if (!commentsTableBody)
        return;
    setStatus("commentsStatus", "Завантаження...", "loading");
    commentsTableBody.innerHTML = "";
    /* const result = await fetchJson(COMMENTS_API_URL); */
    const result = await commentsApi.getList();
    if (!result.ok) {
        state.comments = [];
        commentsTableBody.innerHTML = "";
        setStatus("commentsStatus", result.error?.message || "Помилка завантаження коментарів", "error");
        return;
    }
    state.comments = result.data || [];
    if (state.comments.length === 0) {
        renderComments();
        setStatus("commentsStatus", "Немає даних", "empty");
        return;
    }
    renderComments();
    clearStatus("commentsStatus");
}
async function loadRatings() {
    if (!ratingsTableBody)
        return;
    setStatus("ratingsStatus", "Завантаження...", "loading");
    ratingsTableBody.innerHTML = "";
    /* const result = await fetchJson(RATINGS_API_URL); */
    const result = await ratingsApi.getList();
    if (!result.ok) {
        state.ratings = [];
        ratingsTableBody.innerHTML = "";
        setStatus("ratingsStatus", result.error?.message || "Помилка завантаження рейтингів", "error");
        return;
    }
    state.ratings = result.data || [];
    if (state.ratings.length === 0) {
        renderRatings();
        setStatus("ratingsStatus", "Немає даних", "empty");
        return;
    }
    renderRatings();
    clearStatus("ratingsStatus");
}
/* RENDER RESOURCES */
function render() {
    let filtered = [...state.resources];
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
        filtered = filtered.filter(r => r.title.toLowerCase().includes(searchValue));
    }
    if (filterType.value) {
        filtered = filtered.filter(r => r.type === filterType.value);
    }
    if (sortSelect.value === "newest") {
        filtered.sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
    }
    if (sortSelect.value === "oldest") {
        filtered.sort((a, b) => toTimestamp(a.createdAt) - toTimestamp(b.createdAt));
    }
    tbody.innerHTML = filtered.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.title}</td>
            <td>${r.author}</td>
            <td>${r.type}</td>
            <td>${Number(r.averageRating || 0).toFixed(1)}</td>
            <td><a href="${r.url}" target="_blank">Посилання</a></td>
            <td class="actions-col">
                <div class="actions">
                    <button type="button" data-id="${r.id}" class="edit-btn">Редагувати</button>
                    <button type="button" data-id="${r.id}" class="delete-btn">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}
/* RENDER USERS */
function renderUsers() {
    if (!usersTableBody)
        return;
    usersTableBody.innerHTML = state.users.map((u, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>
                <div class="actions">
                    <button type="button" data-id="${u.id}" class="edit-user-btn">Редагувати</button>
                    <button type="button" data-id="${u.id}" class="delete-user-btn">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}
/* RENDER COMMENTS */
function renderComments() {
    if (!commentsTableBody)
        return;
    commentsTableBody.innerHTML = state.comments.map((c, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${getResourceTitle(c.resourceId)}</td>
            <td>${getUserName(c.userId)}</td>
            <td>${c.text}</td>
            <td>
                <div class="actions">
                    <button type="button" data-id="${c.id}" class="edit-comment-btn">Редагувати</button>
                    <button type="button" data-id="${c.id}" class="delete-comment-btn">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}
/* RENDER RATINGS */
function renderRatings() {
    if (!ratingsTableBody)
        return;
    ratingsTableBody.innerHTML = state.ratings.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${getResourceTitle(r.resourceId)}</td>
            <td>${getUserName(r.userId)}</td>
            <td>${r.value}</td>
            <td>
                <div class="actions">
                    <button type="button" data-id="${r.id}" class="edit-rating-btn">Редагувати</button>
                    <button type="button" data-id="${r.id}" class="delete-rating-btn">Видалити</button>
                </div>
            </td>
        </tr>
    `).join("");
}
/* EVENTS: RESOURCES */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = readForm();
    const isValid = validate(data);
    if (!isValid) {
        if (!confirm("Форма невалідна. Відправити все одно?")) {
            return;
        }
    }
    let result;
    if (editId !== null) {
        /* result = await updateResource(editId, data); */
        result = await resourcesApi.update(editId, data);
        if (result.ok) {
            editId = null;
            submitBtn.textContent = "Додати";
        }
    }
    else {
        /*result = await createResource(data);*/
        result = await resourcesApi.create(data);
    }
    if (!result.ok) {
        const message = getApiErrorMessage(result, "Помилка");
        alert(message);
        console.error("API error:", result.error);
        return;
    }
    await loadResources();
    renderComments();
    renderRatings();
    renderSelectOptions();
    form.reset();
    clearErrors();
});
resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    editId = null;
    submitBtn.textContent = "Додати";
});
tbody.addEventListener("click", async (e) => {
    const button = getButtonFromEvent(e);
    if (!button)
        return;
    const id = Number(button.dataset.id);
    if (!Number.isInteger(id))
        return;
    if (button.classList.contains("delete-btn")) {
        const confirmed = confirm("Ви впевнені, що хочете видалити цей ресурс?");
        if (!confirmed) {
            return;
        }
        button.disabled = true;
        const result = await resourcesApi.remove(id);
        if (!result.ok) {
            button.disabled = false;
            const message = getApiErrorMessage(result, "Помилка");
            alert(message);
            console.error("API error:", result.error);
            return;
        }
        await loadResources();
        await loadComments();
        await loadRatings();
    }
    if (button.classList.contains("edit-btn")) {
        /*const result = await getResourceById(id);*/
        const result = await resourcesApi.getById(id);
        if (!result.ok) {
            const message = getApiErrorMessage(result, "Не вдалося завантажити деталі ресурсу");
            alert(message);
            console.error("API error:", result.error);
            return;
        }
        const item = result.data;
        titleInput.value = item.title;
        authorInput.value = item.author;
        urlInput.value = item.url;
        typeInput.value = item.type;
        descriptionInput.value = item.description || "";
        editId = id;
        submitBtn.textContent = "Зберегти";
    }
});
/* EVENTS: USERS */
if (userForm) {
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = readUserForm();
        const isValid = validateUserForm(data);
        if (!isValid) {
            if (!confirm("Форма невалідна. Відправити все одно?")) {
                return;
            }
        }
        let result;
        if (editUserId !== null) {
            /*result = await updateUser(editUserId, data);*/
            result = await usersApi.update(editUserId, data);
            if (result.ok) {
                editUserId = null;
                userSubmitBtn.textContent = "Додати користувача";
            }
        }
        else {
            /*result = await createUser(data);*/
            result = await usersApi.create(data);
        }
        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            alert(message);
            console.error("API error:", result.error);
            return;
        }
        await loadUsers();
        renderComments();
        renderRatings();
        renderSelectOptions();
        userForm?.reset();
        clearErrors();
    });
}
if (userResetBtn) {
    userResetBtn.addEventListener("click", () => {
        userForm?.reset();
        clearErrors();
        editUserId = null;
        userSubmitBtn.textContent = "Додати користувача";
    });
}
if (usersTableBody) {
    usersTableBody.addEventListener("click", async (e) => {
        const button = getButtonFromEvent(e);
        if (!button)
            return;
        const id = Number(button.dataset.id);
        if (!Number.isInteger(id))
            return;
        if (button.classList.contains("delete-user-btn")) {
            const confirmed = confirm("Ви впевнені, що хочете видалити цього користувача?");
            if (!confirmed) {
                return;
            }
            button.disabled = true;
            const result = await usersApi.remove(id);
            if (!result.ok) {
                button.disabled = false;
                const message = getApiErrorMessage(result, "Помилка");
                alert(message);
                console.error("API error:", result.error);
                return;
            }
            await loadUsers();
            await loadComments();
            await loadRatings();
        }
        if (button.classList.contains("edit-user-btn")) {
            const item = state.users.find(u => Number(u.id) === id);
            if (!item)
                return;
            userNameInput.value = item.name;
            userEmailInput.value = item.email;
            editUserId = id;
            userSubmitBtn.textContent = "Зберегти користувача";
        }
    });
}
/* EVENTS: COMMENTS */
if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = readCommentForm();
        const isValid = validateCommentForm(data);
        if (!isValid) {
            if (!confirm("Форма невалідна. Відправити все одно?")) {
                return;
            }
        }
        let result;
        if (editCommentId !== null) {
            /*result = await updateComment(editCommentId, data);*/
            result = await commentsApi.update(editCommentId, data);
            if (result.ok) {
                editCommentId = null;
                commentSubmitBtn.textContent = "Додати коментар";
            }
        }
        else {
            /*result = await createComment(data);*/
            result = await commentsApi.create(data);
        }
        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            alert(message);
            console.error("API error:", result.error);
            return;
        }
        await loadComments();
        commentForm?.reset();
        clearErrors();
        renderSelectOptions();
    });
}
if (commentResetBtn) {
    commentResetBtn.addEventListener("click", () => {
        commentForm?.reset();
        clearErrors();
        editCommentId = null;
        commentSubmitBtn.textContent = "Додати коментар";
    });
}
if (commentsTableBody) {
    commentsTableBody.addEventListener("click", async (e) => {
        const button = getButtonFromEvent(e);
        if (!button)
            return;
        const id = Number(button.dataset.id);
        if (!Number.isInteger(id))
            return;
        if (button.classList.contains("delete-comment-btn")) {
            const confirmed = confirm("Ви впевнені, що хочете видалити цей коментар?");
            if (!confirmed) {
                return;
            }
            button.disabled = true;
            const result = await commentsApi.remove(id);
            if (!result.ok) {
                button.disabled = false;
                const message = getApiErrorMessage(result, "Помилка");
                alert(message);
                console.error("API error:", result.error);
                return;
            }
            await loadComments();
        }
        if (button.classList.contains("edit-comment-btn")) {
            const item = state.comments.find(c => Number(c.id) === id);
            if (!item)
                return;
            commentResourceIdInput.value = String(item.resourceId);
            commentUserIdInput.value = String(item.userId);
            commentTextInput.value = item.text;
            editCommentId = id;
            commentSubmitBtn.textContent = "Зберегти коментар";
        }
    });
}
/* EVENTS: RATINGS */
if (ratingForm) {
    ratingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = readRatingForm();
        const isValid = validateRatingForm(data);
        if (!isValid) {
            if (!confirm("Форма невалідна. Відправити все одно?")) {
                return;
            }
        }
        let result;
        if (editRatingId !== null) {
            /*result = await updateRating(editRatingId, data);*/
            result = await ratingsApi.update(editRatingId, data);
            if (result.ok) {
                editRatingId = null;
                ratingSubmitBtn.textContent = "Додати рейтинг";
            }
        }
        else {
            /*result = await createRating(data);*/
            result = await ratingsApi.create(data);
        }
        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            alert(message);
            console.error("API error:", result.error);
            return;
        }
        await loadRatings();
        await loadResources();
        ratingForm?.reset();
        clearErrors();
        renderSelectOptions();
    });
}
if (ratingResetBtn) {
    ratingResetBtn.addEventListener("click", () => {
        ratingForm?.reset();
        clearErrors();
        editRatingId = null;
        ratingSubmitBtn.textContent = "Додати рейтинг";
    });
}
if (ratingsTableBody) {
    ratingsTableBody.addEventListener("click", async (e) => {
        const button = getButtonFromEvent(e);
        if (!button)
            return;
        const id = Number(button.dataset.id);
        if (!Number.isInteger(id))
            return;
        if (button.classList.contains("delete-rating-btn")) {
            const confirmed = confirm("Ви впевнені, що хочете видалити цей рейтинг?");
            if (!confirmed) {
                return;
            }
            button.disabled = true;
            const result = await ratingsApi.remove(id);
            if (!result.ok) {
                button.disabled = false;
                const message = getApiErrorMessage(result, "Помилка");
                alert(message);
                console.error("API error:", result.error);
                return;
            }
            await loadRatings();
            await loadResources();
        }
        if (button.classList.contains("edit-rating-btn")) {
            const item = state.ratings.find(r => Number(r.id) === id);
            if (!item)
                return;
            ratingResourceIdInput.value = String(item.resourceId);
            ratingUserIdInput.value = String(item.userId);
            ratingValueInput.value = String(item.value);
            editRatingId = id;
            ratingSubmitBtn.textContent = "Зберегти рейтинг";
        }
    });
}
/* FILTERS */
searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);
/* INIT */
async function init() {
    await loadResources();
    await loadUsers();
    await loadComments();
    await loadRatings();
    renderSelectOptions();
}
init();
