import pandas as pd
import time
import threading
from pynput import keyboard
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

data = []
question_attempts = {}
risk_score = 0
max_risk_score = 100
lock = threading.Lock()

last_activity_time = time.time()
decay_rate = 1

question_time_limits = {
    "mcq": 3,
    "short_desc": 5,
    "logic": 10,
    "coding": 15,
    "case_study": 30
}

current_question = None
question_start_time = None
current_question_id = None
num_questions = 10
exam_start_time = None

def on_press(key):
    global risk_score, last_activity_time
    try:
        with lock:
            risk_score = min(risk_score + 4, max_risk_score)
            last_activity_time = time.time()
            data.append(["key_press", time.time(), "", "", key.char])
    except AttributeError:
        with lock:
            data.append(["key_press", time.time(), "", "", str(key)])

def analyze_risk():
    global risk_score, num_questions

    if risk_score < num_questions * 3:
        return "Low Risk ✅"
    elif risk_score < num_questions * 5:
        return "Medium Risk 🟡"
    elif risk_score < num_questions * 7:
        return "High Risk ⚠"
    else:
        return "Critical Risk 🚨"

def risk_decay():
    global risk_score
    while True:
        time.sleep(10)
        with lock:
            if time.time() - last_activity_time > 10:
                risk_score = max(risk_score - decay_rate, 0)

@app.route('/start_exam', methods=['POST'])
def start_exam():
    global exam_start_time
    exam_start_time = time.time()
    return jsonify({"message": "Exam started", "start_time": exam_start_time})

@app.route('/start_question', methods=['POST'])
def start_question():
    global current_question, question_start_time, current_question_id
    data = request.json
    if "question_type" not in data or "question_id" not in data:
        return jsonify({"error": "Missing question_type or question_id"}), 400

    with lock:
        if exam_start_time is None:
            return jsonify({"error": "Exam has not started"}), 400

        current_question = data["question_type"]
        current_question_id = data["question_id"]
        question_start_time = time.time()

        if current_question_id in question_attempts:
            question_attempts[current_question_id] += 1
            risk_score = min(risk_score + 4, max_risk_score)
        else:
            question_attempts[current_question_id] = 1

    return jsonify({
        "message": "Question tracking started",
        "question_type": current_question,
        "question_id": current_question_id,
        "attempt_count": question_attempts[current_question_id]
    })

@app.route('/submit_question', methods=['POST'])
def submit_question():
    global risk_score, current_question, question_start_time, current_question_id

    if current_question is None or question_start_time is None:
        return jsonify({"error": "No active question tracking"}), 400

    time_spent = time.time() - question_start_time
    expected_time = question_time_limits.get(current_question, 10)

    with lock:
        min_submission_time = 10
        if time.time() - exam_start_time < min_submission_time:
            risk_score = min(risk_score + 10, max_risk_score)

        if time_spent < expected_time * 0.3:
            risk_score = min(risk_score + 7, max_risk_score)
        elif time_spent < expected_time * 0.5:
            risk_score = min(risk_score + 5, max_risk_score)
        elif time_spent > expected_time * 1.5:
            risk_score = min(risk_score + 3, max_risk_score)

        with open("question_times.csv", "a") as file:
            file.write(f"{current_question_id},{current_question},{time_spent}\n")

        current_question = None
        question_start_time = None
        current_question_id = None

    return jsonify({"message": "Question submitted"})

@app.route('/get_progress', methods=['GET'])
def get_progress():
    global current_question, question_start_time, current_question_id, exam_start_time

    if current_question is None or question_start_time is None:
        return jsonify({"error": "No active question tracking"}), 400

    # Calculate progress for the current question
    time_spent = time.time() - question_start_time
    expected_time = question_time_limits.get(current_question, 10)
    progress = min(time_spent / expected_time, 1) * 100  # in percentage

    return jsonify({
        "current_question_id": current_question_id,
        "progress": progress
    })

@app.route('/')
def index():
    with lock:
        return render_template('index.html')

@app.route('/risk', methods=['GET'])
def get_risk():
    with lock:
        return jsonify({
            "risk_level": analyze_risk(),
            "score": risk_score
        })

def save_data():
    while True:
        time.sleep(10)
        with lock:
            if data:
                df = pd.DataFrame(data, columns=["event_type", "timestamp", "question_type", "time_spent", "question_id"])
                df.to_csv("user_activity.csv", index=False)
                print("Data saved!")

def start_listeners():
    keyboard_listener = keyboard.Listener(on_press=on_press)
    keyboard_listener.start()

listener_thread = threading.Thread(target=start_listeners, daemon=True)
data_thread = threading.Thread(target=save_data, daemon=True)
decay_thread = threading.Thread(target=risk_decay, daemon=True)

listener_thread.start()
data_thread.start()
decay_thread.start()

if __name__ == "__main__":
    app.run(debug=True)
