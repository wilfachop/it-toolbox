from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "test Page 18"

@app.route("/hello")
def hello():
    return "Hello world"


if __name__ == "__main__":
    app.run(debug=True)
