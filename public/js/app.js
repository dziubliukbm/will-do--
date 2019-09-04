$(document).on("click","#scrape", function (){
    $.ajax({
      type: "GET",
      url:"/api/scrape"
    }).then(function(res){
      location.reload();
    })
  })
  $(document).on("click", '#delete', function (){
   var data = $(this).attr("data-id");
   $.ajax({
   type: "DELETE",
   url: "/article/"+data
 }).then(function (res){
      location.reload();
 });
 }); 
  $(document).on("click","#save", function (){
    var data = $(this).attr("data-id");
    $.ajax({
      type: "POST",
      url:"/articles/saved/"+data
    }).then(function(res){
      location.reload();
    })
  });

  $(document).on("click", ".addNote", function() {
    var i = $("#n").text();
    if( i === "submit"){
      alert("Finish your current note")
    } else {
    // Empty the notes from the note section
    var thisId = $(this).attr("data-id")

    // $("#notes").empty();
    var ref = $(`#notes${thisId}`)
    // Save the id from the p tag
    console.log(thisId)
    $.ajax({
      type : "GET",
      url: "/articles/" + thisId
    }).then(function(data) {
        console.log("this is data",data);
        // The title of the article
        ref.append("<h2 class=ntitle>" + data.title + "</h2>");
        // An input to enter a new title
        ref.append("<p> Note Title </p>")
        ref.append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        ref.append("<p> Your Note </p>")
        ref.append("<textarea id='bodyinput' name='body'></textarea>");
        ref.append("<br>")
        // A button to submit a new note, with the id of the article saved to it
  
  
        var submitButton = $('<button id="n" class="btn btn-primary mb-4">').text('submit').on('click', function() {
          // submit code goes here
           $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
              // Value taken from title input
              title: $("#titleinput").val(),
              // Value taken from note textarea
              body: $("#bodyinput").val()
            }
          })
        // With that done
        .then(function(data) {
          // Log the response
          console.log('what is this',data);
          // Empty the notes section
          ref.empty();
        });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
        })
  
        ref.append(submitButton);
  
        console.log("it",data.note)
        if (data.note) {
          console.log(data.note)
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
   });
  }
   });