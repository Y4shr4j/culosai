
import React from "react";
import Masonry from "react-masonry-css";
import "./ImageGallery.css"; // Import the CSS

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const ImageGallery = ({ images, unlockedImages, unlockImage }) => (
  <Masonry
    breakpointCols={breakpointColumnsObj}
    className="gallery-grid"
    columnClassName="gallery-grid_column"
  >
    {images.map((image) => {
      const userHasUnlocked = unlockedImages.includes(image._id);
      return (
        <div className="image-card" key={image._id}>
          <img
            src={image.url}
            className={image.blurred && !userHasUnlocked ? "blurred" : ""}
            alt="Gallery"
          />
          {image.blurred && !userHasUnlocked && (
            <button onClick={() => unlockImage(image._id)}>
              Unlock for 1 token
            </button>
          )}
        </div>
      );
    })}
  </Masonry>
);

export default ImageGallery;

