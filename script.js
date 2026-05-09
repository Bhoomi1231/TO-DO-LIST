let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    if (task.done) li.classList.add("completed");

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">X</button>
    `;

    list.appendChild(li);
  });
}

function addTask() {
  let input = document.getElementById("taskInput");

  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false,
    completedDate: null
  });

  input.value = "";

  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;

  if (tasks[index].done) {
    tasks[index].completedDate = new Date().toISOString();
  } else {
    tasks[index].completedDate = null;
  }

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function exportToExcel() {
  if (tasks.length === 0) {
    alert("No tasks to export!");
    return;
  }

  const data = tasks.map(task => ({
    Task: task.text,
    Status: task.done ? "Completed" : "Pending",
    Date: task.completedDate
      ? new Date(task.completedDate).toLocaleString()
      : ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  XLSX.writeFile(workbook, "Task_Report.xlsx");
}

renderTasks();