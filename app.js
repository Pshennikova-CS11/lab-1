const state = {
    resources: [],
    nextId: 1
};

let editId = null;

const form = document.getElementById("resourceForm");
const tbody = document.getElementById("resourcesTableBody");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const sortSelect = document.getElementById("sortSelect");

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

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error")
        .forEach(el => el.textContent = "");
}

function addItem(data) {
    state.resources.push({
        id: state.nextId++,
        createdAt: Date.now(),
        ...data
    });
}

function deleteItem(id) {
    state.resources = state.resources.filter(r => r.id !== id);
}

function saveToStorage() {
    localStorage.setItem("resources", JSON.stringify(state.resources));
}

function loadFromStorage() {
    const data = localStorage.getItem("resources");
    if (data) {
        state.resources = JSON.parse(data);

        state.resources.forEach(r => {
            if (!r.createdAt) {
                r.createdAt = Date.now();
            }
        });

        state.nextId = Math.max(0, ...state.resources.map(r => r.id)) + 1;
    }
}

function render() {

    let filtered = [...state.resources];

    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
        filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(searchValue)
        );
    }

    if (filterType.value) {
        filtered = filtered.filter(r =>
            r.type === filterType.value
        );
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
                <button type="button" data-id="${r.id}" class="edit-btn">
                    Редагувати
                </button>
                <button type="button" data-id="${r.id}" class="delete-btn">
                    Видалити
                </button>
            </div>
        </td>
    </tr>
`).join("");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = readForm();
    if (!validate(data)) return;

    if (editId) {
        const index = state.resources.findIndex(r => r.id === editId);
        state.resources[index] = {
            ...state.resources[index],
            ...data
        };
        editId = null;
        document.getElementById("submitBtn").textContent = "Додати";
    } else {
        addItem(data);
    }

    saveToStorage();
    render();
    form.reset();
});

resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    editId = null;
    document.getElementById("submitBtn").textContent = "Додати";
});

tbody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        deleteItem(id);
        saveToStorage();
        render();
    }

    if (e.target.classList.contains("edit-btn")) {
        const item = state.resources.find(r => r.id === id);

        document.getElementById("title").value = item.title;
        document.getElementById("author").value = item.author;
        document.getElementById("url").value = item.url;
        document.getElementById("type").value = item.type;
        document.getElementById("description").value = item.description;

        editId = id;
        document.getElementById("submitBtn").textContent = "Зберегти";
    }
});

searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);
sortSelect.addEventListener("change", render);

loadFromStorage();
render();