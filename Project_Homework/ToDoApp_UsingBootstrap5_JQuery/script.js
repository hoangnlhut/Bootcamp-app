$(document).ready(function () {
    const ACTION_IN_ID = {
        DELETE_DONE : 'deleteDone',
        TO_DONE : 'toDone',
        DELETE_TO_DO : "deleteToDo",
    }

    const toDoList = JSON.parse(localStorage.getItem("dataToDoList")) || [];
    const doneList = JSON.parse(localStorage.getItem("dataDoneList")) || [];

    if (toDoList.length || doneList.length) {
        printScreenWithAllData();
    }

    function createId() {
        return Math.floor(Math.random() * 1000);
    }

    function createTask(name) {
        return {
            id: createId(),
            name: name
        };
    }

    function validateTask(task){
        if(!task)
        {
            alert("Not found task");
            return false;
        }
        return true;
    }

    function printScreenWithAllData(){
        toDoList.forEach((item) => {
            addNewTaskOnUI(item, "toDoTask");
        });

        doneList.forEach((item) => {
            addNewTaskOnUI(item, "doneTask", false);
        });
    }

     //add new task into toDoList
    function addNewTaskOnUI(task, whereToAdd, isToDoTask = true){
        let itemFound = null;
        let toDoneButton = null;
        let deleteToDoButton = null;
        let deleteDoneButton = null;
        let appendContent = null;

        if(isToDoTask)
        {
            toDoneButton = $(`<button type="button" class="btn btn-success"><i class="bi bi-check2-all"></i></button>`).click(function(){
                const parent = $(this).parent()?.parent();
                const getValueOfParent = parent.prop("id");

                itemFound = toDoList.find(item => item.id === Number(getValueOfParent));
                changeToDoneTask(itemFound);
            });

            deleteToDoButton = $(`<button type="button" class="btn btn-danger"><i class="bi bi-trash3"></i></button>`).click(function(){
                const parent = $(this).parent().parent();
                const getValueOfParent = parent.prop("id");

                itemFound = toDoList.find(item => item.id === Number(getValueOfParent));
                deleteTask(itemFound, 1);
            });
            
            let divContain2Button = $(`<div class="col-md-4 d-grid gap-2 d-md-block"></div>`).append(toDoneButton, deleteToDoButton);

            appendContent = $(`<div class="row mb-2" id="${task.id}"></div>`).append(`<div class="col-md-8">${task.name}</div>`, divContain2Button);
        }
        else
        {
            deleteDoneButton = $(`<button type="button" class="btn btn-danger"><i class="bi bi-trash3"></i></button>`).click(function(){
                const parent = $(this).parent()?.parent();
                const getValueOfParent = parent.prop("id");

                itemFound = doneList.find(task => task.id === Number(getValueOfParent));
                deleteTask(itemFound, 2);
            }); 

            let divContainButton = $(`<div class="col-md-4 d-grid gap-2 d-md-block"></div>`).append(deleteDoneButton);

            appendContent = $(`<div class="row mb-2" id="${task.id}"></div>`).append(`<div class="col-md-8">${task.name}</div>`, divContainButton) ;
        }
      
        $(`#${whereToAdd}`).append(appendContent);
    }

    //Change From To-Do to Done Task
    function changeToDoneTask(task){
        if(!validateTask(task)) return;

        //remove from toDoTask 
        removeItemInTasks(task, 1);
        //add to DoneTask
        addItemToTasks(task, 2);
        
        alert(`row ${task.name} has just change to Done`);
    }
    //End of Change From To-Do to Done Task

    // Removal Task in To-Do Tasks / Done Tasks
    function deleteTask(task, typeOfTask){
        if(!validateTask(task)) return;
    
        removeItemInTasks(task, typeOfTask);
        alert(`${task.name} has been deleted.`);
    }

    // remove in each array and then update it in local storage and remove in UI
    function removeItemInTasks(task, typeOfTask) 
    {
        if( typeOfTask === 1)  // To-Do Task Action
        {
            const indexToRemove = toDoList.findIndex(item => item.id === task.id);
            if (indexToRemove !== -1) {
                toDoList.splice(indexToRemove, 1);
                localStorage.setItem("dataToDoList", JSON.stringify(toDoList));
            }
            else{
                alert("Can't not found task");
            }
        }
        else // Done Task Action
        {
            const indexToRemove = doneList.findIndex(item => item.id === task.id);
            if (indexToRemove !== -1) {
                doneList.splice(indexToRemove, 1);
                localStorage.setItem("dataDoneList", JSON.stringify(doneList));
            }
            else{
                alert("Can't not found task");
            }
        }

        $(`#${task.id}`).remove();
    }
    //End of Removal Task

    // Add Item To Approriate Task
    function addItemToTasks(item, typeOfTask)
    {
       if( typeOfTask === 1)  // To-Do Task Action
        {
            toDoList.push(item);
            localStorage.setItem("dataToDoList", JSON.stringify(toDoList));
            addNewTaskOnUI(item, "toDoTask");
        }
       else  // Done Task Action
        {
            doneList.push(item);
            localStorage.setItem("dataDoneList", JSON.stringify(doneList));
            addNewTaskOnUI(item, "doneTask", false);
        }
    }

    //End of Add Item To Approriate Task

     // add task to todo list
    $("form").submit(function (event) {
        event.preventDefault();
        
        const item = createTask( $("#floatingInput").val());
        
        addItemToTasks(item, 1);

        $("#floatingInput").val("");

    });

   
});



