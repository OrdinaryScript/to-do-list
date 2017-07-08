// Main JSON Object
var json;
var newItemMode = false;
var newItemModeText = `<strong class='visible-md visible-lg'>Press <span class="label label-default">Enter</span> to save or <span class="label label-default">Esc</span> to cancel</strong>`;
var newItemModeHtml = document.getElementById("newTaskP").innerHTML; // Save html for after adding new task
var viewMode = "to-do";
// Load data
if(localStorage.getItem("data") === null){
    json = {};
    var items = [];
    json.items = items;
} else {
    json = JSON.parse(localStorage.getItem("data"));
    //console.log(JSON.stringify(json));
    populateHtml();
}

function saveData(){
    var stringJson = JSON.stringify(json);
    localStorage.setItem("data", stringJson);
}

function populateHtml(){
    //$("#content").empty();
    $("#content").html("");
    $("#contentCompleted").html("");

    var i = json.items;
    for(var c in i){
        if(i[c].completed == false) {
            var row = `
                <tr id="item${i[c].id}">
                    <td><input type="checkbox" onclick="checkboxChangeState(${i[c].id})"></td>
                    <td ondblclick="editExistingItem(${i[c].id})">${i[c].text}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="glyphicon glyphicon-cog" aria-hidden="false"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a onclick="editExistingItem(${i[c].id})"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></li>
                                <li><a onclick="deleteItem(${i[c].id})"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
            //console.log(i[c].id);
            //console.log(i[c].text);
            $("#content").append(row);
        } else {
            var row = `
                <tr id="item${i[c].id}">
                    <td><input type="checkbox" onclick="checkboxChangeState(${i[c].id})" checked></td>
                    <td ondblclick="editExistingItem(${i[c].id})">${i[c].text}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="glyphicon glyphicon-cog" aria-hidden="false"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a onclick="editExistingItem(${i[c].id})"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</a></li>
                                <li><a onclick="deleteItem(${i[c].id})"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
            //console.log(i[c].id);
            //console.log(i[c].text);
            $("#contentCompleted").append(row);
        }
    }
}

function newItem(){
    newItemMode = true;
    $("#newTaskP").html(newItemModeText);

    // Add a new item row
    var newItemRow = `
                <tr id="editModeTr">
                    <td></td>
                    <td colspan="2">

                      <div class="input-group">
                        <input id="editModeInput" type="text" class="form-control" placeholder="Task">
                        <div id='addItem' class="input-group-addon">
                          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </div>
                        <div id='cancelItem' class="input-group-addon">
                          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </div>
                      </div>
                    </td>
                </tr>
        `;
    $("#content").prepend(newItemRow);
    $("#editModeInput").focus();
}

function saveNewItem(){
    json.items.push({"id":Date.now(),"text":document.getElementById("editModeInput").value,"completed":false});
    saveData();
    populateHtml();
}

function editExistingItem(id){
    var item = "#item" + id;
    /*var input = `<input type="text" value="${$(item + " td:nth-child(2)").html()}" class="form-control">`;
     $(item + " td:nth-child(2)").html(input);*/

    $('#editModal').modal('toggle');
    $('#modalInput').val($(item + " td:nth-child(2)").html());
    $('#modalSave').attr("onclick", "saveChangesToItem(" + id + ")");
    $('#modalInput').focus();
}

function saveChangesToItem(id){
    var i = json.items;
    var tmp = [];
    for(var c in i){
        if(i[c].id == id){
            var text = $('#modalInput').val();
            tmp.push({"id":i[c].id,"text":text,"completed":i[c].completed});
        } else {
            tmp.push({"id":i[c].id,"text":i[c].text,"completed":i[c].completed});
        }
    }
    json.items = tmp;
    saveData();
    populateHtml();
    $('#editModal').modal('toggle');
}

function deleteItem(id){
    var i = json.items;
    var tmp = [];
    for(var c in i){
        if(i[c].id !== id){
            tmp.push({"id":i[c].id,"text":i[c].text,"completed":i[c].completed});
        }
    }
    json.items = tmp;
    saveData();
    populateHtml();
}

function deleteAllCompletedTasks(){
    var i = json.items;
    var tmp = [];
    for(var c in i){
        if(i[c].completed == false){
            tmp.push({"id":i[c].id,"text":i[c].text,"completed":i[c].completed});
        }
    }
    json.items = tmp;
    saveData();
    populateHtml();
    $('#confirmDeleteModal').modal('toggle');
}

// Not in use, let Bootstrap handle all the tab switching
function changeView(){
    if(viewMode === "to-do"){
        // Change to completed tasks
        $("#content").css("display","none");
        $("#contentCompleted").css("display","");
        $("#title").html("Completed Tasks");
        viewMode = "completed";
    } else {
        // Change back to to-do tasks
        $("#content").css("display","");
        $("#contentCompleted").css("display","none");
        $("#title").html("To-Do Tasks");
        viewMode = "to-do";
    }
}

function checkboxChangeState(id) {
    var i = json.items;
    var tmp = [];
    for(var c in i){
        if(i[c].id == id){
//                if(i[c].completed){
//                    // Mark as non completed
//                    tmp.push({"id":i[c].id,"text":text,"completed":false});
//                } else {
//                    // Mark as completed
//                    tmp.push({"id":i[c].id,"text":text,"completed":true});
//                }
            // Change completed to opposite value
            tmp.push({"id":i[c].id,"text":i[c].text,"completed":!(i[c].completed)});
        } else {
            tmp.push({"id":i[c].id,"text":i[c].text,"completed":i[c].completed});
        }
    }
    json.items = tmp;
    saveData();
    populateHtml();
}

// Key press listener
$(document).keypress(function(e) {
    // Check if newItemMode enabled, else no values to grab.
    if(newItemMode) {
        // Enter key
        if (e.which == 13) {
            //Save item
            saveNewItem();
            //Disable edit mode
            $("#newTaskP").html(newItemModeHtml);
            newItemMode = false;
            $("#editModeTr").remove();
        }
    }
});

// Key up listener (Esc doesn't seem to work properly on keyPress
$(document).keyup(function(e) {
    // Check if newItemMode enabled, else no values to grab.
    if(newItemMode) {
        // Esc key
        if (e.keyCode == 27) {
            $("#newTaskP").html(newItemModeHtml);
            newItemMode = false;
            $("#editModeTr").remove();
        }
    }
});

// Add listener to the edit task text field so that when Enter
// is pressed, it gets saved instead of adding a new line
$('#modalInput').keypress(function(e){
    if(e.keyCode==13)
        $('#modalSave').click();
});

// Shortcut key listener
$(document).keypress(function (e) {
    // a || n || A || N
    if (e.keyCode == 97 || e.keyCode == 110 || e.keyCode == 65 || e.keyCode == 78) {
        // In case user is in Completed tab
        if($('.nav-tabs .active').text() == "Completed") {
            $('#tabs a[href="#tabToDo"]').tab('show');
            // .focus must be delayed till after fade
            setTimeout(function () {
                $("#editModeInput").focus();
            }, 180);
        }
        if(!newItemMode) {
            e.preventDefault(); // To avoid having the letter pressed put into the input field
            newItem();
            newItemMode = true;
        }
    }
});

$(document).on('click touchend', '#addItem', function(){
    saveNewItem();
    $("#newTaskP").html(newItemModeHtml);
    newItemMode = false;
});
$(document).on('click touchend', '#cancelItem', function(){
    $("#newTaskP").html(newItemModeHtml);
    newItemMode = false;
    $("#editModeTr").remove();
});
