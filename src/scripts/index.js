let tasks = [];
const inputField = document.querySelector(".task-input");
const taskList = document.querySelector(".task-list");
const addTaskButton = document.querySelector(".add-task-button");
const loadTasksButton = document.querySelector(".load-button");
const saveTasksButton = document.querySelector(".save-button");
const tasksCounter = document.querySelector(".task-counter");
let edit_id = null;


const getData = async () => {
    const fetched = await fetch("http://localhost:8000/api/task/", {
        method: "GET",
   }) 
   .then(result => result.json())
   .then(json => {return json})
   tasks = fetched
   return tasks
}

const drawCompletedTask = (task) => {
    return `<li class="task-list__item task-list__item_status_completed" >
    <p class="task-list__text">${task.text}</p>
    <div class="task-list__flag">
        <span class="material-symbols-outlined" onclick="crossTask('${task.id}')">
            check_circle
        </span>
    </div>
    <div class="task-list__edit-button">
        <span class="material-symbols-outlined" onclick="editTask('${task.id}')">
            border_color
        </span>
    </div>
    <div class="task-list__delete-button">
        <span class="material-symbols-outlined" onclick="removeTask('${task.id}')">
            delete
        </span>
    </div>
</li>`;
}

const drawActiveTask = (task) => {
    return `<li class="task-list__item">
    <p class="task-list__text">${task.text}</p>
    <div class="task-list__flag">
        <span class="material-symbols-outlined" onclick="crossTask('${task.id}')">
            check_circle
        </span>
    </div>
    <div class="task-list__edit-button">
        <span class="material-symbols-outlined" onclick="editTask('${task.id}')">
            border_color
        </span>
    </div>
    <div class="task-list__delete-button">
        <span class="material-symbols-outlined" onclick="removeTask('${task.id}')">
            delete
        </span>
    </div>
</li>`;
}

const showTasks = async() => {
    let listInnerText = '';
    let listPlaceholder = document.createElement("p");
    listPlaceholder.classList.add("task-list__placeholder");
    listPlaceholder.innerHTML = "Список пуст";
    tasks = await getData().then(()=> {
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
    }) 
}

const newTaskResponse = (text) => {
    fetch(`http://localhost:8000/api/task/new?text=${text}`, {
            method: "POST",
            body: JSON.stringify({
                "text": text,
            })
        }).then(()=>{
            inputField.value = '';
            showTasks();
        })     
}

const addTask = async(text) => {
    if (inputField.value === '') {
        alert("Добавьте описание к задаче!");
    } else {
        newTaskResponse(text)
    } 
}

const removeTask = async(task_id) => {
    await fetch("http://localhost:8000/api/task/delete/" + task_id, {
            method: "DELETE",
        })
        .then(()=>{
            showTasks();
        })
}

const editResponse = (task_id, text) =>{
    console.log(text)
    fetch(`http://localhost:8000/api/task/edit/${task_id}?text=${text}`, {
        method: "PUT",
        body: JSON.stringify({
                "text": text
            })
    })
    .then(()=> {
        showTasks()
    })
}

const editTask = (task_id) => {
    edit_id = task_id
    fetch(`http://localhost:8000/api/task/${task_id}`, {
        method: "GET"
    })
    .then(result => {
        return result.json()
    })
    .then(json => {
        return json
    }) 
    .then(task => {
        edit_id = task_id
        inputField.value = task.text;
        addTaskButton.innerText = 'Изменить';
    })
}

const crossTask = async(task_id) => { 
    fetch(`http://localhost:8000/api/task/${task_id}`, {
        method: "GET"
    })
    .then(result => {
        return result.json()
    })
    .then(json => {
        return json
    })
    .then(task => {
        fetch(`http://localhost:8000/api/task/${task_id}/status?completed=${!task.completed}` , {
                method: "POST",
                body: JSON.stringify({
                    "completed":  !task.completed
                })
             })
    })
    .then(()=>{
        showTasks()
    })
}

const sortTasksByDate = () => {
    let activeTasks = tasks.filter(task => task.completed);
    let completedTasks = tasks.filter(task => !task.completed)
    activeTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    completedTasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return completedTasks.concat(activeTasks);
}

addTaskButton.addEventListener("click", () => {
    getData()
    .then(() => {
        if (edit_id !== null) {
            editResponse(edit_id, $(".task-input").val())
            edit_id = null;
        } else {
            addTask($(".task-input").val());
        }
        inputField.value = "";
        addTaskButton.innerText = "Добавить";
    })
})

showTasks();
