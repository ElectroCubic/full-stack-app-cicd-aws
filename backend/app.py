
# Anush Bundel 2023BCS0005

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/student-details')
def student():
    return jsonify({
        "name": "Anush Bundel",
        "roll": "2023BCS0005",
        "register": "2023 Batch 2"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
