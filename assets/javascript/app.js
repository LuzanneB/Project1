// ensure document is ready and log it
$(document).ready(function () {
    console.log("Lets Go!");
    // creates hover tool tip on footer
    $('.tooltipped').tooltip();
    // initializes collapse
    $('.collapsible').collapsible();
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
        $(".foodItem").empty();  
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
                    
                    let food = resp.products[i];
                    if(food.ingredients == ""){
                        continue;
                    }
                    //new li 
                    let newLi = $("<li>");
                    //new header
                    let newHeader = $("<div>");
                    newHeader.addClass("collapsible-header");
                    //icpon
                    let icon = $("<i>");
                    icon.addClass("material-icons");
                    icon.text("add_circle_outline");
                    let foodBrand = $("<span>");
                    foodBrand.text(food.brands +" "+food.product_name);
                    newHeader.append(icon,foodBrand);
                    let newBody = $("<div>");
                    newBody.addClass("collapsible-body");
                    let foodImage = $("<img>");//not styled
                    //img and without image
                    if(food.image_front_thumb_url){
                        foodImage.attr("src",food.image_front_thumb_url);
                    }else{
                        foodImage.attr("src","");
                        foodImage.attr("alt","some image");
                    }
                    newBody.append(foodImage);
                    let newIngreDiv = $("<div>");
                    //loop through ingredients array
                    for(var j=0;j<food.ingredients_original_tags.length;j++){
                        let ingreArr = food.ingredients_original_tags[j].split(":");
                        let ingreSpan = $("<span>");
                        ingreSpan.text(ingreArr[1]);
                        newIngreDiv.append(ingreSpan);
                        console.log(ingreSpan);
                        
                    }
                    newBody.append(newIngreDiv);
                    console.log(newBody);
                    
                    newLi.append(newHeader,newBody);
                    
                    $(".foodItem").append(newLi);
                    
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