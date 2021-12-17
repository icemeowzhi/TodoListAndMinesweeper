let todoItems = [];

let finishedItems = [];

function renderTodoItemList(todoItems) {

    let paneEl = document.querySelector("#todolist-content > .list-pane");
    paneEl.innerHTML = "";

    let finishCount = 0;

    for (let i=0; i < todoItems.length; i++ ) {
        let item = todoItems[i];
        let itemDiv = document.createElement("div");
        itemDiv.className = "todo-item";
        itemDiv.setAttribute("id",`todo-item : ${i}`)

        let inputEl = document.createElement("input");
        inputEl.type = "checkbox";

        let titleEl = document.createElement("div");
        titleEl.className = "title";

        let importanceEl = document.createElement("div");
        importanceEl.className = "important-flag"
        importanceEl.innerText = "!";

        if (item.isImportance) {
            importanceEl.classList.add("open");
            itemDiv.classList.add("important");
        }

        importanceEl.addEventListener("click", () => {
            console.log("click: ", item);
            if (item.isImportance) {
                item.isImportance = false;
                todoItems.sort(compareTodoItem);

            } else {
                item.isImportance = true;
                todoItems.sort(compareTodoItem);
            }

            renderTodoItemList(todoItems);
        });

        if (item.isFinished){
            itemDiv.classList.add("finished");
            inputEl.checked = true;
            finishCount++;
        }

        inputEl.addEventListener("change", () => {
            /*
            finishedItems.push(item);
            todoItems.splice(i, 1);
            console.log("finished:", i, todoItems, finishedItems );
             */
            item.isFinished = inputEl.checked;
            todoItems.sort(compareTodoItem);
            renderTodoItemList(todoItems);

        });

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delBtn";
        deleteBtn.innerText = "X";
        deleteBtn.addEventListener("click",()=>{
            todoItems.splice(i,1);
            todoItems.sort(compareTodoItem);
            renderTodoItemList(todoItems);
        });

        titleEl.innerText = item.title;

        itemDiv.append(inputEl);
        itemDiv.append(titleEl);
        itemDiv.append(importanceEl);
        itemDiv.append(deleteBtn);
        
        paneEl.append(itemDiv);
    }

    let todoCount = document.createElement("div");
    todoCount.className = "todo-count";
    todoCount.innerText = `共有${todoItems.length}个项目，${finishCount}项已完成，${todoItems.length-finishCount}项未完成。`;

    paneEl.append(todoCount);
}

function renderFinishedItemList(todoItems) {

    let paneEl = document.querySelector("#todolist-content > .list-pane");
    paneEl.innerHTML = "";

    let finishedItems = [];

    for (let i=0; i<todoItems.length; i++){
        let item = todoItems[i];
        if (item.isFinished){
            finishedItems.push(item);
        }
    }

    for (let i=0; i < finishedItems.length; i++ ) {
        let item = finishedItems[i];
        let itemDiv = document.createElement("div");
        itemDiv.className = "todo-item";

        let titleEl = document.createElement("div");
        titleEl.className = "title";

        let importanceEl = document.createElement("div");
        importanceEl.className = "important-flag";
        importanceEl.innerText = "!";

        if (item.isImportance) {
            importanceEl.classList.add("open");
            itemDiv.classList.add("important");
        }

        importanceEl.addEventListener("click", () => {
            console.log("click: ", item);
            item.isImportance = !item.isImportance;
            todoItems.sort(compareTodoItem);
            renderFinishedItemList(todoItems);
        });

        if (item.isFinished){
            itemDiv.classList.add("finished");
        }

        titleEl.innerText = item.title;

        itemDiv.append(titleEl);
        itemDiv.append(importanceEl);

        paneEl.append(itemDiv);
    }

}


function renderInputPane(todoItems) {
    let inputPaneEl = document.querySelector("#todolist-content > .input-pane");

    let addBtnEl = inputPaneEl.querySelector("#add-btn");
    let hisBtnEl = inputPaneEl.querySelector("#his-btn");
    let saveBtnEl = inputPaneEl.querySelector("#save-btn");
    let loadBtnEl = inputPaneEl.querySelector("#load-btn");

    addBtnEl.addEventListener("click", ()=>{
        let inputEl = inputPaneEl.querySelector("input");

        todoItems.push({
            title: inputEl.value,
            isFinished: false,
            isImportance: false, 
        });
        
        console.log("add a item: ", inputEl.value);
        inputEl.value = "";
        todoItems.sort(compareTodoItem)
        if (hisBtnEl.classList.contains("open")) {
            hisBtnEl.classList.remove("open");
        }
        renderTodoItemList(todoItems);
    });

    hisBtnEl.addEventListener("click", ()=>{
        if (hisBtnEl.classList.contains("open")) {
            hisBtnEl.classList.remove("open");
            renderTodoItemList(todoItems);
        } else {
            hisBtnEl.classList.add("open");
            renderFinishedItemList(todoItems);
        }
    });

    saveBtnEl.addEventListener("click",()=>{
        let date = new Date();
        let rawData = JSON.stringify(todoItems,null,4);
        let file = new File([rawData],`Todo-List-${date}.json`);
        let url = window.URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download = `Todo-List-${date}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    })

    loadBtnEl.addEventListener("click",()=>{
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.multiple = false;
        input.addEventListener("change",()=>{
            let file = input.files[0];
            file.text().then(
                result => {
                    let newObj =  JSON.parse(result);
                    if (newObj){
                        let legal = true;
                        for (let i=0; i < newObj.length; i++ ){
                            if ((newObj[i].title == null)||(newObj[i].isImportance == null)||( newObj[i].isFinished == null)){
                                legal = false;
                            }
                        }
                        if (legal){
                            todoItems = newObj;
                            renderTodoItemList(todoItems);
                        }else {
                            alert("错误：非法的Json格式。");
                        }
                    }
                },
                error => alert(error)
            );
        })
        input.click();
    })

}

function compareTodoItem(a,b){
    if ((a.isFinished && b.isFinished)||(!a.isFinished && !b.isFinished)){
        return  compareImportance(a,b);
    }else if (a.isFinished){
        return 1;
    }else if (b.isFinished){
        return -1;
    }
    return 0;
}

function compareImportance(a,b){
    if((a.isImportance && b.isImportance) || (!a.isImportance && !b.isImportance)){
        return 0;
    }else if (a.isImportance){
        return -1;
    }else if (b.isImportance){
        return 1;
    }
    return 0;
}

renderInputPane(todoItems, finishedItems);
renderTodoItemList(todoItems, finishedItems);