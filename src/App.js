import React, { useState,useEffect } from "react";
import "./style.css";
import dotenv from  'dotenv'
import { storage } from "./config";
import "bootstrap/dist/css/bootstrap.min.css";


export default function App() {
  
  
  const [image, setImage] = useState(null);
  const [allImages, setImages] = useState([]);

  const onImageChange = e => {
    const reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(file);
          setImage(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  useEffect(()=> {
    getFromFirebase()
  },[])

  const uploadToFirebase = () => {
    if (image) {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(image.name);
      imageRef.put(image).then(() => {
        alert("Image uploaded successfully to Firebase.");
      });
    } else {
      alert("Please upload an image first.");
    }
  };

  const getFromFirebase = () => {
    let storageRef = storage.ref();
    storageRef
      .listAll()
      .then(function(res) {
        res.items.forEach(imageRef => {
          imageRef.getDownloadURL().then(url => {
            setImages(allImages => [...allImages, url]);
          });
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const deleteFromFirebase = url => {
    let pictureRef = storage.refFromURL(url);

    pictureRef
      .delete()
      .then(() => {
        setImages(allImages.filter(image => image !== url));
        alert("Picture is deleted successfully!");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="container py-3 mx-auto">
      <div className="d-flex flex-column align-items-center">
        <input
          name="uploadfile"
          id="img"
          className="d-none"
          type="file"
          accept="image/x-png,image/jpeg"
          onChange={e => {
            onImageChange(e);
          }}
        />

        <label className="btn btn-dark my-2" htmlFor="img">
          Click me to upload image
        </label>

        <button
          className="btn btn-dark my-2"
          onClick={() => {
            uploadToFirebase();
            getFromFirebase();
          }}
          type="submit"
        >
          Upload to Firebase
        </button>
        <button
          className="btn btn-dark my-2"
          onClick={() => {
            getFromFirebase();
          }}
          type="submit"
        >
          Get Images From Firebase
        </button>

        <div className="row">
          {allImages.map((image, index) => {
            return (
              <div
                key={index}
                className="my-3 mx-auto mt-auto col-sm-6 col-md-4 col-lg-3"
              >
                <div className="card">
                  <a
                    href={image}
                    alt="Click for Original Size"
                    target="_blank"
                  >
                    <img className="img-fluid" src={image} alt="" />
                  </a>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteFromFirebase(image)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
