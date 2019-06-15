// ensure document is ready and log it
$( document ).ready(function() {
    console.log( "Lets Go!" );
// all code must be after this line

//initial the search button action
$("#search").click(function(e){
    // prevent the default action of the form
    e.preventDefault();
    //get user input
    //let num = $("#").val();
    //let measure = $("#").val();
    //let food = $("#").val();
    $.ajax({
        // here goes the method queryurl and headers
        method : "GET",
        queryURL : ""+ foodName
    }).then(function(resp){
        //here deal with response json from edaman nutrition
        //check response
        if(resp){
            //erro response
        }else{
            //deal with response
            //create dom elements
            //display doms


        }
        //clear the user input
    });
    //create function to show pop up images
    $(document).on("click",".img",function(){
        //modal.img.attr("src",ingredientsImage);
    });
    //create function for pop up modals 
    // $(document).on("click","",function(){

    // });
    //  
    //create function to link ingredients text to wiki
    // $(document).on("click","(the content in modals)",function(){

    // });
});























 //closing document ready...all code must be above this 
});