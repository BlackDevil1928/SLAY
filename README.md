# SLAY: Smart Diet & Nutrition Planner
Overview

NutriPlan is an AI-driven web application designed for nutrition and diet planning. It empowers users to create personalized dietary plans and search for food items using the Nutritionix database. The system intelligently recommends foods based on extracted nutritional features, individual user preferences, and specific dietary goals. Furthermore, it provides a comprehensive nutritional breakdown of suggested foods, utilizing the latest Estimated Energy Requirement (EER) equation [1][2].

Installation & Setup

1️⃣ Prerequisites

Ensure you have the following installed:

Python 3.7+

pip (Python package manager)

Virtual environment (optional but recommended)

2️⃣ Clone the Repository

     git clone https://github.com/your-repo/nutrition-planner.git
     cd nutrition-planner

3️⃣ Create & Activate a Virtual Environment

    python -m venv venv  # Create virtual environment
    source venv/bin/activate  # Activate (Linux/macOS)
    venv\Scripts\activate  # Activate (Windows)

4️⃣ Install Dependencies
   
     pip install -r requirements.txt

  5️⃣ Run the Application

    python flask_server.py

  ✅ Features:

*   View past entries in the food history log.
*   Delete items from the history log using the delete icon.
*   Labels indicate whether a food is high or low in specific macronutrients.
*   Clicking on a label displays a Decision Tree AI model, providing an explanation of how the classification was determined.

  ✅ Technologies Used

Python (Flask, Flask-SocketIO)

HTML/Jinja2 (For rendering templates)

JSON (Data storage for food & user logs)

JavaScript (Client-side interactions)

🫂Contributing

Contributions are welcome! To contribute:

Fork the repository

Create a new feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Added new feature")

Push to the branch (git push origin feature-name)

Submit a pull request


📞Contact

For any issues or suggestions, please open an issue on the repository or contact the developer.

Happy Coding! 🚀
