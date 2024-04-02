from flask import Flask, request, jsonify, session
import requests
from flask_cors import CORS
from flask_mysqldb import MySQL


app = Flask(__name__)
CORS(app,supports_credentials=True)
app.config['SECRET_KEY'] = 'secret'

app.config['MYSQL_HOST'] = 'database-1.crk06kai8f2k.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'Aws123321'
app.config['MYSQL_DB'] = 'Bathroom'
mysql = MySQL(app)

@app.route('/sign_in', methods = ['POST', 'GET'] )
def signIn():
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')

        cur.execute('select * from user where email = (%s)', (email,))
        response = cur.fetchone()
        if response:
            if password == response[3]:
                session['user_id'] = response[0]
                return jsonify({'message': 'password match'})
            
            else:
                return jsonify({'message': 'wrong password'})
            
        
        else:
            return jsonify({'message': 'no account'})

@app.route('/register', methods =['POST', 'GET'])
def register():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        print(username)
        email = data.get('email')
        password = data.get('password')
        cur = mysql.connection.cursor()
        cur.execute('select * from user where email = %s', (email, ))
        response = cur.fetchone()
        if response:
            return jsonify({'message': 'account already exists'})

        try:
            cur.execute('insert into user(username, email, password) values (%s,%s,%s)', (username,email,password))
            mysql.connection.commit()
            return jsonify({'message': 'success'})
        except Exception as e:
            mysql.connection.rollback()
            return jsonify({'message': f"error {str(e)}"} )
        finally:
            cur.close()

    return jsonify({'message': 'redirect to register page'})



@app.route('/bathroomData', methods = ['POST'])
def getBathroomData():
    data = request.json
    longitude = str(data['longitude'])
    latitude = str(data['latitude'])

    url = "https://public-bathrooms.p.rapidapi.com/location"

    querystring = {"lat":latitude,"lng":longitude,"page":"1","per_page":"10","offset":"0","ada":"false","unisex":"false"}

    headers = {
        "X-RapidAPI-Key": "a43aee1125mshe9adfa907a0c0abp1f8148jsn680163386208",
        "X-RapidAPI-Host": "public-bathrooms.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        return jsonify(response.json()) 
    else:
        return jsonify({"error": "Failed to fetch data from the external API"}), 500
    


if __name__ == '__main__':
    app.run(debug=True, port=5001)