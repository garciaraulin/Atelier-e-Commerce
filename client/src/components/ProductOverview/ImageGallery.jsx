
import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FaCircleArrowRight, FaCircleArrowLeft } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { isValidURL } from './Utils';

const ImageGallery = ({ isDarkMode, selectedStyle, currentStyleId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Image Gallery staff
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [backgroundPositionY, setBackgroundPositionY] = useState('center');
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  if (currentImageIndex > (selectedStyle.photos.length - 1)) {
    setCurrentImageIndex(selectedStyle.photos.length - 1);
  }
  const noImageAvailable = 'https://tse4.mm.bing.net/th/id/OIG4.d5j1eGp1XNI8NlPNgqbR?pid=ImgGn';
  // if(!selectedStyle.photos[currentImageIndex].url){
  //   const recFuncToSetPicIfNoPicAtCurrInx = () => {
  //     if (!selectedStyle.photos[currentImageIndex].url) {
  //       if (!selectedStyle.photos[0].url){
  //         selectedStyle.photos[0].url = 'https://tse4.mm.bing.net/th/id/OIG4.d5j1eGp1XNI8NlPNgqbR?pid=ImgGn';
  //       } else {
  //         setCurrentImageIndex(currentImageIndex -= 1);
  //         return recFuncToSetPicIfNoPicAtCurrInx();
  //       }
  //     }
  //   }
  //   recFuncToSetPicIfNoPicAtCurrInx();
  // }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyActions = {
        ArrowLeft: () => setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0)),
        ArrowUp: () => {/* Handle up arrow key press */},
        ArrowRight: () => setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, selectedStyle.photos.length - 1)),
        ArrowDown: () => {/* Handle down arrow key press */},
      };

      const action = keyActions[event.key];
      if (action) action();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStyle.photos]);

  useEffect(() => {
    setScrollPosition(0);
    // console.log('Use F ing Effectctct')
  }, [selectedStyle]);

  const toggleGallery = () => {
    setIsGalleryExpanded(prevState => !prevState);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageNavigation = (direction) => {
    const length = selectedStyle.photos.length;
    setCurrentImageIndex((prevIndex) =>
      direction === 'prev' ? (prevIndex + length - 1) % length : (prevIndex + 1) % length
    );
    if (currentImageIndex > 5 && scrollPosition < (selectedStyle.photos.length - 7)*71){
      setScrollPosition(scrollPosition + 71);
    }
  };

  const handleImageClick = () => {
    if (isImageExpanded) {
      setIsGalleryExpanded(false); // Toggle gallery expansion
      setIsImageExpanded(false); // Toggle image expansion
    } else {
      setIsImageExpanded(true); // Expand the image
      // console.log('is expanded true')
    }
  };

  const handleMouseMove = (e) => {
    if (isGalleryExpanded && isImageExpanded) {
      const imageContainer = document.querySelector('.p-o-main-image');
      const rect = imageContainer.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      // console.log(mouseY)
      const percentageY = (mouseY / rect.height) * 100;
      setBackgroundPositionY(`${percentageY}%`);
    }
  };
  // const handleWheel = (e) => {
  //   if (isGalleryExpanded && isImageExpanded) {
  //     const imageContainer = document.querySelector('.p-o-main-image');
  //     const rect = imageContainer.getBoundingClientRect();
  //     const deltaY = e.deltaY;
  //     const newPosPercentage = (deltaY / rect.height) * 100;
  //     setBackgroundPositionY(`${newPosPercentage}%`)
  //   }
  // };
  // window.addEventListener('wheel', handleWheel);

  const handleClick = () => {
    if (isGalleryExpanded) {
      handleImageClick(); // If expanded, toggle image size
    } else {
      toggleGallery(); // If not expanded, toggle gallery
    }
  };


  const handleArrowUpClick = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    setScrollPosition(scrollPosition - 71);
    }
  };

  const handleArrowDownClick = () => {
    if (currentImageIndex < selectedStyle.photos.length - 1) {
    setCurrentImageIndex(currentImageIndex + 1)
    if (scrollPosition < (selectedStyle.photos.length - 7)*71){
      setScrollPosition(scrollPosition + 71);
    }
    }
  };
