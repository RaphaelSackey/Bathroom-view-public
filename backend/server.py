from flask import Flask, request, jsonify
import requests
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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
    app.run(debug=False, port=5001)