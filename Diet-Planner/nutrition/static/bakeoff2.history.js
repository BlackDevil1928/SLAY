var tabName = 'History';
var tabColor = 'orange';


openTab(tabName, tabColor)



$(document).ready(function() {
    
    $("#datepicker").datepicker();

    $('table.display').DataTable({
        "columnDefs": [
            {
                targets: -2,
                createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
                },
                render: function(data, type, full){
                    var data_array = data.split(",");
                    var data_class = "food-tag-" + data_array[1].replace(" ", "-");
                    return ("<label class=\""+ data_class + "\" for=\""+ data_array[0] + "\">" + data_array[1] + "</label>");
                }
            },
            {
                targets: -1,
                data: null,
                defaultContent: "<button type=\"submit\" id=\"b_delete_item\"><i class=\"fas fa-trash-alt\"></i></button>",
            },
            {
            	targets: -3,
            	render: function(data, type, full){
                    var data_array = data.split(",");
                    var return_string = ""
                    for (i = 0; i < data_array.length; i++) {
                        return_string += "<label class=\""+ data_array[i] + "\">" + data_array[i] + "</label><br><div style=\"margin-top: 4px\"></div>";
                    }
                    return return_string;
                }
            }
        ],
        "searching": false,
        "paging": false,
        "info": false
    })  
    .clear().draw();

});

var foods_localData = [];

function loadLocalFoodDatabase() {
       
    $.get("/food-database", function(data){
        foods_localData = data;
    });
}

loadLocalFoodDatabase();

var userDietProfile = {};


function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {
            $("#cutoff-calories").val(data["plan"]["cutoff_calories"]);
            $("#cutoff-carbohydrates").val(data["plan"]["cutoff_carbohydrates"]);
            $("#cutoff-proteins").val(data["plan"]["cutoff_proteins"]);
            $("#cutoff-fats").val(data["plan"]["cutoff_fats"]);
            $("#cutoff-iron").val(data["plan"]["cutoff_iron"]);
            $("#cutoff-calcium").val(data["plan"]["cutoff_calcium"]);
            $("#cutoff-magnesium").val(data["plan"]["cutoff_magnesium"]);
            $("#cutoff-vitaminD").val(data["plan"]["cutoff_vitaminD"]);
            $("#cutoff-vitaminB12").val(data["plan"]["cutoff_vitaminB12"]);
        }
    });
}


loadDietProfile();

var user = "";
var sel_date = "";
var foods_breakfast = [];
var foods_lunch = [];
var foods_dinner = [];


function deleteItem(meal_ID, meal, row_selector) {
    var data = $(meal_ID).DataTable().row(row_selector).data();
    var my_data = {"user": "tester",
        "name": data[0],
        "meal": meal,
        "date": $("#datepicker").val()
    };
    $(meal_ID).DataTable().row(row_selector).remove().draw();
    $.ajax({        
        url: "/food-log" + window.location.search,
        type: "DELETE",
        data: my_data, 
        dataType: "json"             
    });
};


