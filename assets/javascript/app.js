// ensure document is ready and log it
$(document).ready(function () {
    console.log("Lets Go!");
    // creates hover tool tip on footer
    $('.tooltipped').tooltip();
    // initializes collapse
    $('.collapsible').collapsible();
    // initializes modal
    $('.modal').modal();
    // hide progress bar by default
    $(".progress").hide();
    // all code must be after this line

    var foodName;
    //initial the search button action
    // fix CORS erro with proxy
    var cors_api_url = "https://cors-anywhere.herokuapp.com/";
    var url = "https://us.openfoodfacts.org/category/";
    //https://us.openfoodfacts.org/category/ketchup/1.json
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
        $(".progress").show();
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
                if (resp.count == 0) {//void response
                    console.log("no result found");
                    // hide the progress bar if no results
                    $(".progress").hide();
                } else {
                    $(".foodItem").empty();
                    for (var i = 0; i < 10; i++) {
                        //data-persistence
                        // let history = JSON.parse(localStorage.getItem("history"));
                        // if (!history){
                        //     history=[];
                        // }
                        // history.push(foodName);
                        // localStorage.setItem("history",JSON.stringify(history));
                        let food = resp.products[i];
                        if (food.ingredients_original_tags == "") {
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
                        foodBrand.addClass("brands");
                        let name = $("<span>");
                        foodBrand.text(food.brands);
                        name.text(" : " + food.product_name);
                        let modalLink = $("<button>");
                        modalLink.addClass("btn modal-trigger");
                        modalLink.attr("data-target","modal1");
                        modalLink.attr("value",food.brands);
                        modalLink.text("Learn more about "+food.brands);
                        newHeader.append(icon, foodBrand, name);
                        let newBody = $("<div>");
                        newBody.addClass("collapsible-body");
                        let foodImage = $("<img>");//not styled
                        //img and without image
                        if (food.image_front_thumb_url) {
                            foodImage.attr("src", food.image_front_thumb_url);
                        } else {
                            foodImage.attr("src", "./assets/images/no-image-available.png");
                            foodImage.attr("alt", "No Image Available");
                        }
                        newBody.append(foodImage);
                        let newIngreDiv = $("<div>");
                        //loop through ingredients array
                        for (var j = 0; j < food.ingredients_original_tags.length; j++) {
                            let ingreArr = food.ingredients_original_tags[j].split(":");
                            let ingreSpan = $("<span>");
                            ingreSpan.text(ingreArr[1] + "|");
                            newIngreDiv.append(ingreSpan);
                            console.log(ingreSpan);
                        }
                        newBody.append(newIngreDiv,modalLink);
                        console.log(newBody);

                        newLi.append(newHeader, newBody);
                        // hide the progress bar prior to showing results
                        $(".progress").hide();
                        $(".foodItem").append(newLi);

                    }
                   
               
              
                    
                }
g
            });
            //clear the user input
            $("#user-input").val("");
        }

    });

    //pop up modal to show brand info pulled from wiki api
    $(document).on("click",".modal-trigger",function(){
        let key = $(this).attr("value");
        $.ajax({
            method: "GET",
            //wiki api that returns certain extract of the title
            url: cors_api_url + "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles="+key+"&redirects="
        }).then(function(resp){
            let obj = resp.query.pages;
            let mark = JSON.stringify(obj).substring(2,4);
            if(mark == -1){//no result//display no result
                let warning = $("<h4>").text("No Brand Found");
                $(".modal-content").empty();
                $(".modal-content").append(warning);
            }else{//found and display the 1st search match  hope it works for other items
               
                let text = JSON.stringify(obj).split(':"')[2];
                let content = $("<p>").text(text.substring(0,text.length-3));
                $(".modal-content").empty();
                $(".modal-content").append(content);
            }
        });
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