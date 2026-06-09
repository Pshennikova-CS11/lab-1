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

/* RESOURCES */
const form = document.getElementById("resourceForm");
const tbody = document.getElementById("resourcesTableBody");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const sortSelect = document.getElementById("sortSelect");

/* USERS */
const userForm = document.getElementById("userForm");
const usersTableBody = document.getElementById("usersTableBody");
const userResetBtn = document.getElementById("userResetBtn");

/* COMMENTS */
const commentForm = document.getElementById("commentForm");
const commentsTableBody = document.getElementById("commentsTableBody");
const commentResetBtn = document.getElementById("commentResetBtn");

/* RATINGS */
const ratingForm = document.getElementById("ratingForm");
const ratingsTableBody = document.getElementById("ratingsTableBody");
const ratingResetBtn = document.getElementById("ratingResetBtn");

/* API URLS */ /*Взаємодія лише через API*/
/*const API_BASE_URL = "http://localhost:3000/api/v1";*/

/*const RESOURCES_API_URL = `${API_BASE_URL}/resources`;*/
/*const USERS_API_URL = `${API_BASE_URL}/users`;*/
/*const COMMENTS_API_URL = `${API_BASE_URL}/comments`;*/
/*const RATINGS_API_URL = `${API_BASE_URL}/ratings`;*/

/* COMMON HELPERS */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input) input.classList.add("invalid");
    if (error) error.textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error")
        .forEach(el => el.textContent = "");
}

function setStatus(elementId, text, type = "") {
    const el = document.getElementById(elementId); /*знаходимо HTML-елемент за переданим id*/

    if (!el) return;  /*якщо такого елемента немає на сторінці, функція просто завершується*/

    el.textContent = text; /*записуємо в цей елемент текст повідомлення*/
    el.className = type ? `status ${type}` : "status"; /*додаємо CSS-клас відповідно до типу стану*/
}

function clearStatus(elementId) {
    const el = document.getElementById(elementId);

    if (!el) return;

    el.textContent = "";
    el.className = "status";
}

function showConfirm(message, options = {}) {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirmModal");
        const modalTitle = document.getElementById("confirmModalTitle");
        const modalText = document.getElementById("confirmModalText");
        const okBtn = document.getElementById("confirmOkBtn");
        const cancelBtn = document.getElementById("confirmCancelBtn");

        if (!modal || !modalTitle || !modalText || !okBtn || !cancelBtn) {
            console.error("confirmModal elements not found");
            resolve(false);
            return;
        }

        modalTitle.textContent = options.title || "Підтвердження дії";
        modalText.textContent = message;
        okBtn.textContent = options.okText || "Так, видалити";
        cancelBtn.textContent = options.cancelText || "Скасувати";

        modal.classList.remove("hidden");
        modal.style.display = "flex";

        function close(result) {
            modal.classList.add("hidden");
            modal.style.display = "none";

            okBtn.removeEventListener("click", onOk);
            cancelBtn.removeEventListener("click", onCancel);

            resolve(result);
        }

        function onOk() {
            close(true);
        }

        function onCancel() {
            close(false);
        }

        okBtn.addEventListener("click", onOk);
        cancelBtn.addEventListener("click", onCancel);
    });
}

function showErrorModal(message) {
    const modal = document.getElementById("errorModal");
    const modalText = document.getElementById("errorModalText");
    const okBtn = document.getElementById("errorOkBtn");

    if (!modal || !modalText || !okBtn) {
        console.error(message);
        return;
    }

    modalText.textContent = message;
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    function close() {
        modal.classList.add("hidden");
        modal.style.display = "none";
        okBtn.removeEventListener("click", close);
    }

    okBtn.addEventListener("click", close);
}

const DELETE_DELAY_SECONDS = 10;

let undoTimerId = null;
let undoIntervalId = null;
let undoCancelHandler = null;

