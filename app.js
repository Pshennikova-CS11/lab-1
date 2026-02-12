const state = {
    resources: [],
    nextId: 1
};

const form = document.getElementById("resourceForm");
const tbody = document.getElementById("resourcesTableBody");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");

function readForm() {
    return {
        title: document.getElementById("title").value.trim(),
        url: document.getElementById("url").value.trim(),
        type: document.getElementById("type").value,
        description: document.getElementById("description").value.trim(),
        author: document.getElementById("author").value.trim()
    };
}

function isFormValid(data) {
    return (
        data.title &&
        data.author &&
        data.description &&
        data.type &&
        isValidURL(data.url)
    );
}

function validate(data) {
    let isValid = true;
    clearErrors();

    if (!data.title) {
        showError("title", "titleError", "Назва обов'язкова");
        isValid = false;
    }

    if (!data.url || !isValidURL(data.url)) {
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

    if (!data.author) {
        showError("author", "authorError", "Автор обов'язковий");
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

function updateSubmitState() {
    const data = readForm();
    submitBtn.disabled = !isFormValid(data);
}

function addItem(data) {
    state.resources.push({
        id: state.nextId++,
        ...data
    });
}

function deleteItem(id) {
    state.resources = state.resources.filter(r => r.id !== id);
}

function render() {
    tbody.innerHTML = state.resources.map((r, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${r.title}</td>
          <td>${r.author}</td>
          <td>${r.type}</td>
          <td><a href="${r.url}" target="_blank">Посилання</a></td>
          <td>
            <button type="button" data-id="${r.id}" class="delete-btn">
              Видалити
            </button>
          </td>
        </tr>
    `).join("");
}

submitBtn.disabled = true;

// Перевірка при введенні
form.addEventListener("input", updateSubmitState);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = readForm();

    if (!validate(data)) return;

    addItem(data);
    render();
    form.reset();
    submitBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    submitBtn.disabled = true;
});

tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        deleteItem(id);
        render();
    }
});
