import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Loading from './Loading.js';
import fetchData from './fetchData.js';
import ProductInformation from './ProductInformation.jsx';
import Styles from './Styles.jsx';
import SelectOptions from './SelectOptions.jsx';
import SloganDescFeat from './SloganDescFeat.jsx';
import Modal from './Modal.jsx';
import { ErrorMessages } from './Utils';
import axios from 'axios';
const ImageGallery = lazy(() => import('./ImageGallery.jsx'));
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaFacebookSquare, FaPinterestSquare, FaCheck, FaHeart } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import PropTypes from 'prop-types'; // PropTypes to validate... Prop Types

// ProductOverview Component
const ProductOverview = ({ isDarkMode, setCartData, id, authKey, onClickReadAllReviews }) => {
  // console.log('isDarkMode', isDarkMode)
  // console.log('authKey', authKey)
  // ProductOverview.propTypes = {
  //   id: PropTypes.number.isRequired, // Assuming id is a number, adjust as needed
  //   setCartData: PropTypes.func.isRequired,
  //   // Add more PropTypes validations for other props if needed
  // };

  // State variables for product, styles, reviews, selected style, and current style id
  const [productData, setProductData] = useState(null);
  const [stylesData, setStylesData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);

  const [selectedStyle, setSelectedStyle] = useState(null);
  const [currentStyleId, setCurrentStyleId] = useState(null);
  // State variables for available sizes and quantity
  // const [availableSizes, setAvailableSizes] = useState([]);
  const [availableQuantities, setavailableQuantities] = useState([]);

  // State variable for error messages - separate this eventually
  const [errorMessages, setErrorMessages] = useState([]);

  // for API error messages
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // State variable to track the selected quantity, default is "-"
  const [selectedQuantity, setSelectedQuantity] = useState('-');
  const [selectedSize, setSelectedSize] = useState('');

  // to trigger the opening the select size menu option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State of California LA... SKU and cart stuff
  const [currentSKUs, setCurrentSKUs] = useState([]);
  const [SKU, setSKU] = useState('');
  // const [cartDataUpdated, setCartDataUpdated] = useState(false);

  // ref for select size option (trying to make it to open in add to cart button click and no size is selected)
  const selectSizeRef = useRef(null);

  // to many state variables, wonder if I can combine them
  const [showModalCartItem, setShowModalCartItem] = useState(false);

  // state variable to show loading icon in add to cart button
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Like Product stuff
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked((prevState) => !prevState);
  };

  // Fetching data from API on component mount
  useEffect(() => {
      // Call fetchData function
      fetchData(
        id,
        authKey,
        setProductData,
        setStylesData,
        setReviewsData,
        setCurrentStyleId,
        setSelectedStyle,
        setavailableQuantities,
        setCurrentSKUs,
        setErrorMessage,
        setError
      ).catch(error => {
        // Handle errors gracefully
        console.error('Error fetching data:', error);
        setError(true);
        setErrorMessage('An error occurred while fetching data. Please try again later.');
      });
      // console.log('Rendering...');
  }, [id]);

  // Function to handle style change from the Styles component
  const handleStyleChange = (styleId) => {
    if (styleId !== currentStyleId) {
      setCurrentStyleId(styleId);
      // set the style selected data to pass it to the ProductInformation component
      setSelectedStyle(stylesData.results.find(style => style.style_id === styleId));
      // set the sizes data to pass it to the SelectOptions component
      // setAvailableSizes(Object.values(selectedStyle.skus).map(sku => sku.size));
      setCurrentSKUs(
      Object.entries(selectedStyle.skus).map(sku => sku));
      // set available quantity for current style to pass it to the SelectOptions component
      const quantities = Object.values(selectedStyle.skus).map(sku => sku.quantity);
      const totalQuantity = quantities.length > 0 ? Math.min(...quantities) : 0;
      setavailableQuantities(totalQuantity);
    }
  };

  // Funtion to handle change on size selection
  const handleSizeSelection = (e) => {
    // set the SKU on size selection to use it in the cart
    setSKU(e.target.selectedOptions[0].getAttribute('sku'));
    // set current selected size
    setSelectedSize(e.target.value);
    if (e.target.value === 'selectSize') {
      setSelectedQuantity('-');
    } else {
      setSelectedQuantity('1');
    }
    setErrorMessages([]);
    setIsDropdownOpen(false)
  };



  const handleShareClick = (platform) => {
    alert(`Sharing product SKU ${currentStyleId} on ${platform}`);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const { value: selectedSize } = selectSizeRef.current;
    // Validate selected size and quantity
    if (selectedSize === "selectSize" || selectedSize.trim() === "") {
      setErrorMessages(["Please select size"]);
      selectSizeRef.current.focus();
      setIsDropdownOpen(true)
      setIsAddingToCart(false);
      return;
    }
    if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
      setErrorMessages(["Please select a valid quantity"]);
      setIsAddingToCart(false);
      return;
    }

    // Clear any existing error messages
    setErrorMessages([]);

    const newCartItem = {
      sku_id: SKU,
      size: selectedSize,
      count: selectedQuantity,
    };

    // Add item to the cart
    axios
      .post("https://app-hrsei-api.herokuapp.com/api/fec2/rfp/cart", newCartItem, authKey)
      .then((response) => {
        // setCartDataUpdated(true);

        // Update cart data
        setCartData((prevCartData) => {
          let newCartItemIndex = prevCartData.findIndex((item) => item.sku_id === newCartItem.sku_id,);
          let modalTitle = newCartItemIndex > -1 ? "Cart Updated" : "Success";
          let modalText =
            newCartItemIndex > -1
              ? `${selectedStyle.name} SKU:${SKU} quantity updated successfully`
              : `${selectedStyle.name} SKU:${SKU} Size:${selectedSize} added to the cart`;
          // Show modal with dynamic content
          setShowModalCartItem({ title: modalTitle, text: modalText });
            // Reset showModalCartItem to false after a certain duration
            setTimeout(() => {
              setShowModalCartItem(false);
            }, 4000); // Adjust the duration as needed
          if (newCartItemIndex > -1) {
            // If item already exists, update its count
            let updatedCart = [...prevCartData];
            updatedCart[newCartItemIndex].count += selectedQuantity;
            return updatedCart;
          } else {
            // If item doesn't exist, add it to the cart
            return [...prevCartData, newCartItem];
          }
        });
        return { success: true, response: response.data };
        // console.log(
        //   `${selectedQuantity} of size ${selectedSize} SKU ${currentStyleId} added to the cart. API RESPONSE: `,
        //   response.data
        // );
      })
      .catch((error) => {
        // Handle errors
        return { success: false, error: error.message };
        console.error("Error adding item to cart:", error);
      }).finally(() => {
        setIsAddingToCart(false); // Reset the state once the cart addition process is complete
      });
  };


  // Rendering loading message if data is not available
  if (!productData || !stylesData || !reviewsData || !selectedStyle) {
    return <div data-testid="loading-container" className="loading-container"><AiOutlineLoading3Quarters className="rotate" /> Loading...</div>;
  }

  // Props for select option elements
  const selectOptionsProps = {
    // availableSizes,
    availableQuantities,
    handleSizeSelection,
    selectedQuantity,
    setSelectedQuantity,
    selectedSize,
    setErrorMessages,
    selectSizeRef,
    currentSKUs,
    isDropdownOpen,
  };

  // Rendering ProductOverview Module
  return (
    <>
    {/* Conditionally render error messages */}
    {error && <div className="error-message">{errorMessage}</div>}
    {/* Molda component */}
    {showModalCartItem && (
      <Modal
        size="small"
        title={showModalCartItem.title}
        text={showModalCartItem.text}
        closeAfter={3}
        autoClose={true}
        autoOpen={true}
        color="#333"
        iconCenter={<FaCheck />}
        iconSize={40}
        iconColor="#16FFFF"
      />)}
        {/* Main container for product overview module */}
      <div className="product-overview-module">
          {/* Loading Placeholder text */}
      <span className="temp-placeholder"><AiOutlineLoading3Quarters className="rotate" /> Loading... <br></br>Finger-licking good content coming your way! 🍗</span>

          {/* Gallery Images component*/}
          <Suspense fallback={<Loading />}>
        <ImageGallery isDarkMode={isDarkMode} selectedStyle={selectedStyle} currentStyleId={currentStyleId} />
          </Suspense>

           {/* Product Details */}
        <div className="product-details-container">
          {/* Product Information component*/}
          <ProductInformation
           isDarkMode={isDarkMode}
            productData={productData}
            reviewsData={reviewsData}
            onClickReadAllReviews={onClickReadAllReviews}
            selectedStyle={selectedStyle}
          />
          {/* Social media sharing - Facebook, x, Pinterest*/}
          <div className={`social-media-sharing ${isDarkMode ? 'dark-mode-text' : ''}`}>
          Share <span className="social-media-icons">
          <FaFacebookSquare data-testid="facebook-icon" onClick={() => handleShareClick('Facebook')} />
          <FaSquareXTwitter data-testid="twitter-icon" onClick={() => handleShareClick('Twitter')} />
          <FaPinterestSquare data-testid="pinterest-icon" onClick={() => handleShareClick('Pinterest')} />
          </span></div>
          {/* Style Selector component- Thumbnails for each style */}
          <Styles
            styles={stylesData.results}
            currentStyleId={currentStyleId}
            handleStyleChange={handleStyleChange}
          />
          {/* Size, Quantity Selector component and error messages */}
          {errorMessages.length > 0 && <ErrorMessages messages={errorMessages} />}
          <SelectOptions {...selectOptionsProps} />
          {/* Add to Cart and like buttons */}
          <div className="add-to-cart-and-like">
            <button className="p-o-add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isAddingToCart || availableQuantities <= 0}>
              {isAddingToCart ? (
                <AiOutlineLoading3Quarters className="rotate" />
              ) : (
                "ADD TO CART"
              )}
            </button>
            <button
              data-testid="like-button"
              className="p-o-like-button"
              onClick={handleLikeClick}
              style={{ color: isLiked ? '#F4493C' : 'inherit' }}>
              <FaHeart style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>
      </div>
      {/* Product Slogan, Description and Features component*/}
      <SloganDescFeat isDarkMode={isDarkMode} productData={productData} />
    </>
  );
};

export default ProductOverview;