$("#history-search-icon").click(function(){

    $.get("/food-log" + window.location.search, function(data){
      
        $('table.display').DataTable().clear().draw();

        
        sel_date = $("#datepicker").val()
        user = data["user"];
        foods_breakfast = data[sel_date]["Breakfast"];
        foods_lunch = data[sel_date]["Lunch"];
        foods_dinner = data[sel_date]["Dinner"];


        
        for(let i = 0; i < foods_breakfast.length; i++){
            var food_nutrition = foods_breakfast[i];
            
            var food_decision = food_EvaluationByAI(food_nutrition);
            var tags = food_nutrition["tags"].join(",");
           
            $("#table_breakfast").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };

 
        for(let j = 0; j < foods_lunch.length; j++){
            var food_nutrition = foods_lunch[j];
       
            var food_decision = food_EvaluationByAI(food_nutrition);
            var tags = food_nutrition["tags"].join(",");
       
            $("#table_lunch").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };


        for(let k = 0; k < foods_dinner.length; k++){
            var food_nutrition = foods_dinner[k];
      
            var food_decision = food_EvaluationByAI(food_nutrition);
            var tags = food_nutrition["tags"].join(",");
       
            $("#table_dinner").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };



        // style food tags
        $("label:contains('Good Food')").css( "color", "white");
        $("label:contains('Good Food')").css( "padding", "5px");
        $("label:contains('Bad Food')").css( "color", "white");
        $("label:contains('Bad Food')").css( "padding", "5px");
        // https://api.jquery.com/contains-selector/
        $("label:contains('Good Food')").css( "background-color", "lightseagreen" );
        $("label:contains('Bad Food')").css( "background-color", "tomato" );

        $("label:contains('High Proteins')").css( "background-color", "darkorange" );
        $("label:contains('High Proteins')").css( "color", "white");
        $("label:contains('High Proteins')").css( "padding", "5px");
        $("label:contains('High Proteins')").css( "display", "inline-block");
        $("label:contains('High Proteins')").css( "width", "100px");

        $("label:contains('Low Carbohydrates')").css( "background-color", "skyblue" );
        $("label:contains('Low Carbohydrates')").css( "color", "white");
        $("label:contains('Low Carbohydrates')").css( "padding", "5px");
        $("label:contains('Low Carbohydrates')").css( "display", "inline-block");
        $("label:contains('Low Carbohydrates')").css( "width", "120px");

        $("label:contains('Low Fats')").css( "background-color", "skyblue" );
        $("label:contains('Low Fats')").css( "color", "white");
        $("label:contains('Low Fats')").css( "padding", "5px");
        $("label:contains('Low Fats')").css( "display", "inline-block");
        $("label:contains('Low Fats')").css( "width", "100px");

        $("label:contains('Low Proteins')").css( "background-color", "skyblue" );
        $("label:contains('Low Proteins')").css( "color", "white");
        $("label:contains('Low Proteins')").css( "padding", "5px");
        $("label:contains('Low Proteins')").css( "display", "inline-block");
        $("label:contains('Low Proteins')").css( "width", "100px");

        $("label:contains('High Carbohydrates')").css( "background-color", "darkorange" );
        $("label:contains('High Carbohydrates')").css( "color", "white");
        $("label:contains('High Carbohydrates')").css( "padding", "5px");
        $("label:contains('High Carbohydrates')").css( "display", "inline-block");
        $("label:contains('High Carbohydrates')").css( "width", "120px");

        $("label:contains('High Fats')").css( "background-color", "darkorange" );
        $("label:contains('High Fats')").css( "color", "white");
        $("label:contains('High Fats')").css( "padding", "5px");
        $("label:contains('High Fats')").css( "display", "inline-block");
        $("label:contains('High Fats')").css( "width", "100px");

        alert("Data was retrieved for user: " + user);
    });
});

$("#table_breakfast tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_breakfast").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_breakfast").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_breakfast").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");

    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }

    if ($(this).attr("class") == "High Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }

} );

$("#table_lunch tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_lunch").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_lunch").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_lunch").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");


    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }


    if ($(this).attr("class") == "High Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }
} );



$("#table_dinner tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_dinner").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_dinner").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_dinner").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");

    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }

    if ($(this).attr("class") == "High Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }
} );


$("#table_breakfast tbody").on('click', 'button', function () {
    deleteItem('#table_breakfast', 'Lunch', $(this).parents('tr'));
} );

$("#table_lunch tbody").on('click', 'button', function () {
    deleteItem('#table_lunch', 'Lunch', $(this).parents('tr'));
} );

$("#table_dinner tbody").on('click', 'button', function () {
    deleteItem('#table_dinner', 'Dinner', $(this).parents('tr'));
} );





/*  --- Food Evaluation Criteria Planner ---  */
// --- In-Use ---
$("#food-cutoff-button").click(function() {

    //update user's diet profile object
    userDietProfile["cutoff_calories"] = $("#cutoff-calories").val();
    userDietProfile["cutoff_carbohydrates"] = $("#cutoff-carbohydrates").val();
    userDietProfile["cutoff_proteins"] = $("#cutoff-proteins").val();
    userDietProfile["cutoff_fats"] = $("#cutoff-fats").val();
    userDietProfile["cutoff_iron"] = $("#cutoff-iron").val();
    userDietProfile["cutoff_calcium"] = $("#cutoff-calcium").val();
    userDietProfile["cutoff_magnesium"] = $("#cutoff-magnesium").val();
    userDietProfile["cutoff_vitaminD"] = $("#cutoff-vitaminD").val();
    userDietProfile["cutoff_vitaminB12"] = $("#cutoff-vitaminB12").val();


    $.post("/food-pref", userDietProfile, null, "json");

    alert("Evaluation Criteria Saved!");
});