//This would set default data for edit form when button for edit clicked.
function setFormData(Title, DueDate, Priority) {
    var elmnt = document.getElementById("button21");
    elmnt.scrollIntoView();
    document.getElementById("editInput1").defaultValue = Title;
    document.getElementById("editInput2").defaultValue = DueDate;
    document.getElementById("editSelect1").defaultValue = Priority;
  
  }
  
  //Initiates everything inside it on page load 
  $(document).ready(() => {
  
    var dp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var month = dp.getMonth() + 1;
    var day = dp.getDate();
    var output = dp.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
    document.getElementById("exampleFormControlInput2").defaultValue = output;
  
    var reloadComponent = null;
  
    var sortType;
  
    //This would load all tasks
    var refreshTasks = function () {
      $("#accordionExample").empty();
      $.ajax({
        datatype: 'json',
        url: '/api/tasks',
        type: 'get',
  
        success: (data) => {
          var count = 0;
          if (sortType == 1) {
            data.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.due_date) - new Date(a.due_date);
            });
          }
          else if (sortType == 2) {
            data.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.due_date) - new Date(b.due_date);
            });
          }
          else if (sortType == 3) {
            var sortOrder = ['High', 'Medium', 'Low'];   // Declare a array that defines the order of the elements to be sorted.
            data.sort(
              function (a, b) {                              // Pass a function to the sort that takes 2 elements to compare
                if (a.priority == b.priority) {                    // If the elements both have the same `type`,
                  return a.title.localeCompare(b.title); // Compare the elements by `name`.
                } else {                                   // Otherwise,
                  return sortOrder.indexOf(a.priority) - sortOrder.indexOf(b.priority); // Substract indexes, If element `a` comes first in the array, the returned value will be negative, resulting in it being sorted before `b`, and vice versa.
                }
              }
            );
          }
  
          else if (sortType == 4) {
            var sortOrder = ['incomplete', 'complete'];   // Declare a array that defines the order of the elements to be sorted.
            data.sort(
              function (a, b) {                              // Pass a function to the sort that takes 2 elements to compare
                if (a.status == b.status) {                    // If the elements both have the same `type`,
                  return a.title.localeCompare(b.title); // Compare the elements by `name`.
                } else {                                   // Otherwise,
                  return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status); // Substract indexes, If element `a` comes first in the array, the returned value will be negative, resulting in it being sorted before `b`, and vice versa.
                }
              }
            );
          }
  
          data.forEach(element => {
            var tempo = element.title;
            var i = 0, strLength = element.title.length;
            for(i; i < strLength; i++) {
            tempo = tempo.replace(" ", "_");
            }
           
            $('#accordionExample').append(
  
              '<div class="card" style="text-align: center;">' +
              '<div class="card-header" id="header' + tempo +'">' +
              // '<h2 class="mb-0">' +
              '<div class="card text-white bg-info mb-3" data-toggle="collapse" data-target="#collo'+tempo+'" aria-expanded="true" aria-controls="' + tempo + '">'+
              '<div class="card-header">' + element.title +'  ||  Due--'+element.due_date+'</div>'+
              '<div class="card-body">'+
              '<p class="card-text">Description--'+ element.description +'</p>'+
              '<p class="card-text">Priority--'+ element.priority +'</p>'+
              '<p class="card-text">Status--'+ element.status +'</p>'+
              '</div>'+
              '</div>'+
              // '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collo'+tempo+'" aria-expanded="true" aria-controls="' + tempo + '">' +
              // '<h6> Title: ' + element.title + '</h6>' +
              // '<h6> Due-Date: ' + element.due_date + '</h6>' +
              // '<h6> Status: ' + element.status + '</h6>' +
              // '<h6> Description: ' + element.description + '</h6>' +
              // '<h6> Priority: ' + element.priority + '</h6>' +
              // '</button>' +
              // '</h2>' +
              '</div>' +
              '<div id="collo'+tempo+'" class="collapse" aria-labelledby="header'+tempo+'" data-parent="#accordionExample">' +
              '<div class="card-body" id ="cardbody'+tempo+'">' +
              '<div class="btn-group" role="group" aria-label="Basic example">' +
              '<input type = "text" id= "'+tempo+'notesbox" style="height: 39px;" placeholder="enter Note"></input>' +
              '<button type="button" class="btn btn-info" id="'+tempo+'notesbutton">Add Notes</button>' +
              '<button type="button" class="btn btn-info" id="'+tempo+'editbutton">Edit Task</button>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>'
  
            );
            
            
            //This function would add notes to corresponding Task
            $(document).on('click', '#' + tempo + 'notesbutton', function () {
             
              var taskTitle = element.title;
             
              var taskNote = $('#' + tempo + 'notesbox').val();
              $.ajax({
                datatype: 'json',
                url: '/api/tasks/' + taskTitle + '/notes',
                type: 'post',
                data: { title: taskTitle, note: taskNote },
                success: function (data) {
                  console.log("successfully added Note ");
                }
  
              });
              var reloadPage = function () { location.reload(true); }
              location.reload(true);
              reloadComponent = reloadPage;
  
            });
            //This function would edit the corresponding Task
            $(document).on('click', '#' + tempo + 'editbutton', function () {
              alert("Great now fill the updated Info on the right side")
              var taskTitle = element.title;
              document.getElementById("editInput1").disabled = true;
              var due_Date = element.due_date;
              var priority = element.priority;
  
              setFormData(taskTitle, due_Date, priority);
  
            });
  
            notesCall(element.title, count,tempo);
            count++;
          });
  
        }
  
      });
  
  
    }
    refreshTasks();
  
    // This would handle Task Updation
    $(document).on('click', '#button21', function () {
      var taskTitle = document.getElementById("editInput1").value;
      var taskDate = document.getElementById("editInput2").value;
      var taskPriority = document.getElementById("editSelect1").value;
      var taskStatus = "incomplete";
      if (document.getElementById('option1').checked) {
        taskStatus = document.getElementById('option1').value;
      }
      $.ajax({
        datatype: 'json',
        url: '/api/tasks/' + taskTitle,
        type: 'patch',
        data: { status: taskStatus, due_date: taskDate, priority: taskPriority },
        success: function (data) {
          console.log("successfully edited Task ");
        }
  
      });
      reloadComponent;
      location.reload(true);
    });
  
    //This is used to display all notes under a task
    var notesCall = function (title, count, newTempo) {
  
      $.ajax({
        datatype: 'json',
        url: '/api/tasks/' + title + '/notes',
        type: 'get',
  
        success: (data) => {
  
          data.forEach(element => {
  
            $('#cardbody' + newTempo).append(
  
              '<div class="card border-success mb-3">' +
              '<div class="card-header">Note</div>' +
              '<div class="card-body text-success">' +
              '<h5 class="card-title">' +
              element.Note +
              '</h5>' +
              '</div>' +
              '</div>'
  
            );
  
          })
  
        }
  
      });
  
    }
  
  
    //This would help Create a task
    $('#button11').click(() => {
  
      if ($('#exampleFormControlInput1').val() == "") { return; }
      var createTasks = function () {
  
        var newTitle = $('#exampleFormControlInput1').val()
        var newDescription = $('#exampleFormControlTextarea1').val()
        var newDue_date = $('#exampleFormControlInput2').val()
        var newPriority = $('#exampleFormControlSelect1').val()
  
        $.ajax({
          datatype: 'json',
          url: '/api/tasks',
          type: 'post',
  
          data: { title: newTitle, due_date: newDue_date, description: newDescription, status: 'Incomplete', priority: newPriority },
          success: function (data) {
            console.log("successfully added data");
          }
        });
  
      }
      createTasks();
      location.reload(true);
  
    });
  
    //Sort by date descending
    $('#sortDsc').click(() => {
  
      sortType = 1;
      $("#accordionExample").empty();
      $("#accordionExample").html("Fetching Sorted Data......");
      window.setTimeout(refreshTasks, 2000);
  
  
    });
  
    //Sort by date ascending
    $('#sortAsc').click(() => {
  
      sortType = 2;
      $("#accordionExample").empty();
      $("#accordionExample").html("Fetching Sorted Data......");
      window.setTimeout(refreshTasks, 2000);
  
  
    });
  
    //Sort by priority
    $('#prioritySort').click(() => {
  
      sortType = 3;
      $("#accordionExample").empty();
      $("#accordionExample").html("Fetching Sorted Data......");
      window.setTimeout(refreshTasks, 2000);
  
  
    });
  
    //Sort by status
    $('#statusSort').click(() => {
  
      sortType = 4;
      $("#accordionExample").empty();
      $("#accordionExample").html("Fetching Sorted Data......");
      window.setTimeout(refreshTasks, 2000);
  
  
    });
  
  });
  
  
  
  
  