// ensure document is ready and log it
$(document).ready(function () {
    console.log("Lets Go!");
    // all code must be after this line
    var foodName;
    //initial the search button action
    // fix CORS erro with proxy
    var cors_api_url = "https://cors-anywhere.herokuapp.com/";
    var url = "https://us.openfoodfacts.org/category/";
    //https://us.openfoodfacts.org/category/ketchup/1.json
    var foodName;
    //rewrote CORS PROXY
    // function doCORSRequest(str){
    //     var x = new XMLHttpRequest();
    //     var newUrl = cors_api_url + url + str + "/1.json";
    //     console.log(newUrl);
    //    x.onload = x.onerror =function(){
    //        //get the response json from CORS proxy
    //        resp = x.responseText;
    //        console.log(resp);
    //    }
    //     x.open("GET", newUrl,true);
    //     x.send();
    // }
    $("#search").click(function (e) {
        e.preventDefault();
        foodName = $("#user-input").val();
        if (foodName !== "") {
            //input is not empty 
            //doCORSRequest(foodName);
            //try ajax with CORS PROXY
            $.ajax({
                //use ajax to require json from cors proxy 
                method: "GET",
                url: cors_api_url + url + foodName + "/1.json"
            }).then(function (resp) {
                //get the response
                console.log(resp);
                
                //display doms
                for(var i = 0;i <10; i++){
                    //loop 10 times in the json
                    //test example
                    // let newDiv = $("<div>");
                    // newDiv.text(resp.products[i].product_name);
                    // $("body").append(newDiv);
                }

            });
            //clear the user input
            $("#user-input").val("");
        }

    });
    //create function to show pop up images
    //$(document).on("click",".img",function(){
    //modal.img.attr("src",ingredientsImage);
    //});
    //create function for pop up modals 
    // $(document).on("click","",function(){

    // });
    //  
    //create function to link ingredients text to wiki
    // $(document).on("click","(the content in modals)",function(){

    // });

    // closing document ready...all code must be above this 
});