import React, { useContext, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./images.css";
import Modal from "./Modal";
import axios from "axios";
import { AuthContext } from "../components/context/authContext";
import { toast } from "react-toastify";

const Images = ({ images, getImages, isLoading, setIsLoading }) => {
  const auth = useContext(AuthContext);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectedImage = images[selectedImageIndex];
  if (images.length === 0) {
    return (
      <div className="text-center text-white font-medium mt-2">
        Ei vielä kuvia.
      </div>
    );
  }

  const handleImageDelete = async (imageKey) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}` + `/images/${imageKey}`,
        {
          headers: {
            Authorization: "Bearer: " + auth.token,
          },
          data: {
            userId: auth.userId,
            imageKey: imageKey,
          },
        }
      );
      await getImages();
      toast.success("Kuva Poistettu");
    } catch (error) {
      console.error("Image delete failed:", error);
      toast.warning(error);
    } finally {
      setShowImageModal(false);
      setIsLoading(false);
    }
  };

  const openImageModal = (type) => {
    setShowImageModal(true);
    setModalType(type);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalType("");
  };

  return (
    <div className="images-container">
      {/* Image delete modal */}
      <Modal
        show={showImageModal}
        onClose={closeImageModal}
        header={modalType === "confirm" ? "Oletko varma?" : "Poista kuva?"}
        onCancel={closeImageModal}
        onDelete={() => handleImageDelete(selectedImage.key)}
        modalType={modalType}
        creator={selectedImage?.key.split("_")[0]}
      >
        <p className="text-white">Vahvista kuvan poisto.</p>
      </Modal>

      <div className="large-image-container flex-col">
        <div className="text-white text-center py-2 bg-gray lg:w-full lg:h-full "></div>

        {selectedImage && (
          <div className="flex">
            <button
              onClick={handlePrevImage}
              className="arrow-button left-arrow"
            >
              <FaArrowLeft size={40} color="white" />
            </button>

            <div className="flex flex-col items-center justify-center">
              <div className="text-white text-center mb-2">
                {selectedImage.key.split("_")[2]}
              </div>

              <img src={selectedImage.url} alt="test" className="large-image" />
            </div>

            <button
              onClick={handleNextImage}
              className="arrow-button right-arrow"
            >
              <FaArrowRight size={40} color="white" />
            </button>
          </div>
        )}
      </div>
      {auth.userId === selectedImage?.key.split("_")[0] && (
        <button
          onClick={openImageModal}
          className="rounded bg-red-500 px-3 py-2 text-white  font-medium mb-4"
        >
          Poista
        </button>
      )}
      <div className="carousel-container">
        {images.length > 0 && (
          <div className="carousel border-dotted p-4 border-2 border-gray-400 rounded-xl">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-32 h-32 flex-shrink-0 flex flex-row justify-center items-center cursor-pointer hover:scale-105 hover:border-2"
                onClick={() => setSelectedImageIndex(index)}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;
