"use client"


import { useState } from "react";
import Popup from './Modal';

export default function AiWithImage() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setShowModal(true);
      setPrediction(""); // Clear previous prediction on new image upload
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data.prediction || data.error || "No response");
    } catch (err) {
      console.error("Error:", err);
      setPrediction("Error during prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPrediction(""); 
  };

  return (
    <div className="text-center mt-10">
      <input
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        id="upload"
        className="hidden"
        onChange={handleImageChange}
      />
      <label
        htmlFor="upload"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer"
      >
        Upload Image
      </label>

      {showModal && (
        <Popup
          loading={loading}
          predict={handleSubmit}
          image={imagePreview}
          toggle={handleCloseModal}
          view={showModal}
          aiResponse={prediction}
        />
      )}
    </div>
  );
}