function scheduleDelete({ message, button, deleteAction, afterDelete }) {
    const toast = document.getElementById("undoToast");
    const toastText = document.getElementById("undoToastText");
    const toastBtn = document.getElementById("undoToastBtn");

    if (!toast || !toastText || !toastBtn) return;

    if (undoTimerId) {
        clearTimeout(undoTimerId);
        undoTimerId = null;
    }

    if (undoIntervalId) {
        clearInterval(undoIntervalId);
        undoIntervalId = null;
    }

    if (undoCancelHandler) {
        toastBtn.removeEventListener("click", undoCancelHandler);
        undoCancelHandler = null;
    }

    let secondsLeft = DELETE_DELAY_SECONDS;

    function updateToastText() {
        toastText.textContent = `${message} через ${secondsLeft} с.`;
    }

    button.disabled = true;
    updateToastText();

    toast.classList.remove("hidden");
    toast.style.display = "flex";

    undoCancelHandler = () => {
        if (undoTimerId) {
            clearTimeout(undoTimerId);
            undoTimerId = null;
        }

        if (undoIntervalId) {
            clearInterval(undoIntervalId);
            undoIntervalId = null;
        }

        button.disabled = false;

        toast.classList.add("hidden");
        toast.style.display = "none";

        toastBtn.removeEventListener("click", undoCancelHandler);
        undoCancelHandler = null;
    };

    toastBtn.addEventListener("click", undoCancelHandler);

    undoIntervalId = setInterval(() => {
        secondsLeft -= 1;

        if (secondsLeft > 0) {
            updateToastText();
        }
    }, 1000);

    undoTimerId = setTimeout(async () => {
        if (undoIntervalId) {
            clearInterval(undoIntervalId);
            undoIntervalId = null;
        }

        toast.classList.add("hidden");
        toast.style.display = "none";

        toastBtn.removeEventListener("click", undoCancelHandler);
        undoCancelHandler = null;
        undoTimerId = null;

        const result = await deleteAction();

        if (!result.ok) {
            button.disabled = false;

            const message = getApiErrorMessage(result, "Помилка");
            showErrorModal(message);
            console.error("API error:", result.error);
            return;
        }

        await afterDelete();
    }, DELETE_DELAY_SECONDS * 1000);
}

function translateErrorDetail(detail) {
    const translations = {
        // Resources
        "title is required": "Назва обов'язкова",
        "title must be a string": "Назва має бути текстом",
        "title must be between 3 and 100 characters": "Назва має містити від 3 до 100 символів",

        "url is required": "URL обов'язковий",
        "url must be a string": "URL має бути текстом",
        "url must be valid": "URL має бути коректним",

        "type is required": "Тип ресурсу обов'язковий",
        "type must be one of article, video, course": "Тип має бути одним із варіантів: article, video, course",

        "author is required": "Автор обов'язковий",
        "author must be a string": "Автор має бути текстом",
        "author must be between 2 and 50 characters": "Автор має містити від 2 до 50 символів",

        "description is required": "Опис обов'язковий",
        "description must be a string": "Опис має бути текстом",
        "description must be between 5 and 500 characters": "Опис має містити від 5 до 500 символів",

        // Users
        "name is required": "Ім’я користувача обов'язкове",
        "name must be a string": "Ім’я має бути текстом",
        "name must be between 2 and 50 characters": "Ім’я має містити від 2 до 50 символів",

        "email is required": "Email обов'язковий",
        "email must be a string": "Email має бути текстом",
        "email must be valid": "Email має бути коректним",

        // Comments
        "resourceId is required": "Ресурс обов'язковий",
        "resourceId must be a number": "Ідентифікатор ресурсу має бути числом",
        "resourceId must be a positive integer": "Ідентифікатор ресурсу має бути додатним цілим числом",

        "userId is required": "Користувач обов'язковий",
        "userId must be a number": "Ідентифікатор користувача має бути числом",
        "userId must be a positive integer": "Ідентифікатор користувача має бути додатним цілим числом",

        "text is required": "Текст коментаря обов'язковий",
        "text must be a string": "Коментар має бути текстом",
        "text must be between 2 and 500 characters": "Коментар має містити від 2 до 500 символів",

        // Ratings
        "value is required": "Оцінка обов'язкова",
        "value must be a number": "Оцінка має бути числом",
        "value must be between 1 and 5": "Оцінка має бути від 1 до 5"
    };

    return translations[detail] || detail;
}

