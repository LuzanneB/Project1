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
    var itemsHistory;
    database.ref().on("value", function (snap) {
        //get data from database
            if(snap.val()!= null){
                itemsHistory = snap.val().history;
            }else{
                itemsHistory = [];
            }
            displayMostSearch();
            displayRecentSearch();
        //console.log("history from value" + itemsHistory);
        //display and populate the trending
        //limits?
    });
    function searchHisory(his) {
        let flag = 0;
        if(itemsHistory.length == 0){  //nothing in the list first push
            itemsHistory.push({
                [his]: 1
            });
        }else{// list exist //update
        //loop 
        for(var i =0;i<itemsHistory.length;i++){
                //find the key
            if (itemsHistory[i].hasOwnProperty(his)) {//find the key-value
                    //console.log("update");
                    itemsHistory[i][his] += 1;
                    
                   // console.log(itemsHistory[i]);
                    flag++;
                }
            }
            console.log(flag);
            if(flag == 0){//no old key fonud //new search insert
                console.log("in insert");
                
                itemsHistory.push({
                    [his]: 1
                });
            }
    }

        database.ref().set({
            history: itemsHistory
        });
    }
    //display the most seached item by count #
    function displayMostSearch(){
        $(".most-searched").empty();  
        // let newAHead = $("<a>");
            // newAHead.text("Most searched : ");
        // $(".most-searched").append(newAHead)
        let maxCount = 0;
        let maxSearch ="";
            for(var i=0;i<itemsHistory.length;i++){//find the max
                let obj = itemsHistory[i];
                //console.log(JSON.stringify(obj));//{"Pancakes":1}
                let temp = JSON.stringify(obj).split(":")[1];
               // console.log(temp);
               //get key
               let item = JSON.stringify(obj).split(":")[0];
                item = item.substring(2,item.length-1);
               // console.log(item);
               //get value
                count = temp.substring(0,temp.length-1);
               // console.log("2222:"+temp);
                if(maxCount< parseInt(temp)){
                    maxCount = temp;
                    maxSearch = item.charAt(0).toUpperCase() + item.slice(1);
                }   
            }
            //display this item
            //<a href="#!" class="collection-item">Seaweed</a>
            let newA = $("<a>").addClass("collection-item");
            newA.attr("href","#!");
            newA.text(maxSearch);
            $(".most-searched").append(newA);    
    }
    //display most recent searched items 
    function displayRecentSearch(){
        $(".recent-search").empty();  
        let newAHead = $("<a>");
        // newAHead.text("Most recent search : "); 
        $(".recent-search").append(newAHead)
        if(itemsHistory.length>5){
            for(var i =0;i<5;i++){
                let obj = itemsHistory[itemsHistory.length-1-i];
               //get key
               let item = JSON.stringify(obj).split(":")[0];
                item = item.substring(2,item.length-1);
                item = item.charAt(0).toUpperCase() + item.slice(1);
            let newA = $("<a>").addClass("collection-item");
            newA.attr("href","#!");
            newA.text(item);
            $(".recent-search").append(newA); 
            }
        }else{
            for(var i =0;i<itemsHistory.length;i++){
                let obj = itemsHistory[i];
               //get key
               let item = JSON.stringify(obj).split(":")[0];
                item = item.substring(2,item.length-1);
                item = item.charAt(0).toUpperCase() + item.slice(1);
            let newA = $("<a>").addClass("collection-item");
            newA.attr("href","#!");
            newA.text(item);
            $(".recent-search").append(newA); 
            }
        }
            
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
                    for (var i = 0; i < 10; i++) {
                        let food = resp.products[i];
                        if (food == undefined || food.ingredients_original_tags == "") {
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
                        newBody.append(newRow, newIngreDiv, modalLink);
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
        } else {//nothing from input
            $(".progress").hide();
        }
        
    }
    $("#search").click(function (e) {
        $(".progress").show();
        e.preventDefault();
        $(".foodItem").empty();
        $(".no-result").empty();
        foodName = $("#user-input").val();
        displayItems(foodName);
        displayMostSearch();
        displayRecentSearch();
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
        $(".no-result").empty();
        foodName = $(this).text();
        displayItems(foodName);
    });
    // closing document ready...all code must be above this 
});