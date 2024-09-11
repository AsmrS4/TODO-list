let tasks = [];
const inputField = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");
const addTaskButton = document.querySelector(".add-task-button");
const saveTasksButton = document.querySelector(".save-button");
const tasksCounter = document.querySelector(".task-counter");
let idCounter = 0;
let edit_id = null;

function addTask() {
    if (inputField.value === '') {
        alert("Добавьте описание к задаче!");
    } else {
        let text = inputField.value;
        tasks.push({
            "id": idCounter++,
            "text": text,
            "completed": false,
            "date": new Date()
        });
    }
    inputField.value = '';
    showTasks();
}

function saveData() {

}

const removeTask = (task_id) => {
    tasks = tasks.filter(task => task.id !== task_id);
    showTasks();
}

const editTask = (task_id) => {
    edit_id = task_id;
    let task = tasks.filter(task => task.id === task_id); 
    inputField.value = task[0].text;
    addTaskButton.innerText = 'Изменить';
}

const crossTask = (task_id) => {
    tasks.map(item => {
        if (item.id == task_id) {
            if (item["completed"]) {
                item["completed"] = false
            } else {
                item["completed"] = true;
            }
        }
    })
    showTasks();
}

const drawCompletedTask = (task) => {
    return `<li class="task-list__item task-list__item_status_completed" >
    <p class="task-list__text">${task.text}</p>
    <div class="task-list__flag">
        <span class="material-symbols-outlined" onclick='crossTask(${task.id})'>
            check_circle
        </span>
    </div>
    <div class="task-list__edit-button">
        <span class="material-symbols-outlined" onclick='editTask(${task.id})'>
            border_color
        </span>
    </div>
    <div class="task-list__delete-button">
        <span class="material-symbols-outlined" onclick='removeTask(${task.id})'>
            delete
        </span>
    </div>
</li>`;
}

const drawActiveTask = (task) => {
    return `<li class="task-list__item">
    <p class="task-list__text">${task.text}</p>
    <div class="task-list__flag">
        <span class="material-symbols-outlined" onclick='crossTask(${task.id})'>
            check_circle
        </span>
    </div>
    <div class="task-list__edit-button">
        <span class="material-symbols-outlined" onclick='editTask(${task.id})'>
            border_color
        </span>
    </div>
    <div class="task-list__delete-button">
        <span class="material-symbols-outlined" onclick='removeTask(${task.id})'>
            delete
        </span>
    </div>
</li>`;
}

const countActiveTasks = () => {
    return tasks.filter(task => !task.completed).length;
}

const sortTasksByDate = () => {
    let activeTasks = tasks.filter(task => task.completed);
    let completedTasks = tasks.filter(task => !task.completed)
    activeTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    completedTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    return completedTasks.concat(activeTasks);
}

function showTasks() {
    let listInnerText = '';
    let listPlaceholder = document.createElement("p");
    listPlaceholder.classList.add("task-list__placeholder");
    listPlaceholder.innerHTML = "Список пуст";
    tasksCounter.innerHTML = countActiveTasks();
    if (tasks.length === 0) {
        taskList.innerHTML = '';
        taskList.classList.add("task-list_empty");
        taskList.append(listPlaceholder);
        return;
    } else {
        taskList.classList.remove("task-list_empty");
        let sortedList = sortTasksByDate();
        sortedList.forEach((task) => {
            listInnerText += (task["completed"]) ? drawCompletedTask(task) : drawActiveTask(task);
        });
        taskList.innerHTML = listInnerText;
    }
}

addTaskButton.addEventListener( "click", ()=>{
    if(edit_id !== null){
        tasks.map(item => {
            if(item.id === edit_id){
                item.text = inputField.value;
            }
        })
        edit_id = null;
    } else {
        addTask();
    }
    inputField.value = "";
    addTaskButton.innerText = "Добавить";
    showTasks();
})

showTasks();
