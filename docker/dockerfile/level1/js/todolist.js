;(function (){
    'use strict';

    // store DOM into variables
    let inputItem = document.querySelector("#item-input")
    let todoAddForm = document.querySelector("#todo-add")
    let ul = document.querySelector("#todo-list")
    let lis = ul.getElementsByTagName("li")

    let arrTasks = getSavedData()

    function getSavedData () {
        
        let tasksData = localStorage.getItem("tasks")
        tasksData = JSON.parse(tasksData)

        return tasksData && tasksData.length ? tasksData : [
            {
                name: "Task 1",
                creatAt: Date.now(),
                completed: true
            },
            {
                name: "Task 2",
                creatAt: Date.now(),
                completed: false
            }
        ]

    }


    function setNewData () {
        localStorage.setItem("tasks", JSON.stringify(arrTasks))
    }


    function generateLi (obj) {
        
        let li = document.createElement("li")
        let p = document.createElement("p")
        let checkButton = document.createElement("button")
        let editButton = document.createElement("i")
        let deleteButton = document.createElement("i")

        let containerEdit = document.createElement("div")
        let containerInputEdit = document.createElement("input")
        let containerEditButton = document.createElement("button")
        let containerCancelButton = document.createElement("button")

        li.className = "todo-item"

        checkButton.className = "button-check"
        checkButton.innerHTML = `
        <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton")
        li.appendChild(checkButton)
        
        p.className = "task-name"
        p.textContent = obj.name
        li.appendChild(p)

        editButton.className = "fas fa-edit"
        editButton.setAttribute("data-action", "editButton")
        li.appendChild(editButton)

        containerEdit.className = "editContainer"
        containerInputEdit.setAttribute("type", "text")
        containerInputEdit.className = "editInput"
        containerInputEdit.value = obj.name
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Edit"
        containerEditButton.setAttribute("data-action", "containerEditButton")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "Cancel"
        containerCancelButton.setAttribute("data-action", "containerCancelButton")
        containerEdit.appendChild(containerInputEdit)
        containerEdit.appendChild(containerEditButton)
        containerEdit.appendChild(containerCancelButton)
        li.appendChild(containerEdit)

        deleteButton.className = "fas fa-trash-alt"
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(deleteButton)

        // addEventLi(li)
        return li
    };


    function renderTasks () {

        ul.innerHTML = "";
        arrTasks.forEach(task => {
            ul.appendChild(generateLi(task))
        })
        setNewData()
    };


    function addTask (task) {
        
        arrTasks.push({
            name: task,
            creatAt: Date.now(),
            completed: false
        })
        
        renderTasks()
        
    };


    function clickedUl (e) {
        
        let dataAction = e.target.getAttribute("data-action")
        let currentLi = e.target
        
        if (!dataAction) return

        while (currentLi.nodeName !== "LI" ) {
            currentLi = currentLi.parentNode
        }
        
        let currentLiIndex = [...lis].indexOf(currentLi)

        const actions = {
            checkButton: function () {
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed
                
                if(arrTasks[currentLiIndex].completed) {
                    currentLi.querySelector(".fa-check").classList.remove("displayNone")
                }else{
                    currentLi.querySelector(".fa-check").classList.add("displayNone")
                }

                renderTasks()

            },    
                editButton: function () {
                let editContainer = currentLi.querySelector(".editContainer");
                
                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });

                editContainer.style.display = "flex";
            },
            deleteButton: function () {
                arrTasks.splice(currentLiIndex, 1)
                renderTasks()
                // currentLi.remove() *another approach
                // currentLi.parentElement.removeChild(currentLi) *another approach
            },
            containerEditButton: function () {
                let containerValue = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = containerValue
                renderTasks()
            },
            containerCancelButton: function () {
                currentLi.querySelector(".editContainer").removeAttribute("style")
                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            }
        }

        if (actions[dataAction]) {
            actions[dataAction]()
        }
        
    }

    
    todoAddForm.addEventListener("submit", function (e) {
        e.preventDefault()
        addTask(inputItem.value)
        inputItem.value = ""
        inputItem.focus()
    });


    ul.addEventListener("click", clickedUl)
    
    renderTasks()

})()