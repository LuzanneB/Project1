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
    //initializes tabs
    var elem = document.querySelector('.tabs'); var instance = M.Tabs.init(elem, {});

    //initialize firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBToTk-H6xDM9KubswcX13jz5MJWjmbKhE",
        authDomain: "food-decoder.firebaseapp.com",
        databaseURL: "https://food-decoder.firebaseio.com",
        projectId: "food-decoder",
        storageBucket: "",
        messagingSenderId: "1085307526367",
        appId: "1:1085307526367:web:0c3e6fe52623e883"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      var database = firebase.database();
    // all code must be after this line

    var foodName;
    var foodObj;
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
    function searchHisory(his) {
        let item = his;
        //data-persistence
        let history = JSON.parse(localStorage.getItem("history"));
        if (!history){
            history=[];
        }
        if(history.indexOf(item) == -1){
            history.push(foodName);
        }
        
        localStorage.setItem("history",JSON.stringify(history));
    }
    function displayItems(input) {
        foodName = input;
        $(".progress").show();
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
                //console.log(resp);
                //display doms
                foodObj = resp;
                $(".foodItem").empty();
                if (resp.count == 0) {//void response
                    //console.log("no result found");
                    // hide the progress bar if no results
                    let noResultImage = $("<img>").attr("src", "assets/images/no-results.png")
                    $(".no-result").append(noResultImage);
                    $(".progress").hide();
                } else {
                    searchHisory(foodName);
                    console.log(localStorage.getItem("history"));
                    
                    for (var i = 0; i < 10; i++) {

                        let food = resp.products[i];
                        if (food.ingredients_original_tags == "") {
                            continue;
                        }
                        //new li 
                        let newLi = $("<li>");
                        //new header
                        let newHeader = $("<div>");
                        newHeader.addClass("collapsible-header");
                        //icon +
                        let icon = $("<i>");
                        icon.addClass("material-icons");
                        icon.text("add_circle_outline");
                        //food brand
                        let foodBrand = $("<span>");
                        foodBrand.addClass("brands");
                        //food name
                        let name = $("<span>");
                        foodBrand.text(food.brands);
                        name.text(" : " + food.product_name);
                        //modal button
                        let modalLink = $("<button>");
                        modalLink.addClass("btn modal-trigger light-green waves-effect waves-light");
                        modalLink.attr("data-target", "modal1");
                        modalLink.attr("value", food.brands);
                        modalLink.text("Learn more about " + food.brands);
                        newHeader.append(icon, foodBrand, name);
                        let newBody = $("<div>");
                        newBody.addClass("collapsible-body");
                        //foodimage
                        let foodImage = $("<img>");//not styled
                        foodImage.attr("value", i);
                        foodImage.addClass("food-image");
                        //ingredient image
                        let ingreImage = $("<img>");
                        ingreImage.addClass("ingre");
                        ingreImage.attr("id", "ingre" + i);
                        ingreImage.hide();
                        //img and without image
                        if (food.image_front_thumb_url) {
                            foodImage.attr("src", food.image_front_thumb_url);
                            ingreImage.attr("src", food.image_ingredients_url)
                        } else {
                            foodImage.attr("src", "./assets/images/no-image-available.png");
                            foodImage.attr("alt", "No Image Available");
                            ingreImage.attr("src", "./assets/images/no-image-available.png");
                            ingreImage.css("max-width", "300px");
                        }
                        newBody.append(foodImage, ingreImage);
                        let newIngreDiv = $("<div>").addClass("row");

                        //loop through ingredients array
                        for (var j = 0; j < food.ingredients_original_tags.length; j++) {
                            let ingreArr = food.ingredients_original_tags[j].split(":");
                            let ingreSpan = $("<span>");
                            ingreSpan.text(ingreArr[1] + "|");
                            newIngreDiv.append(ingreSpan);
                            //console.log(ingreSpan);
                        }
                        let newRow = $("<div>").addClass("row");
                        let newColFood = $("<div>").addClass("col");
                        let newColIngre = $("<div>").addClass("col");
                        newColFood.append(foodImage);
                        newColIngre.append(ingreImage);
                        newRow.append(newColFood, newColIngre);
                        newBody.append(newRow, newIngreDiv,modalLink);
                        //console.log(newBody);

                        newLi.append(newHeader, newBody);
                        // hide the progress bar prior to showing results
                        $(".progress").hide();
                        $(".foodItem").append(newLi);

                    }




                }
            });
            //clear the user input
            $("#user-input").val("");
        }
    }
    $("#search").click(function (e) {
        $(".progress").show();
        e.preventDefault();
        $(".foodItem").empty();
        $(".no-result").empty();
        foodName = $("#user-input").val();
        displayItems(foodName);

    });
    //change icon of li when clicked
    $(document).on("click", "li", function () {
        if ($(this).attr("class") == "active") {
            $(".material-icons").text("add_circle_outline");
            $(this).find(".material-icons").text("remove_circle_outline");
        } else {
            $(this).find(".material-icons").text("add_circle_outline");
        }
    });
    //pop up modal to show brand info pulled from wiki api
    $(document).on("click", ".modal-trigger", function () {
        let key = $(this).attr("value");
        $.ajax({
            method: "GET",
            //wiki api that returns certain extract of the title
            url: cors_api_url + "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=" + key + "&redirects="
        }).then(function (resp) {
            let obj = resp.query.pages;
            let mark = JSON.stringify(obj).substring(2, 4);
            if (mark == -1) {//no result//display no result
                let warning = $("<h4>").text("No Brand Found");
                let noResult = $("<img>").attr("src", "assets/images/no-results.png")
                $(".modal-content").empty();
                $(".modal-content").append(warning, noResult);
            } else {//found and display the 1st search match  hope it works for other items

                let text = JSON.stringify(obj).split(':"')[2];
                let content = $("<p>").text(text.substring(0, text.length - 3));
                $(".modal-content").empty();
                $(".modal-content").append(content);
            }
        });
    });
    //create function to hide pop up images
    $(document).on("mouseleave", ".food-image", function () {
        //mouse leave hide the image
        //hide all
        $(".ingre").hide();

    });
    //show ingredients image when mouse enter
    $(document).on("mouseenter", ".food-image", function () {
        //mouse enter img and display the image
        let index = $(this).attr("value");
        $("#ingre" + index).show();

    });
    //create onclick action for top search 
    $(document).on("click", ".collection-item", function () {
        foodName = $(this).text();
        displayItems(foodName);
    });
    // closing document ready...all code must be above this 
});