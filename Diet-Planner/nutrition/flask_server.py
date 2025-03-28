import os
import json
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(_name_)
socketio = SocketIO(app)

# Ensure data directories exist
os.makedirs(os.path.join(app.root_path, 'food_data'), exist_ok=True)
os.makedirs(os.path.join(app.root_path, 'user_data'), exist_ok=True)

@app.route("/")
def hello():
    message = "Hello World!"
    return render_template('index.html', message=message)

@app.route("/index.html")
def index():
    message = "Welcome to index.html!"  
    return render_template('index.html', message=message)

@app.route("/history.html")
def history():
    message = "Welcome to history.html!"  
    return render_template('history.html', message=message)

@app.route("/track.html")
def track():
    message = "Welcome to track.html!"  
    return render_template('track.html', message=message)

@app.route("/preference.html")
def preference():
    message = "Welcome to preference.html!"   
    return render_template('preference.html', message=message)

@app.route("/Recipes.html")
def Recipes():
    message = "Welcome to Recipes.html!"  
    return render_template('Recipes.html', message=message)

@app.route("/disease.html")
def disease():
    message = "Welcome to disease.html!"  
    return render_template('disease.html', message=message)

@app.route("/food-database", methods=['GET', 'POST'])
def foodDatabase():
    json_file = os.path.join(app.root_path, 'food_data', 'localFoods.json')
    
    if request.method == 'GET':
        try:
            with open(json_file) as file:
                data = json.load(file)
                return jsonify(data)
        except FileNotFoundError:
            return jsonify([])

    elif request.method == 'POST':
        # Ensure the file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump([], file)

        with open(json_file, 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            received_data["tags"] = json.loads(received_data["tags"])

            # Check if food already exists
            if not any(temp["name"] == received_data["name"] for temp in stored_data):
                stored_data.append(received_data.copy())

            # Write back to file
            file.seek(0)
            json.dump(stored_data, file)
            file.truncate()
        
        return jsonify(stored_data)

@app.route("/food-log", methods=['GET', 'POST', 'DELETE'])
def foodLog():
    user = request.args.get('user', default='test', type=str)
    json_file = os.path.join(app.root_path, 'user_data', f'{user}_log.txt')

    if request.method == 'GET':
        try:
            with open(json_file) as file:
                data = json.load(file)
                return jsonify(data)
        except FileNotFoundError:
            return jsonify({"user": user})

    elif request.method in ['POST', 'DELETE']:
        # Ensure the file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump({"user": user}, file)

        with open(json_file, 'r+') as file:
            try:
                stored_data = json.load(file)
                received_data = request.form.to_dict()
                processFoodData(received_data, stored_data, request.method)
                
                file.seek(0)
                json.dump(stored_data, file)
                file.truncate()
                return jsonify(stored_data)
            except Exception as e:
                print(f"Couldn't write to user data: {e}")
                return jsonify({"error": str(e)}), 400

def processFoodData(received_data, stored_data, method):
    # Validation checks
    if method == 'POST' and not all(keys in received_data for keys in ["name", "meal", "date", "user", "serving", "calories", "carbohydrates", "proteins", "fats"]):
        raise ValueError("Not all required data was present in received_data")
    elif method == 'DELETE' and not all(keys in received_data for keys in ["name", "meal", "date", "user"]):
        raise ValueError("Not all required data was present in received_data")

    if received_data["name"] != "":
        if "tags" in received_data:
            received_data["tags"] = json.loads(received_data["tags"])
        
        remove = ["meal", "date", "user"]
        food_temp = {x: received_data[x] for x in received_data if x not in remove}
        
        # Ensure date and meal structures exist
        if received_data["date"] not in stored_data:
            stored_data[received_data["date"]] = {"Breakfast": [], "Lunch": [], "Dinner": []}
        
        if received_data["meal"] not in stored_data[received_data["date"]]:
            stored_data[received_data["date"]][received_data["meal"]] = []

        if method == 'POST':
            stored_data[received_data["date"]][received_data["meal"]].append(food_temp)
        elif method == 'DELETE':
            stored_data[received_data["date"]][received_data["meal"]] = [
                item for item in stored_data[received_data["date"]][received_data["meal"]] 
                if item["name"] != received_data["name"]
            ]

@app.route("/food-pref", methods=['GET', 'POST', 'DELETE'])
def foodPref():
    user = request.args.get('user', default='test', type=str)
    json_file = os.path.join(app.root_path, 'user_data', f'{user}_pref.txt')

    if request.method == 'GET':
        # Ensure file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump({"user": user, "plan": None}, file)

        with open(json_file) as file:
            data = json.load(file)
            return jsonify(data)

    elif request.method in ['POST', 'DELETE']:
        # Ensure file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump({"user": user, "plan": None}, file)

        with open(json_file, 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            stored_data["plan"] = received_data.copy()
            
            file.seek(0)
            json.dump(stored_data, file)
            file.truncate()
            return jsonify(stored_data)

@app.route("/food-dislike", methods=['GET', 'POST', 'DELETE'])
def foodDislike():
    user = request.args.get('user', default='test', type=str)
    json_file = os.path.join(app.root_path, 'user_data', f'{user}_dislike.txt')

    if request.method == 'GET':
        # Ensure file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump({"user": user, "dislike": []}, file)

        with open(json_file) as file:
            data = json.load(file)
            return jsonify(data)

    elif request.method in ['POST', 'DELETE']:
        # Ensure file exists
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump({"user": user, "dislike": []}, file)

        with open(json_file, 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            stored_data["dislike"].append(received_data["dislike"])
            
            file.seek(0)
            json.dump(stored_data, file)
            file.truncate()
            return jsonify(stored_data)

@app.route("/food-tag-query", methods=['POST'])
def foodTagQuery():
    json_file = os.path.join(app.root_path, 'food_data', 'localFoods.json')

    try:
        with open(json_file, 'r') as file:
            stored_data = json.load(file)

        received_data = request.form.to_dict()
        target_nutrient = received_data["nutrient"]
        target_condition = received_data["condition"]
        foods_qualified = []

        for food_dict in stored_data:
            tag_to_check = f"{'High' if target_condition == 'high' else 'Low'} {target_nutrient.capitalize()}"
            if tag_to_check in food_dict.get("tags", []):
                foods_qualified.append(food_dict.copy())

        return jsonify(foods_qualified)
    except FileNotFoundError:
        return jsonify([])

if _name_ == "_main_":
    app.debug = True
    socketio.run(app, host='0.0.0.0', port=8888)
