document.getElementById("addTask").addEventListener("click", function () {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText !== "") {
    addTask(taskText);
    input.value = "";
  }
});

function addTask(text) {
  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");
  li.className = "task";

  const taskContent = document.createElement("div");
  taskContent.className = "task-text";

  const checkCircle = document.createElement("div");
  checkCircle.className = "check-circle";

  const checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkIcon.setAttribute("viewBox", "0 0 24 24");
  checkIcon.innerHTML = `<path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>`;

  checkCircle.appendChild(checkIcon);

  const span = document.createElement("span");
  span.textContent = text;

  taskContent.appendChild(checkCircle);
  taskContent.appendChild(span);

  const deleteBtn = document.createElement("div");
  deleteBtn.className = "delete";
  deleteBtn.innerHTML = "&times;";

  checkCircle.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  li.appendChild(taskContent);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}
