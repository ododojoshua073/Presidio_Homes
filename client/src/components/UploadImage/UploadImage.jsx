import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./UploadImage.css";
import { Button, Group } from "@mantine/core";

const UploadImage = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
}) => {
  const [imageURLs, setImageURLs] = useState(propertyDetails.images || []);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const handleNext = () => {
    setPropertyDetails((prev) => ({ ...prev, images: imageURLs }));
    nextStep();
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dj0wrjtg2",
        uploadPreset: "realestate",
        multiple: true,
        maxFiles: 10,
      },
      (err, result) => {
        if (result.event === "success") {
          setImageURLs((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  }, []);

  return (
    <div className="flexColCenter uploadWrapper">
      <div
        className="flexColCenter uploadZone"
        onClick={() => widgetRef.current?.open()}
      >
        <AiOutlineCloudUpload size={50} color="grey" />
        <span>Click to Upload Image{imageURLs.length !== 1 && "s"}</span>
      </div>

      {imageURLs.length > 0 && (
        <div className="uploadedImages">
          {imageURLs.map((url, index) => (
            <div className="uploadedImage" key={index}>
              <img src={url} alt={`Uploaded ${index}`} />
            </div>
          ))}
        </div>
      )}

      <Group position="center" mt={"xl"}>
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={imageURLs.length === 0}>
          Next
        </Button>
      </Group>
    </div>
  );
};

export default UploadImage;