function translateErrorMessage(message) {
    const translations = {
        "Invalid request body": "Помилка валідації",
        "User with this email already exists": "Користувач із таким email уже існує",
        "Resource with this URL already exists": "Ресурс із таким URL уже існує",
        "Resource not found": "Ресурс не знайдено",
        "User not found": "Користувача не знайдено",
        "Comment not found": "Коментар не знайдено",
        "Rating not found": "Рейтинг не знайдено",
        "Test server error": "Тестова помилка сервера"
    };

    return translations[message] || message;
}

function getApiErrorMessage(result, fallback = "Помилка") {
    const error = result?.error;

    if (!error) {
        return fallback;
    }

    const backendError = error.details?.error;

    if (Array.isArray(backendError?.details)) {
        return backendError.details
            .map(translateErrorDetail)
            .join("\n");
    }

    if (Array.isArray(error.details)) {
        return error.details
            .map(translateErrorDetail)
            .join("\n");
    }

    return translateErrorMessage(
        backendError?.message || error.message || fallback
    );
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

    if (commentResourceId) commentResourceId.innerHTML = resourceOptions;
    if (ratingResourceId) ratingResourceId.innerHTML = resourceOptions;
    if (commentUserId) commentUserId.innerHTML = userOptions;
    if (ratingUserId) ratingUserId.innerHTML = userOptions;
}

/* async function fetchJson(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        return {
            ok: false,
            error: {
                status: 0,
                message: "Помилка мережі або CORS",
                details: error.message
            }
        };
    }

    if (response.status === 204) {
        return { ok: true, data: null };
    }

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        console.error("Server error:", data);

        return {
            ok: false,
            error: {
                status: response.status,
                message: data?.error?.message || data?.message || "HTTP помилка",
                details: data
            }
        };
    }

    return { ok: true, data };
}*/

/* RESOURCE FORM */
function readForm() {
    return {
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        url: document.getElementById("url").value.trim(),
        type: document.getElementById("type").value,
        description: document.getElementById("description").value.trim()
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
    } else if (!isValidURL(data.url)) {
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
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim()
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
    } else if (!data.email.includes("@")) {
        showError("userEmail", "userEmailError", "Некоректний email");
        isValid = false;
    }

    return isValid;
}

/* COMMENT FORM */
function readCommentForm() {
    return {
        resourceId: document.getElementById("commentResourceId").value,
        userId: document.getElementById("commentUserId").value,
        text: document.getElementById("commentText").value.trim()
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

const COMMENTS_AUTH_URL = "http://localhost:3000/api/v1/comments";

function getDemoUserIdFromCommentForm() {
    return document.getElementById("commentUserId").value;
}

function toCommentRequestBody(data) {
    return {
        resourceId: Number(data.resourceId),
        text: data.text
    };
}

async function commentFetchJson(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        return {
            ok: false,
            error: {
                status: 0,
                message: "Помилка мережі або CORS",
                details: error.message
            }
        };
    }

    if (response.status === 204) {
        return { ok: true, data: null };
    }

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        return {
            ok: false,
            error: {
                status: response.status,
                message: data?.error?.message || data?.message || "HTTP помилка",
                details: data
            }
        };
    }

    return { ok: true, data };
}

function createCommentWithAuth(data) {
    const demoUserId = getDemoUserIdFromCommentForm();

    return commentFetchJson(COMMENTS_AUTH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Demo-UserId": demoUserId
        },
        body: JSON.stringify(toCommentRequestBody(data))
    });
}

