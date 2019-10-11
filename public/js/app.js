$(document).ready(function() {
  $(".donebutton").on("click", function(event) {
    event.preventDefault();
    var id = $(this).attr("id");
    // Send the PUT request.
    $.ajax("/api/checkouttask", {
      type: "PUT",
      data: { id: id }
    }).then(function() {
      // Reload the page to get the updated list
      location.reload();
    });
  });


  $(".datepicker").datepicker({
    format: "mm/dd/yyyy",
    startDate: "-3d"
  });
});

