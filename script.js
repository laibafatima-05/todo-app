const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskError = document.getElementById("taskError");
const undoContainer = document.getElementById("undoContainer");

addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        taskError.textContent = "Task is required";
        return;
    }

     taskError.textContent = "";

    const li = document.createElement("li");

    li.textContent = task;

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete"

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);


    taskList.appendChild(li);

    completeBtn.addEventListener("click", function () {
    if (completeBtn.textContent === "Complete") {
    li.style.color = "green";
    li.style.fontWeight = "bold";
    completeBtn.textContent = "Completed";
}
 else {
        li.style.color = "black";
        li.style.fontWeight = "normal";
        completeBtn.textContent = "Complete";
    }

});

    deleteBtn.addEventListener("click", function () {
    li.remove();

    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoContainer.appendChild(undoBtn);

    undoBtn.addEventListener("click", function () {
        taskList.appendChild(li);
        undoBtn.remove();
    });
});

    taskInput.value = "";
});
taskInput.addEventListener("input", function () {

    if (taskInput.value.trim() !== "") {
        taskError.textContent = "";
    }

});
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});