function updateCommentWithAuth(id, data) {
    const demoUserId = getDemoUserIdFromCommentForm();

    return commentFetchJson(`${COMMENTS_AUTH_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Demo-UserId": demoUserId
        },
        body: JSON.stringify(toCommentRequestBody(data))
    });
}

function deleteCommentWithAuth(id, userId) {
    return commentFetchJson(`${COMMENTS_AUTH_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "X-Demo-UserId": userId
        }
    });
}

/* RATING FORM */
function readRatingForm() {
    return {
        resourceId: document.getElementById("ratingResourceId").value,
        userId: document.getElementById("ratingUserId").value,
        value: Number(document.getElementById("ratingValue").value)
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

    /*const result = await fetchJson(RESOURCES_API_URL);*/
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

/* RESOURCES API */
// async function createResource(data) {
//     const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });
// }

/* async function createResource(data) {
    return fetchJson(RESOURCES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
} */

/*async function updateResource(id, data) {
    return fetchJson(`${RESOURCES_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function deleteResource(id) {
    return fetchJson(`${RESOURCES_API_URL}/${id}`, {
        method: "DELETE"
    });
}*/

/*async function getResourceById(id) {
    return fetchJson(`${RESOURCES_API_URL}/${id}`, {
        method: "GET"
    });
}*/

/* USERS API */
/*async function createUser(data) {
    return fetchJson(USERS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function updateUser(id, data) {
    return fetchJson(`${USERS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function deleteUser(id) {
    return fetchJson(`${USERS_API_URL}/${id}`, {
        method: "DELETE"
    });
}*/

/* COMMENTS API */
/*async function createComment(data) {
    return fetchJson(COMMENTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function updateComment(id, data) {
    return fetchJson(`${COMMENTS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function deleteComment(id) {
    return fetchJson(`${COMMENTS_API_URL}/${id}`, {
        method: "DELETE"
    });
}*/

/* RATINGS API */
/*async function createRating(data) {
    return fetchJson(RATINGS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function updateRating(id, data) {
    return fetchJson(`${RATINGS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}*/

/*async function deleteRating(id) {
    return fetchJson(`${RATINGS_API_URL}/${id}`, {
        method: "DELETE"
    });
}*/

/* RENDER RESOURCES */
function render() {
    let filtered = [...state.resources];

    const searchValue = searchInput.value.toLowerCase();

    if (searchValue) {
        filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(searchValue)
        );
    }

    if (filterType.value) {
        filtered = filtered.filter(r => r.type === filterType.value);
    }

    if (sortSelect.value === "newest") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortSelect.value === "oldest") {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
    if (!usersTableBody) return;

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
/*function renderComments() {
    if (!commentsTableBody) return;

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
}*/

function createTextCell(value) {
    const td = document.createElement("td");
    td.textContent = value ?? "";
    return td;
}

function renderComments() {
    if (!commentsTableBody) return;

    commentsTableBody.replaceChildren();

    state.comments.forEach((c, index) => {
        const tr = document.createElement("tr");

        tr.appendChild(createTextCell(index + 1));
        tr.appendChild(createTextCell(getResourceTitle(c.resourceId)));
        tr.appendChild(createTextCell(getUserName(c.userId)));
        tr.appendChild(createTextCell(c.text));

        const actionsTd = document.createElement("td");
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.dataset.id = c.id;
        editBtn.className = "edit-comment-btn";
        editBtn.textContent = "Редагувати";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.dataset.id = c.id;
        deleteBtn.className = "delete-comment-btn";
        deleteBtn.textContent = "Видалити";

        actionsDiv.append(editBtn, deleteBtn);
        actionsTd.appendChild(actionsDiv);
        tr.appendChild(actionsTd);

        commentsTableBody.appendChild(tr);
    });
}

/* RENDER RATINGS */
function renderRatings() {
    if (!ratingsTableBody) return;

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
        const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей ресурс?", {
            title: "Підтвердження відправки",
            okText: "Так, відправити",
            cancelText: "Скасувати"
        });

        if (!confirmed) {
            return;
        }
    }

    let result;

    if (editId !== null) {
        /* result = await updateResource(editId, data); */
        result = await resourcesApi.update(editId, data);

        if (result.ok) {
            editId = null;
            document.getElementById("submitBtn").textContent = "Додати";
        }
    } else {
        /*result = await createResource(data);*/
        result = await resourcesApi.create(data);
    }

    if (!result.ok) {
        const message = getApiErrorMessage(result, "Помилка");
        showErrorModal(message);

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
    document.getElementById("submitBtn").textContent = "Додати";
});

