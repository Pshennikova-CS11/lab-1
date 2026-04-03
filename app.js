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

/* API URLS */
const RESOURCES_API_URL = "/api/resources";
const USERS_API_URL = "/api/users";
const COMMENTS_API_URL = "/api/comments";
const RATINGS_API_URL = "/api/ratings";

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

function getResourceTitle(resourceId) {
    const resource = state.resources.find(r => r.id === resourceId);
    return resource ? resource.title : resourceId;
}

function getUserName(userId) {
    const user = state.users.find(u => u.id === userId);
    return user ? user.name : userId;
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

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);

    if (response.status === 204) {
        return { ok: true, data: null };
    }

    const data = await response.json();

    if (!response.ok) {
        console.error("Server error:", JSON.stringify(data, null, 2));
        return { ok: false, error: data };
    }

    return { ok: true, data };
}

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
    const result = await fetchJson(RESOURCES_API_URL);
    if (result.ok) {
        state.resources = result.data;
        render();
        renderSelectOptions();
    }
}

async function loadUsers() {
    const result = await fetchJson(USERS_API_URL);
    if (result.ok) {
        state.users = result.data;
        renderUsers();
        renderSelectOptions();
    }
}

async function loadComments() {
    const result = await fetchJson(COMMENTS_API_URL);
    if (result.ok) {
        state.comments = result.data;
        renderComments();
    }
}

async function loadRatings() {
    const result = await fetchJson(RATINGS_API_URL);
    if (result.ok) {
        state.ratings = result.data;
        renderRatings();
    }
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

async function createResource(data) {
    return fetchJson(RESOURCES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function updateResource(id, data) {
    return fetchJson(`${RESOURCES_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function deleteResource(id) {
    return fetchJson(`${RESOURCES_API_URL}/${id}`, {
        method: "DELETE"
    });
}

/* USERS API */
async function createUser(data) {
    return fetchJson(USERS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function updateUser(id, data) {
    return fetchJson(`${USERS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function deleteUser(id) {
    return fetchJson(`${USERS_API_URL}/${id}`, {
        method: "DELETE"
    });
}

/* COMMENTS API */
async function createComment(data) {
    return fetchJson(COMMENTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function updateComment(id, data) {
    return fetchJson(`${COMMENTS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function deleteComment(id) {
    return fetchJson(`${COMMENTS_API_URL}/${id}`, {
        method: "DELETE"
    });
}

/* RATINGS API */
async function createRating(data) {
    return fetchJson(RATINGS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function updateRating(id, data) {
    return fetchJson(`${RATINGS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

async function deleteRating(id) {
    return fetchJson(`${RATINGS_API_URL}/${id}`, {
        method: "DELETE"
    });
}

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
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (sortSelect.value === "oldest") {
        filtered.sort((a, b) => a.createdAt - b.createdAt);
    }

    tbody.innerHTML = filtered.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.title}</td>
            <td>${r.author}</td>
            <td>${r.type}</td>
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
function renderComments() {
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
        console.error("Client validation error: invalid resource data");
    }

    let result;

    if (editId) {
        result = await updateResource(editId, data);

        if (result.ok) {
            editId = null;
            document.getElementById("submitBtn").textContent = "Додати";
        }
    } else {
        result = await createResource(data);
    }

    if (!result.ok) return;

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
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
        const result = await deleteResource(id);
        if (!result.ok) return;

        await loadResources();
        await loadComments();
        await loadRatings();
    }

    if (e.target.classList.contains("edit-btn")) {
        const item = state.resources.find(r => r.id === id);
        if (!item) return;

        document.getElementById("title").value = item.title;
        document.getElementById("author").value = item.author;
        document.getElementById("url").value = item.url;
        document.getElementById("type").value = item.type;
        document.getElementById("description").value = item.description;

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
            console.error("Client validation error: invalid user data");
        }

        let result;

        if (editUserId) {
            result = await updateUser(editUserId, data);

            if (result.ok) {
                editUserId = null;
                document.getElementById("userSubmitBtn").textContent = "Додати користувача";
            }
        } else {
            result = await createUser(data);
        }

        if (!result.ok) return;

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
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-user-btn")) {
            const result = await deleteUser(id);
            if (!result.ok) return;

            await loadUsers();
            await loadComments();
            await loadRatings();
        }

        if (e.target.classList.contains("edit-user-btn")) {
            const item = state.users.find(u => u.id === id);
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
            console.error("Client validation error: invalid comment data");
        }

        let result;

        if (editCommentId) {
            result = await updateComment(editCommentId, data);

            if (result.ok) {
                editCommentId = null;
                document.getElementById("commentSubmitBtn").textContent = "Додати коментар";
            }
        } else {
            result = await createComment(data);
        }

        if (!result.ok) return;

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
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-comment-btn")) {
            const result = await deleteComment(id);
            if (!result.ok) return;

            await loadComments();
        }

        if (e.target.classList.contains("edit-comment-btn")) {
            const item = state.comments.find(c => c.id === id);
            if (!item) return;

            document.getElementById("commentResourceId").value = item.resourceId;
            document.getElementById("commentUserId").value = item.userId;
            document.getElementById("commentText").value = item.text;

            editCommentId = id;
            document.getElementById("commentSubmitBtn").textContent = "Зберегти коментар";
        }
    });
}

/* =========================
   EVENTS: RATINGS
   ========================= */
if (ratingForm) {
    ratingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = readRatingForm();
        const isValid = validateRatingForm(data);

        if (!isValid) {
            console.error("Client validation error: invalid rating data");
        }

        let result;

        if (editRatingId) {
            result = await updateRating(editRatingId, data);

            if (result.ok) {
                editRatingId = null;
                document.getElementById("ratingSubmitBtn").textContent = "Додати рейтинг";
            }
        } else {
            result = await createRating(data);
        }

        if (!result.ok) return;

        await loadRatings();
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
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-rating-btn")) {
            const result = await deleteRating(id);
            if (!result.ok) return;

            await loadRatings();
        }

        if (e.target.classList.contains("edit-rating-btn")) {
            const item = state.ratings.find(r => r.id === id);
            if (!item) return;

            document.getElementById("ratingResourceId").value = item.resourceId;
            document.getElementById("ratingUserId").value = item.userId;
            document.getElementById("ratingValue").value = String(item.value);

            editRatingId = id;
            document.getElementById("ratingSubmitBtn").textContent = "Зберегти рейтинг";
        }
    });
}

/* =========================
   FILTERS
   ========================= */
searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);

/* =========================
   INIT
   ========================= */
async function init() {
    await loadResources();
    await loadUsers();
    await loadComments();
    await loadRatings();
    renderSelectOptions();
}

init();