const todoForm = document.querySelector("#todo_form");
const todosList = document.querySelector("#todos");
const totalTasks = document.querySelector("#total_tasks");
const reaminTaks = document.querySelector("#remain_tasks");
const completedTasks = document.querySelector("#completed_tasks");
const input = document.querySelector("#todo_form input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // fetching the tasks that are int he local storage for every time loading the page..

if (localStorage.getItem("tasks")) {
  //create a task for every tassk that are available in the local storage after loading the page
  tasks.map((task) => {
    createTask(task);
  });
}

function todoFormSubmit(e) {
  e.preventDefault();
  const inputValue = input.value;

  if (inputValue == "") return;
  //creating an object record(document) according to the input value (Schema for the object)
  const task = {
    id: new Date().getTime(),
    TaskName: inputValue,
    isCompleted: false,
  };

  console.log(task);

  tasks.push(task); // pushing the task to the task array
  localStorage.setItem("tasks", JSON.stringify(tasks)); // setting the tasks to store in the local storage

  createTask(task);

  todoForm.reset();
  input.focus();
}

todoForm.addEventListener("submit", todoFormSubmit);

todosList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("removeTask") ||
    e.target.classList.contains("material-symbols-outlined")
  ) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }
});

todosList.addEventListener('input' ,(e) =>{
    const taskId = e.target.closest("li").id;
    updateTask(taskId,e.target);
})

todosList.addEventListener('keydown' ,(e) =>{
    if(e.keyCode === 13){
        e.preventDefault();
        e.target.blur();
    }
})

function createTask(task) {
  const taskElement = document.createElement("li");
  taskElement.setAttribute("id", task.id); //identifying the task uniquely

  if (task.isCompleted) {
    taskElement.classList.add("complete");
  }
  const taskMarkUp = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}" ${
    task.isCompleted ? "checked" : ""
  }/>
        <span ${!task.isCompleted ? "contenteditable" : ""}>${
    task.TaskName
  }</span>
    </div>
    <button title='Remove the '${
      task.TaskName
    }'task' class="removeTask"><span class="material-symbols-outlined" class="removeTask"> close </span></button>`; //actual html code for creating the tasks

  taskElement.innerHTML = taskMarkUp;

  todosList.appendChild(taskElement);

  countTasks();
}

function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTasksArray.length;
  reaminTaks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id != parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}

function updateTask(taskId,el){
    const task = tasks.find((task) => task.id == parseInt(taskId));

    if(el.hasAttribute('contenteditable')) {
        task.TaskName = el.textContent;
    }
    else{
        const nextsib = el.nextElementSibling
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if(task.isCompleted){
            nextsib.removeAttribute('contenteditable');
            parent.classList.add('complete');
        }
        else {
            nextsib.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        }
    }

    localStorage.setItem('tasks' , JSON.stringify(tasks));
    countTasks();
}