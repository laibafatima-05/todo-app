let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");
let errorMessage = document.getElementById("errorMessage");
let searchInput = document.getElementById("searchInput");
let totalCount = document.getElementById("totalCount");
let pendingCount = document.getElementById("pendingCount");
let completedCount = document.getElementById("completedCount");
let statusDropdown = document.getElementById("statusDropdown");

let currentFilter = "all";
let editingTaskId = null;

addBtn.addEventListener("click", function () {

    let taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "Task is required.";
        return;
    }

    errorMessage.textContent = "";

    if (editingTaskId !== null) {

        let task = tasks.find(function (task) {
            return task.id === editingTaskId;
        });

        task.title = taskText;

        saveTasks();

        editingTaskId = null;
        taskInput.value = "";
        addBtn.textContent = "Add Task";

        displayTasks();

        return;
    }
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

        taskDiv.className ="task-item d-flex justify-content-between align-items-center flex-wrap gap-2";

        taskDiv.innerHTML = `
            <span class="task-title ${task.completed ? "completed" : ""}" data-id="${task.id}">
                ${task.title}
            </span>
      <div class="task-buttons">
               <button class="btn btn-sm ${task.completed ? "btn-warning" : "btn-success"}"
               onclick="toggleTask(${task.id})"> ${task.completed ? "Pending" : "Complete"}
               </button>

                <button class="btn btn-sm edit-btn" onclick="editTask(${task.id})">
                 <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button class="btn btn-sm delete-btn" onclick="deleteTask(${task.id})">
                 <i class="fa-solid fa-trash"></i>
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
     let confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}
}
function editTask(id) {

    let task = tasks.find(function (task) {
        return task.id === id;
    });

    taskInput.value = task.title;

    editingTaskId = id;

    addBtn.textContent = "Save Changes";

    taskInput.focus();
}
searchInput.addEventListener("input", function () {
    displayTasks();
});

let filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.getAttribute("data-filter");

        statusDropdown.textContent = button.textContent;
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
window.addEventListener("load", function () {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    displayTasks();
});