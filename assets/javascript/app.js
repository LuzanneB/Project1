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
        $(".foodResults").empty();  
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
                    let food = resp.products[i];
                    if(food.ingredients == ""){
                        continue;
                    }
                    let newRow = $("<div>");
                    newRow.addClass("row");
                    let newColImg =$("<div>");
                    newColImg.addClass("col-md-3");
                    let newColText = $("<div>");
                    newColText.addClass("col-md-6");
                    let foodImage = $("<img>");
                    if(food.image_front_thumb_url){
                        foodImage.attr("src",food.image_front_thumb_url);
                    }else{
                        foodImage.attr("src","");
                        foodImage.attr("alt","some image");
                    }
                    //let foodIngre = $("<p>");
                    //foodIngre.text(food.brands +" "+food.product_name+"Ingredients: "+food.ingredients);
                    let foodBrand = $("<p>");
                    foodBrand.text(food.brands +" "+food.product_name);
                    let foodIngre = $("<p>");
                    let ingre ="";
                    for (var j=0;j<food.ingredients_original_tags.length;j++){
                        let ingreArr = food.ingredients_original_tags[j].split(":");
                        ingre += ingreArr[1]+ " | ";
                    }
                    foodIngre.text(ingre);
                    newColImg.append(foodImage);
                    newColText.append(foodBrand, foodIngre);
                    newRow.append(newColImg,newColText);
                    $(".foodResults").append(newRow);
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