// console.log('selectedStyle.photos.length: ', selectedStyle.photos.length)
  return (
    <>
      {/* Main Image */}
      <span
      className="p-o-main-image"
        // alt={selectedStyle.name}
        alt="main-image"
        data-testid="main-image"
        style={{
          backgroundImage: `url(${
            selectedStyle.photos[currentImageIndex]?.url
              ? isValidURL(selectedStyle.photos[currentImageIndex]?.url)
                ? selectedStyle.photos[currentImageIndex]?.url
                : noImageAvailable
                : noImageAvailable
              // : 'https://placehold.co/600x400/EEE/31343C?font=oswald&text=NO+IMAGE+AVAILABLE'
          })`,
          backgroundColor:isDarkMode ? '#202020' : 'white',
          width: isGalleryExpanded ? '100%' : '63%',
          // cursor: isGalleryExpanded ? 'zoom-in' : 'pointer',
          // backgroundSize: isGalleryExpanded ? 'contain' : 'cover',
          backgroundSize: isGalleryExpanded ? 'cover' : (isImageExpanded ? 'cover' : 'contain'),
          backgroundSize: isImageExpanded ? 'cover' : isGalleryExpanded ? 'contain' : 'cover',
          backgroundPositionY: backgroundPositionY,
          transition: 'all 0.4s ease',
        }}
      ></span>
       {/* Arrow Buttons */}
       <span className="p-o-img-gallery-left-and-right-arrows-container"
               style={{
                width: isGalleryExpanded ? '100%' : '63%',
                // paddingLeft: isGalleryExpanded || selectedStyle.photos.length < 4 ? '20px' : '96px',
                cursor: isGalleryExpanded ? 'zoom-in' : 'zoom-in',
                cursor: isImageExpanded ? 'zoom-out' : 'zoom-in',
                transition: 'all 0.5s ease',
              }}
              onClick={handleClick}
        onMouseMove={handleMouseMove}
       >
      <FaCircleArrowLeft data-testid="left-arrow"
      style={{cursor:'pointer',
      display: currentImageIndex === 0 ? 'none' : 'block',
      left: isGalleryExpanded ? '20px' : selectedStyle.photos.length < 4 ? '20px' : '96px',
      }}
      className={isGalleryExpanded ? 'p-o-img-gallery-left-and-right-arrows-expanded-view' : 'p-o-img-gallery-left-and-right-arrows'}
      onClick={(e) => { e.stopPropagation(); handleImageNavigation('prev'); }}/>
      <FaCircleArrowRight style={{cursor:'pointer',
      display: currentImageIndex === selectedStyle.photos.length - 1 ? 'none' : 'block',
      right: '20px',
    }}
      className={isGalleryExpanded ? 'p-o-img-gallery-left-and-right-arrows-expanded-view' : 'p-o-img-gallery-left-and-right-arrows'}
      onClick={(e) => { e.stopPropagation(); handleImageNavigation('next'); }} />
     </span>
                 {/* Thumbnail navigation images */}
            <span className={isGalleryExpanded ? 'p-o-thumbnails-bottom-container' : 'p-o-thumbnails-left-container'}
            >
            {/* show arrow up if thumbnails are more than 7 and use cliked arrow down and view is not expanded */}
            <IoIosArrowUp style={{
                display: isGalleryExpanded ? 'none' : 'block',
                opacity: currentImageIndex === 0 ? '0' : '1'
                // opacity:selectedStyle.photos.length > 4 ? '1' : '0',
                // opacity: isGalleryExpanded ? '0' : '1',
              }} className="p-o-arrow-up" onClick={handleArrowUpClick} />
            <span className={isGalleryExpanded ? 'p-o-thumbnails-container' : 'p-o-thumbnails-container'}
            style={{
            transform: isGalleryExpanded ? 'none' : `translateY(-${scrollPosition}px)`,
            display: isGalleryExpanded ? 'flex' : 'block',
          }}
            >
                {selectedStyle.photos.map((photo, index) => (
                // {selectedStyle.photos.slice(0, 7).map((photo, index) => (


                <span
                  className={isGalleryExpanded ? 'p-o-thumbnail-bottom-expanded-view' : 'p-o-thumbnail-left'}
                  style={{ backgroundImage: `url(${photo?.thumbnail_url ? isValidURL(photo.thumbnail_url) ? photo.thumbnail_url : 'https://placehold.co/600x400/EEE/31343C?font=oswald&text=NO' : 'https://placehold.co/600x400/EEE/31343C?font=oswald&text=NO'})`,
                  border: currentImageIndex === index ? '2px solid #579dff' : ''}}
                  onClick={() => handleThumbnailClick(index)}
                  alt={`Thumbnail ${index}`}
                  key={index}
                >
                </span>
              ))}
              </span>
            {/* show arrow down if thumbnails are more than 7 and view is not expanded */}
              <IoIosArrowDown style={{
                opacity: selectedStyle.photos.length > 7 ? '1' : '0',
                opacity: currentImageIndex === selectedStyle.photos.length - 1 ? '0' : '1',
                display: isGalleryExpanded || selectedStyle.photos.length - 1 < 6 ? 'none' : 'block',
                // opacity: isGalleryExpanded ? '0' : '1',
              }} className="p-o-arrow-down" onClick={handleArrowDownClick} />

            </span>
    <div className="image-gallery-container"
    style={{
    transition: 'all 0.5s ease',
    }}>
          </div>
          </>
  );
};

export default ImageGallery;