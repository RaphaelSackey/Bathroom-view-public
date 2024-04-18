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



@app.route('/validSession', methods = ['GET']) 
def validSession():
    if 'user_id' not in session:
        return jsonify({'message': 'invalid'})
    
    return jsonify({'message': 'valid'})

@app.route('/addComment', methods = ['POST'])  
def addComment():
    if 'user_id' not in session:
        return jsonify({'message': 'not logged in'})
    
    data = request.json 
    restaurantId = data.get('restaurantId')
    comment = data.get('comment')

    try:
        cur = mysql.connection.cursor()
        cur.execute('INSERT INTO comments (user_id, bathroom_id, comment ) VALUES (%s, %s, %s)', (session['user_id'], restaurantId, comment))
        mysql.connection.commit()
        return jsonify({'message': 'success'})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'message': f"error {str(e)}"} )
    finally:
        cur.close()


@app.route('/getComments', methods = ['POST'])
def getComments():
    data = request.json 
    id = data.get('bathroomId')

    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT comments.comment, user.username FROM comments JOIN user ON comments.user_id = user.id WHERE comments.bathroom_id = %s', (id,))
        response = response = cur.fetchall()
        return jsonify({'message': 'success',
                        'data': response
                        } )
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'message': f"error {str(e)}"} )
    finally:
        cur.close()

@app.route('/addToViewed', methods = ['POST'])
def viewed():
    if 'user_id' not in session:
        return jsonify ({'message': 'success'})
    data = request.json
    counter = 1
    for data in data:
        if counter <= 5:
            bathroom_name = data['name']
            address = data['street'] + " " + data['city']+ " " + data['state']
            user_id = session['user_id']
            bathroomId =  data['id']
            unisex = data['unisex']
            accessible = data['accessible']
            try:
                cur = mysql.connection.cursor()
                cur.execute('insert into viewed (user_id, bathroom_id, bathroom_name, address, unisex, access) values (%s, %s, %s, %s, %s, %s)', (user_id, bathroomId, bathroom_name, address, unisex,accessible))
                mysql.connection.commit()
                counter += 1
            except Exception as e:
                mysql.connection.rollback()
                return jsonify({'message': f"error {str(e)}"} )
            finally:
                cur.close()
        else:
            break
        
    return jsonify ({'message': 'success'})



@app.route('/getRecentViewed', methods = ['GET'])
def getRecentViewed():
     try:
        cur = mysql.connection.cursor()
        query = """
            SELECT v.bathroom_id, v.bathroom_name, v.address, v.unisex, v.access, u.username
            FROM viewed AS v
            JOIN user AS u ON v.user_id = u.id
            WHERE v.user_id = %s
            ORDER BY v.id DESC
            LIMIT 5
        """
        cur.execute(query, (session['user_id'],))
        results = cur.fetchall()
        return {
                'data': results,
                'message': 'success'
                }
     except Exception as e:
                mysql.connection.rollback()
                return jsonify({'message': f"error {str(e)}"} )
     finally:
            cur.close()

    


@app.route('/addToVisited', methods = ['POST'])
def visited():
    if 'user_id' not in session:
        return jsonify ({'message': 'success'})
    
    data = request.json
    bathroom_name = data[0]['name']
    address = data[0]['street'] + " " + data[0]['city']+ " " + data[0]['state']
    user_id = session['user_id']
    bathroomId =  data[0]['id']
    unisex = data[0]['unisex']
    accessible = data[0]['accessible']
    try:
        cur = mysql.connection.cursor()
        cur.execute('insert into visited (user_id, bathroom_id, bathroom_name, address, unisex, access) values (%s, %s, %s, %s, %s, %s)', (user_id, bathroomId, bathroom_name, address, unisex,accessible))
        mysql.connection.commit()
        return jsonify ({'message': 'success'})
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'message': f"error {str(e)}"} )
    finally:
        cur.close()


@app.route('/getVisited', methods = ['GET'])
def getRecentVisited():
     try:
        cur = mysql.connection.cursor()
        query = """
            SELECT v.bathroom_id, v.bathroom_name, v.address, v.unisex, v.access
            FROM visited AS v
            WHERE v.user_id = %s
            ORDER BY v.id DESC
            LIMIT 5
        """
        cur.execute(query, (session['user_id'],))
        results = cur.fetchall()
        return {
                'data': results,
                'message': 'success'
                }
     except Exception as e:
                mysql.connection.rollback()
                return jsonify({'message': f"error {str(e)}"} )
     finally:
            cur.close()

    



    

if __name__ == '__main__':
    app.run(debug=True, port=5001)