tbody.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    if (!Number.isInteger(id)) return;

    if (button.classList.contains("delete-btn")) {
        const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей ресурс?");

        if (!confirmed) {
            return;
        }

        scheduleDelete({
            message: "Ресурс буде видалено",
            button,
            deleteAction: () => resourcesApi.remove(id),
            afterDelete: async () => {
                await loadResources();
                await loadComments();
                await loadRatings();
            }
        });
    }

    if (button.classList.contains("edit-btn")) {
        /*const result = await getResourceById(id);*/
        const result = await resourcesApi.getById(id);

        if (!result.ok) {
            const message = getApiErrorMessage(result, "Не вдалося завантажити деталі ресурсу");
            showErrorModal(message);

            console.error("API error:", result.error);
            return;
        }

        const item = result.data;

        document.getElementById("title").value = item.title;
        document.getElementById("author").value = item.author;
        document.getElementById("url").value = item.url;
        document.getElementById("type").value = item.type;
        document.getElementById("description").value = item.description || "";

        editId = id;
        document.getElementById("submitBtn").textContent = "Зберегти";
    }
});

/* EVENTS: USERS */
if (userForm) {
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = readUserForm();
        const isValid = validateUserForm(data);

        if (!isValid) {
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цього користувача?", {
                title: "Підтвердження відправки",
                okText: "Так, відправити",
                cancelText: "Скасувати"
            });

            if (!confirmed) {
                return;
            }
        }

        let result;

        if (editUserId !== null) {
            /*result = await updateUser(editUserId, data);*/
            result = await usersApi.update(editUserId, data);

            if (result.ok) {
                editUserId = null;
                document.getElementById("userSubmitBtn").textContent = "Додати користувача";
            }
        } else {
            /*result = await createUser(data);*/
            result = await usersApi.create(data);
        }

        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            showErrorModal(message);

            console.error("API error:", result.error);
            return;
        }

        await loadUsers();
        renderComments();
        renderRatings();
        renderSelectOptions();

        userForm.reset();
        clearErrors();
    });
}

if (userResetBtn) {
    userResetBtn.addEventListener("click", () => {
        userForm.reset();
        clearErrors();
        editUserId = null;
        document.getElementById("userSubmitBtn").textContent = "Додати користувача";
    });
}

if (usersTableBody) {
    usersTableBody.addEventListener("click", async (e) => {
        const button = e.target.closest("button");
        if (!button) return;

        const id = Number(button.dataset.id);
        if (!Number.isInteger(id)) return;

        if (button.classList.contains("delete-user-btn")) {
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цього користувача?");

            if (!confirmed) {
                return;
            }

            scheduleDelete({
                message: "Користувач буде видалений",
                button,
                deleteAction: () => usersApi.remove(id),
                afterDelete: async () => {
                    await loadUsers();
                    await loadComments();
                    await loadRatings();
                }
            });
        }

        if (button.classList.contains("edit-user-btn")) {
            const item = state.users.find(u => Number(u.id) === id);
            if (!item) return;

            document.getElementById("userName").value = item.name;
            document.getElementById("userEmail").value = item.email;

            editUserId = id;
            document.getElementById("userSubmitBtn").textContent = "Зберегти користувача";
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
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей коментар?", {
                title: "Підтвердження відправки",
                okText: "Так, відправити",
                cancelText: "Скасувати"
            });

            if (!confirmed) {
                return;
            }
        }

        let result;

        if (editCommentId !== null) {
            result = await updateCommentWithAuth(editCommentId, data);

            if (result.ok) {
                editCommentId = null;
                document.getElementById("commentSubmitBtn").textContent = "Додати коментар";
            }
        } else {
            result = await createCommentWithAuth(data);
        }

        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            showErrorModal(message);

            console.error("API error:", result.error);
            return;
        }

        await loadComments();
        commentForm.reset();
        clearErrors();
        renderSelectOptions();
    });
}

