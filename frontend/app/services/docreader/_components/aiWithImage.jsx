"use client"

// import { useState, useEffect } from "react";
// import { getBase64 } from './helper/imageHelper';
// import Popup from './Modal'
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Image from "next/image";



// const AiWithImage = () => {

//    useEffect(()=>{
//       fetch("http://127.0.0.1:5000/api/home").then(
//         res=>res.json()
//       ).then((data)=>{
//         console.log(data)
//       })
//     },[])

//   const apiKey= process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

// if (!apiKey) {
//   console.error("API Key is not defined. Check your .env.local file.");
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// const [imageInlineData, setImageInlineData] = useState("");
// const [image, setImage] = useState("");
// const [airesponse, setResponse] = useState("");
// const [openModal,setOpenModal]=useState(false)
// const [loading,setLoading]=useState(false)


// useEffect(() => {
//   if (!openModal) {
//     setImage("");           
//     setResponse("");         
//     setImageInlineData("");  
//   }
// }, [openModal]); 



// async function aiImageRun() {
//   setResponse(""); 

//   setLoading(true)

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   try {
//     const result = await model.generateContent([
//       { text: "Extract the English text from the image, otherwise return 'OOPS, NO TEXT DETECTED'." },
//       imageInlineData, 
//     ]);

//     const response = await result.response;
//     const text = await response.text(); 
//     console.log("AI Response:", text);
//     setResponse(text);
    
//   } catch (error) {
//     console.error("Error in AI processing:", error);
//   }
//   setLoading(false)
// }

// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   try {
//     const base64Image = await getBase64(file);
//     setImage(base64Image);

//     const imageInlineData = await fileToGenerativePart(file);
//     setImageInlineData(imageInlineData);
//     setOpenModal(true);
//   } catch (error) {
//     console.error("Error handling image:", error);
//   }
// };

// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// }

// async function fileToGenerativePart(file) {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result.split(",")[1]; 
//       resolve({
//         inlineData: {
//           data: base64String,
//           mimeType: file.type, 
//         },
//       });
//     };
//     reader.readAsDataURL(file);
//   });
// }


//   return (

//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
//       <div className="relative">
//         <form method="POST" encType="multipart/form-data">

//         <h1>Upload an Image for Prediction</h1>
//         <input type="file" name="image" accept="image/*" required/>
//         <br/>
//         <br/>
//         <input type="submit" value="Predict"/>

//         </form>

//       </div>
      
//       {image&&<Popup loading={loading} image={image} toggle={setOpenModal} extract={aiImageRun}  view={openModal} aiResponse={airesponse} />}
//     </div>
//   );
// };

// export default AiWithImage;

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
    setPrediction(""); // Clear prediction on modal close
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



