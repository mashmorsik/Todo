import axios from 'axios';
import { title } from 'process';

const addTaskBtn = document.getElementById('add');
const deskTaskInput = document.getElementById('writeTask');
const toDoWrapper = document.querySelector('.toDoWrapper');
let btnsDelete = []; 

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let toDoItemElems = [];


function Task(id, title, description, completed = false) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
}

const createTemplate = (task, index) => {
    return `
         <div class="toDoItem ${task.completed ? 'checked' : ''}">
         <div class="description"><b>${task.title}</b></div>
            <div class="description">${task.description}</div>
            <div class="buttons">
                <input onclick="completeTask${index}" class="btnComplete" type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="btnDelete${index}" id="${task.id}">Delete</button>
    </div>
    </div>
    `
}

// const filterTasks = () => {
//     const activeTasks = tasks.length && tasks.filter(item => item.completed == false);
//     const completedTasks = tasks.length && tasks.filter(item => item.completed == true);
//     tasks = [...activeTasks,...completedTasks];
// }

const fillHtmnlList = () => {
    toDoWrapper.innerHTML = "";
    if (tasks.length > 0) {
        tasks.forEach((item, index) => toDoWrapper.innerHTML += createTemplate(item, index))

        tasks.forEach((item, index) => {
            document.getElementById(item.id).addEventListener("click", () => {
                tasks.splice(index, 1);
                mdelete(item.id);
                fillHtmnlList();
            });
        })

        toDoItemElems = document.querySelectorAll('.toDoItem');
    }
}

fillHtmnlList();

async function mget() {
    const res = await axios.get("https://young-island-64931.herokuapp.com/all")
    console.log(res)
    let newTasks = [];
    for (let prop in res.data) {
        console.log(new Task(prop, res.data[prop].title, res.data[prop].description))
        newTasks.push(new Task(prop, res.data[prop].title, res.data[prop].description))
    }
    tasks = newTasks;
    fillHtmnlList();
}
mget()

async function mdelete(targetId) {
    console.log(targetId)
    const res = await axios.delete("https://young-island-64931.herokuapp.com/delete",
        {
            data: {
                id: Number(targetId),
            }
        }
    )
    mget();
    console.log(res);
}

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        toDoItemElems[index].classList.add('checked');
    } else {
        toDoItemElems[index].classList.remove('checked');
    }
    updateLocal();
    fillHtmnlList();
}

addTaskBtn.addEventListener('click', async function () {
    try {
        const res = await axios.post('https://young-island-64931.herokuapp.com/add',
            {
                title: deskTaskInput.value ? deskTaskInput.value : new Date().getMilliseconds().toString(),
                description: new Date().getMilliseconds().toString(),
            }
        )
        mget();
        deskTaskInput.value = '';
        console.log(res)
    } catch (error) {
        console.error(error)
    }
})

// btnDelete.addEventListener('click', async function () {
//     try {
//         const res = await axios.delete('https://young-island-64931.herokuapp.com/delete',
//             {
//                 id: prop
//             }
//         )
//
//     }
// }) 






// axios.patch('https://young-island-64931.herokuapp.com/update')
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     })