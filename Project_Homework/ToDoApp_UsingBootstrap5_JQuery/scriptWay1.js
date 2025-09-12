$(document).ready(function () {
    const ACTION_IN_ID = {
        DELETE_DONE : 'deleteDone',
        TO_DONE : 'toDone',
        DELETE_TO_DO : "deleteToDo",
    }

    // const toDoList= [
    //     {
    //         id: 100,
    //         name: "hoang"
    //     },
    //     {
    //         id: 101,
    //         name: "hoang 101"
    //     },
    // ];
    // const doneList= [
    //     {
    //         id: 10,
    //         name: "hoang done"
    //     },
    //     {
    //         id: 9,
    //         name: "trang done"
    //     }
    // ];

  const toDoList = JSON.parse(localStorage.getItem("dataToDoList")) || [];
  const doneList = JSON.parse(localStorage.getItem("dataDoneList")) || [];

    if (toDoList.length || doneList.length) {
        printScreenWithAllData();
        enableEventInNewTask();
    }


    //display all tasks in the beginning
    function printScreenWithAllData(){
        //display all tasks of To-do Task
        toDoList.forEach((item) => {
            addNewTaskOnUI(item, "toDoTask");
        });

        //display all tasks of Done Task
        doneList.forEach((item) => {
            addNewTaskOnUI(item, "doneTask", false);
        });
    }

    function enableEventInNewTask(){
        $("#toDoTask button").click(function(event){
            const input = $(this);
            processIdValueOfButtonElement(input?.attr( "id" ));
        })

        $("#doneTask button").click(function(event){
            const input = $(this);
            processIdValueOfButtonElement(input?.attr( "id" ));
        })
    }

    
    function processIdValueOfButtonElement(idStr){
        //0. process id value break to 2 value of action and id
        const valueArr = idStr.split('-');

        if(valueArr.length != 2) 
        {
            alert("Id of Value has big problem");
        }
        else{
            let actionInId =  valueArr[0];
            let idValue = Number(valueArr[1]);
            let itemFound = null;

            //2. check action: if action is to done -> changeToDone function , else delete -> delete function 
            if(actionInId === ACTION_IN_ID.DELETE_DONE) //get task in Done Tasks list
            {
                itemFound = doneList.find(task => task.id === idValue);
                deleteTask(itemFound, 2);
            }
            // action is doDone or deletToDo -> et task in To-Do Tasks list
            else if(actionInId === ACTION_IN_ID.TO_DONE || actionInId === ACTION_IN_ID.DELETE_TO_DO)
            {
                itemFound = toDoList.find(task => task.id === idValue);

                if(actionInId === ACTION_IN_ID.TO_DONE)
                {
                    changeToDoneTask(itemFound);
                }
                //actionInId === 'deleteToDo'
                else{
                    deleteTask(itemFound, 1);
                }
            }
            else{
                alert("Do nothing");
            }
        }
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

    //add new task into toDoList
    function addNewTaskOnUI(task, whereToAdd, isToDoTask = true){
        let appendContent = isToDoTask ? `<div class="row mb-2" id="${task.id}">
            <div class="col-md-8">
                ${task.name}
            </div>
            <div class="col-md-4">
                <div class="d-grid gap-2 d-md-block">
                <button type="button" class="btn btn-success" id="toDone-${task.id}">
                    <i class="bi bi-check2-all"></i>
                </button>
                <button type="button" class="btn btn-danger" id="deleteToDo-${task.id}">
                    <i class="bi bi-trash3"></i>
                </button>
                </div>
            </div>
        </div>` : `<div class="row mb-2" id="${task.id}">
            <div class="col-md-8">
                ${task.name}
            </div>
            <div class="col-md-4">
                <div class="d-grid gap-2 d-md-block">
                <button type="button" class="btn btn-danger" id="deleteDone-${task.id}">
                    <i class="bi bi-trash3"></i>
                </button>
                </div>
            </div>
        </div>`

        $(`#${whereToAdd}`).append(appendContent);
    }
    
    function removeItemInTasks(task, typeOfTask) {
            let itemDeleted = null;
            let arrLatest = null;
            if (typeOfTask === 1) // 1: delete in TodoTask
            {
                // Find the index of the object to remove
                const indexToRemove = toDoList.findIndex(item => item.id === task.id);

                // Check if the object was found before removing
                if (indexToRemove !== -1) {
                    // Use splice() to remove one element at the found index
                  itemDeleted =  toDoList.splice(indexToRemove, 1);
                  arrLatest = toDoList;
                }
            }

            //2: delete in DoneTask
            else {
                // Find the index of the object to remove
                const indexToRemove = doneList.findIndex(item => item.id === task.id);

                // Check if the object was found before removing
                if (indexToRemove !== -1) {
                    // Use splice() to remove one element at the found index
                  itemDeleted =  doneList.splice(indexToRemove, 1);
                  arrLatest = doneList;
                }
            }

            return {deleted: itemDeleted[0], arrLatestResult:  arrLatest} ;
        }

    function changeToDoneTask(task){
        if(!validateTask(task)) return;

        //remove from toDoTask 
        const toDoItemChangeToDone = removeItemInTasks(task, 1);
        localStorage.setItem("dataToDoList", JSON.stringify(toDoItemChangeToDone.arrLatestResult));
        //remove todoTask on UI
        $(`#${toDoItemChangeToDone.deleted.id}`).remove();

        //add to DoneTask
        doneList.push(toDoItemChangeToDone.deleted);
        localStorage.setItem("dataDoneList", JSON.stringify(doneList));
        //add doneTask item on UI
        addNewTaskOnUI(toDoItemChangeToDone.deleted, "doneTask", false);

        alert(`row ${toDoItemChangeToDone.deleted.name} has just change to Done`);
        enableEventInNewTask();

    }

    function deleteTask(task, typeOfTask){
        if(!validateTask(task)) return;
    
        //remove in array
        const removeItem = removeItemInTasks(task, typeOfTask);

        typeOfTask === 1 ? localStorage.setItem("dataToDoList", JSON.stringify(removeItem.arrLatestResult)) : localStorage.setItem("dataDoneList", JSON.stringify(removeItem.arrLatestResult)); ;

        //remove childs and elements itself
        $(`#${task.id}`).remove();
        alert(`${task.name} has been deleted.`);
        enableEventInNewTask();
    }
    

   // add task to todo list
    $("form").submit(function (event) {
        event.preventDefault();
        
        const item = createTask( $("#floatingInput").val());
        toDoList.push(item);
        localStorage.setItem("dataToDoList", JSON.stringify(toDoList));
        addNewTaskOnUI(item, "toDoTask");
        $("#floatingInput").val("");

        enableEventInNewTask();
    });
});



