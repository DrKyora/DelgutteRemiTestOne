class Task {
  #id;
  #name;
  #isCompleted;
  #timer;
  #intervalId;

  constructor(id, name) {
    this.#id = id;
    this.#name = name;
    this.#isCompleted = false;
    this.#timer = 0;
    this.#intervalId = null;
  }

  set id(newId) {
    this.#id = newId;
  }

  get id() {
    return this.#id;
  }

  set name(newName) {
    if (typeof newName === "string" && newName.trim() !== "") {
      this.#name = newName.trim();
    } else {
      throw new Error("Le nom doit être une chaîne non vide.");
    }
  }

  get name() {
    return this.#name;
  }

  set isCompleted(status) {
    this.#isCompleted = status;
  }

  get isCompleted() {
    return this.#isCompleted;
  }

  set timer(seconds) {
    this.#timer = seconds;
  }

  get timer() {
    return this.#timer;
  }

  set intervalId(id) {
    this.#intervalId = id;
  }

  get intervalId() {
    return this.#intervalId;
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      clearInterval(this.intervalId);
    } else {
      this.startTimer();
    }
  }
}
export { Task };
