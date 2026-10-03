let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let errorMessage = document.getElementById("errorMessage");
let searchInput = document.getElementById("searchInput");
let totalCount = document.getElementById("totalCount");
let pendingCount = document.getElementById("pendingCount");
let completedCount = document.getElementById("completedCount");

let currentFilter = "all";

addBtn.addEventListener("click", function () {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "Task is required";
        return;
    }

     errorMessage.textContent = "";

        let task = {
        id: Date.now(),
        title: taskText,
        completed: false
    };

     tasks.push(task);

    saveTasks();

    taskInput.value = "";

    displayTasks();
});
   function displayTasks() {

    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function (task) {

        let matchesSearch = task.title.toLowerCase().includes(searchText);

        let matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });
      if (filteredTasks.length === 0) {
        document.getElementById("emptyMessage").style.display = "block";
    } else {
        document.getElementById("emptyMessage").style.display = "none";
    }
     filteredTasks.forEach(function (task) {

        let taskDiv = document.createElement("div");

        taskDiv.className = "task-item d-flex justify-content-between align-items-center flex-wrap gap-2";

        taskDiv.innerHTML = `
            <span class="task-title ${task.completed ? "completed" : ""}" data-id="${task.id}">
                ${task.title}
            </span>
      <div class="task-buttons">

                <button class="btn btn-sm btn-success" onclick="toggleTask(${task.id})">
                    ${task.completed ? "Pending" : "Complete"}
                </button>

                <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">
                    Edit
                </button>

                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskDiv);
    });
    
    updateCounts();
}
function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}
function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}
function editTask(id) {

    let task = tasks.find(function (task) {
        return task.id === id;
    });
    
    let taskElement = document.querySelector(`.task-title[data-id="${id}"]`);

    taskElement.contentEditable = "true";
    taskElement.focus();

     taskElement.addEventListener("blur", function () {

    let newTitle =  taskElement.textContent.trim();

    if (newTitle !== "") {

        task.title = newTitle;

        saveTasks();
    }
    
        taskElement.contentEditable = "false";
        displayTasks();
    }, { once: true });
}

searchInput.addEventListener("input", function () {
    displayTasks();
});

let filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.getAttribute("data-filter");

        displayTasks();
    });
});
function updateCounts() {

    let completed = tasks.filter(function (task) {
        return task.completed;
    });

    let pending = tasks.filter(function (task) {
        return !task.completed;
    });

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed.length;
    pendingCount.textContent = pending.length;
}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
