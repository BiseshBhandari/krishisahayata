from flask import Flask, request, jsonify
import pickle
import pandas as pd

with open("fruit_recommendation_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("label_encoder.pkl", "rb") as encoder_file:
    label_encoder = pickle.load(encoder_file)

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        input_data = pd.DataFrame(
            [[data["temperature"], data["humidity"], data["ph"], data["rainfall"]]],
            columns=["temperature", "humidity", "ph", "rainfall"],
        )
        prediction = model.predict(input_data)

        predicted_label = label_encoder.inverse_transform(prediction)[0]

        return jsonify({"recommended_fruit": predicted_label})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
