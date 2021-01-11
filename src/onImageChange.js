import React, { useState } from "react";

export function onImageChange(e) {
  const [image, setImage] = useState(null);
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
}