if (commentResetBtn) {
    commentResetBtn.addEventListener("click", () => {
        commentForm.reset();
        clearErrors();
        editCommentId = null;
        document.getElementById("commentSubmitBtn").textContent = "Додати коментар";
    });
}

if (commentsTableBody) {
    commentsTableBody.addEventListener("click", async (e) => {
        const button = e.target.closest("button");
        if (!button) return;

        const id = Number(button.dataset.id);
        if (!Number.isInteger(id)) return;

        if (button.classList.contains("delete-comment-btn")) {
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей коментар?");

            if (!confirmed) {
                return;
            }

            scheduleDelete({
                message: "Коментар буде видалено",
                button,
                deleteAction: () => {
                    const item = state.comments.find(c => Number(c.id) === id);
                    const userId = item?.userId;

                    return deleteCommentWithAuth(id, userId);
                },
                afterDelete: async () => {
                    await loadComments();
                }
            });
        }

        if (button.classList.contains("edit-comment-btn")) {
            const item = state.comments.find(c => Number(c.id) === id);
            if (!item) return;

            document.getElementById("commentResourceId").value = item.resourceId;
            document.getElementById("commentUserId").value = item.userId;
            document.getElementById("commentText").value = item.text;

            editCommentId = id;
            document.getElementById("commentSubmitBtn").textContent = "Зберегти коментар";
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
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей рейтинг?", {
                title: "Підтвердження відправки",
                okText: "Так, відправити",
                cancelText: "Скасувати"
            });

            if (!confirmed) {
                return;
            }
        }

        let result;

        if (editRatingId !== null) {
            /*result = await updateRating(editRatingId, data);*/
            result = await ratingsApi.update(editRatingId, data);

            if (result.ok) {
                editRatingId = null;
                document.getElementById("ratingSubmitBtn").textContent = "Додати рейтинг";
            }
        } else {
            /*result = await createRating(data);*/
            result = await ratingsApi.create(data);
        }

        if (!result.ok) {
            const message = getApiErrorMessage(result, "Помилка");
            showErrorModal(message);

            console.error("API error:", result.error);
            return;
        }

        await loadRatings();
        await loadResources();
        ratingForm.reset();
        clearErrors();
        renderSelectOptions();
    });
}

if (ratingResetBtn) {
    ratingResetBtn.addEventListener("click", () => {
        ratingForm.reset();
        clearErrors();
        editRatingId = null;
        document.getElementById("ratingSubmitBtn").textContent = "Додати рейтинг";
    });
}

if (ratingsTableBody) {
    ratingsTableBody.addEventListener("click", async (e) => {
        const button = e.target.closest("button");
        if (!button) return;

        const id = Number(button.dataset.id);
        if (!Number.isInteger(id)) return;

        if (button.classList.contains("delete-rating-btn")) {
            const confirmed = await showConfirm("Ви впевнені, що хочете видалити цей рейтинг?");

            if (!confirmed) {
                return;
            }

            scheduleDelete({
                message: "Рейтинг буде видалено",
                button,
                deleteAction: () => ratingsApi.remove(id),
                afterDelete: async () => {
                    await loadRatings();
                    await loadResources();
                }
            });
        }

        if (button.classList.contains("edit-rating-btn")) {
            const item = state.ratings.find(r => Number(r.id) === id);
            if (!item) return;

            document.getElementById("ratingResourceId").value = item.resourceId;
            document.getElementById("ratingUserId").value = item.userId;
            document.getElementById("ratingValue").value = String(item.value);

            editRatingId = id;
            document.getElementById("ratingSubmitBtn").textContent = "Зберегти рейтинг";
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