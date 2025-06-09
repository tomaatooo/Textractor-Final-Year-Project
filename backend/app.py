from flask_cors import CORS
import cv2
import typing
import numpy as np
import pandas as pd
from tqdm import tqdm
from mltu.configs import BaseModelConfigs
from flask import Flask, jsonify, request
from PIL import Image

from mltu.inferenceModel import OnnxInferenceModel
from mltu.utils.text_utils import ctc_decoder, get_cer, get_wer
from mltu.transformers import ImageResizer

class ImageToWordModel(OnnxInferenceModel):
    def __init__(self, char_list: typing.Union[str, list], *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.char_list = char_list

    def predict(self, image: np.ndarray):
        image = ImageResizer.resize_maintaining_aspect_ratio(image, *self.input_shapes[0][1:3][::-1])

        image_pred = np.expand_dims(image, axis=0).astype(np.float32)

        preds = self.model.run(self.output_names, {self.input_names[0]: image_pred})[0]

        text = ctc_decoder(preds, self.char_list)[0]

        return text


    
app = Flask(__name__)
CORS(app,origins=["http://localhost:3000"])

@app.route("/predict", methods=["POST"])
def index():
    prediction_text=None
    configs = BaseModelConfigs.load("configs.yaml")

    model = ImageToWordModel(model_path="./", char_list=configs.vocab)
    if request.method == 'POST':
        file = request.files['image']
        if file:
            image = Image.open(file.stream).convert("RGB")
            image_np = np.array(image)

            prediction_text = model.predict(image_np)
            print(prediction_text)

    return jsonify({"prediction": prediction_text})

if __name__ == '__main__':
    app.run(debug=True)

    

    



