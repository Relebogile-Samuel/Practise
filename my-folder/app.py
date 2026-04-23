from flask import Flask, request, jsonify
import sqlite3
import bcrypt

app = Flask(__name__)

def get_db():
    return sqlite3.connect("users.db")

def create_table():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            phone TEXT,
            dob TEXT,
            blood_type TEXT,
            allergies TEXT
        )
    ''')
    conn.commit()
    conn.close()

create_table()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    conn = get_db()
    try:
        conn.execute('''
            INSERT INTO users (username, email, password, phone, dob, blood_type, allergies)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['username'],
            data['email'],
            hashed,
            data['phone'],
            data['dob'],
            data['blood_type'],
            data['allergies']
        ))
        conn.commit()
        return jsonify({"message": "Signup successful"})
    except:
        return jsonify({"message": "Email already exists"})
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json

    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data['email'],)).fetchone()
    conn.close()

    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user[3]):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"})

if __name__ == '__main__':
    app.run(debug=True)