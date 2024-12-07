import { Task } from "./Task.js";

class TaskManager {
  #tasks;
  #taskId;

  constructor() {
    this.#tasks = [];
    this.#taskId = 0;
  }

  addTask(name) {
    if (!name.trim()) {
      const alertContainer = document.getElementById("alert-container");
      const alert = document.createElement("div");
      alert.className = "alert";
      alert.textContent = "Le champ ne peut pas être vide !";
      alertContainer.appendChild(alert);
      setTimeout(() => {
        alert.remove();
      }, 3000);
      return;
    }

    // Vérification de l'unicité de la tâche
    const taskExists = this.#tasks.some(
      // Comparaison insensible à la casse et aux espaces
      (task) =>
        task.name.toLowerCase().replace(/\s+/g, "") ===
        name.trim().toLowerCase().replace(/\s+/g, "")
    );
    if (taskExists) {
      const alertContainer = document.getElementById("alert-container");
      const alert = document.createElement("div");
      alert.className = "alert";
      alert.textContent = "Cette tâche existe déjà !";
      alertContainer.appendChild(alert);
      setTimeout(() => {
        alert.remove();
      }, 3000);
      return;
    }

    const task = new Task(this.#taskId++, name);
    task.startTimer();
    this.#tasks.push(task);
    this.renderTasks();
  }

  deleteTask(id) {
    const taskIndex = this.#tasks.findIndex((task) => task.id === id);
    const taskList = document.getElementById("todo-list");
    const listItem = taskList.children[taskIndex];
    listItem.classList.remove("fadeIn");
    listItem.classList.add("fadeOut");

    setTimeout(() => {
      this.#tasks.splice(taskIndex, 1);
      listItem.remove();
    }, 1000);
  }

  toggleTaskCompletion(id) {
    const task = this.#tasks.find((task) => task.id === id);
    if (task) {
      task.toggleCompletion();
      if (task.isCompleted) {
        clearInterval(task.intervalId);
      } else {
        task.startTimer();
      }
    }
    this.renderTasks();
  }

  renderTasks(isNewTask = false) {
    const taskList = document.getElementById("todo-list");
    taskList.innerHTML = "";

    this.#tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.className = "todo-item";

      const taskContent = document.createElement("span");
      if (task.isCompleted) {
        taskContent.textContent = `${task.name} (complétée) ${this.formatTime(task.timer)}`;
      } else {
        taskContent.textContent = task.name;
      }

      // Appliquer le style pour les tâches complétées
      if (task.isCompleted) {
        taskContent.style.textDecoration = "line-through";
        taskContent.style.color = "green";
      }

      // Clic pour basculer l'état
      taskContent.addEventListener("click", () => this.toggleTaskCompletion(task.id));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "delete-btn";
      deleteButton.addEventListener("click", () => this.deleteTask(task.id));

      listItem.appendChild(taskContent);
      listItem.appendChild(deleteButton);
      taskList.appendChild(listItem);

      if (isNewTask) {
        listItem.classList.add("fadeIn");
        setTimeout(() => {
          listItem.classList.remove("fadeIn");
        }, 1000);
      }
      if (!task.isCompleted) {
        setInterval(() => {
          taskContent.textContent = `${task.name} - ${this.formatTime(task.timer)}`;
        }, 1000);
      }
    });
  }
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }
}

// Initialisation des événements
document.addEventListener("DOMContentLoaded", () => {
  const taskManager = new TaskManager();

  document.getElementById("add-btn").addEventListener("click", () => {
    const taskInput = document.getElementById("todo-input");
    taskManager.addTask(taskInput.value);
    taskManager.renderTasks(true);
    taskInput.value = "";
  });
  // Ajouter une tâche via la touche "Entrée" (je ne connaissé mais j'aime beaucoup)
  document.getElementById("todo-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      taskManager.addTask(event.target.value);
      event.target.value = "";
    }
  });
});
