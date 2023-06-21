import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/authContext";
import Images from "../Ui/Images";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { toast } from "react-toastify";
import { useCallback } from "react";

const Gallery = () => {
  const auth = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [imageName, setImageName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);

  const getImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/images`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      const fetchedImages = response.data;
      setImages(fetchedImages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setIsLoading(false);
      throw new Error("Failed to fetch images");
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const handleImageUpload = async () => {
    setIsLoading(true);
    if (!selectedImage) {
      console.error("No image selected.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("name", imageName);
    formData.append("userId",auth.userId)
    formData.append("username",auth.name)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}` + "/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer: " + auth.token,
          },
        }
      );

      await getImages();
      resetForm();
      toast.success("Kuva lisätty")
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setImageName("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const formBorderStyle = showForm ? "border" : "";
  return (
    <div className="flex items-center justify-center flex-col mt-28  lg:mt-28">
      {isLoading && <LoadingSpinner />}
      <div>
        <h1 className="text-4xl ml-4 lg:ml-0 lg:mb-5 text-white mb-4 ">
          Galleria
        </h1>
        <div className="text-md text-white mb-10 text-center">
          Tällä sivulla voit selata kuvia kukkarista ja lisätä halutessa uusia
          kuvia.
        </div>
      </div>{" "}
      {!showForm && (
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            Lisää kuva
          </button>
        </div>
      )}
      <div className={`shadow-lg bg-gray-900 ${formBorderStyle}  rounded-2xl`}>
        {showForm && (
          <div className="flex flex-col items-center p-8 gap-4">
            <h1 className=" text-white text-xl mb-14">Lisää kuva</h1>
            <div className="mb-4">
              <div className="flex-col flex">
                <label htmlFor="imageName" className="text-white mb-1">
                  Kuvaus:
                </label>
                <input
                  type="text"
                  id="imageName"
                  className="px-2  py-1 border border-gray-600 rounded bg-gray-800 text-white"
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex-col flex ">
                <input
                  type="file"
                  id="imageFile"
                  ref={fileInputRef}
                  className="hidden"
               
                  onInput={handleFileSelect}
                  accept="image/*"
                  name="image"
                />
              </div>
              <label
                htmlFor="imageFile"
                className="px-4 py-2 bg-gray-800 text-white cursor-pointer rounded hover:bg-gray-300"
              >
                Valitse kuva
              </label>
              {selectedImage && (
                <div className="flex items-center flex-col justify-center mt-10">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded"
                  />

                  <p className=" text-white mt-2 text-center">{imageName}</p>
                </div>
              )}
            </div>
            <div className="flex ">
              <button
                onClick={resetForm}
                className="mr-2 px-4 py-2 bg-gray-900 text-white rounded border-gray-300 border hover:bg-gray-300"
              >
                Peruuta
              </button>
              {selectedImage && !isLoading &&  (
                <button
                  onClick={handleImageUpload}
                  className="px-4 py-2 bg-gray-900 text-white rounded border-gray-300 border hover:bg-gray-300"
                >
                  Lähetä kuva
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Images images={images} getImages={getImages} isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
};

export default Gallery;
