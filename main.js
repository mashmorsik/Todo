import axios from 'axios';
import { title } from 'process';
 

date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();
document.querySelector('.date').innerHTML = month + "/" + day + "/" + year;

const addTaskBtn = document.getElementById('add');
const deskTaskInput = document.getElementById('writeTask');
const toDoWrapper = document.querySelector('.toDoWrapper');

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
            <div class="buttons">
                <input class="btnComplete" type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="material-icons" id="${task.id}">delete_outline</button> 
                
    </div>
    </div>
    `
}

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

deskTaskInput.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        addTaskBtn.click()
    }
})

