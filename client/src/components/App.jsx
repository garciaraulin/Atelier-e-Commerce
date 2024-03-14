//client/components/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import { PiBagBold } from "react-icons/pi";
import ProductOverview from './ProductOverview/ProductOverview.jsx';
import Related from './Related_Items/Related.jsx';
import RatingsAndReviews from './RatingsAndReviews/RatingsAndReviews.jsx';
import QuestionsAndAnswers from './QuestionsAndAnswers/QuestionsAndAnswers.jsx';
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { MdDarkMode } from "react-icons/md";
import { LuSun } from "react-icons/lu";
const App = () => {
  //-------------------------------------------------------
  // Shared App states and variables
  //-------------------------------------------------------
  const [productID, setProductID] = useState(65631);
  const [productData, setproductData] = useState({});
  const [cartData, setCartData] = useState([]);
  const [relatedIDs, setRelatedIDs] = useState([]);
  const [pageItemBulk, setPageItemBulk] = useState({});
  const [relatedItems, setRelatedItems] = useState([]);
  const ratingsAndReviewsRef = useRef(null); // to scroll down to ratings and reviews from product overview
    // State to track the current mode (true for dark mode, false for light mode)
   const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    updateMainCss(isDarkMode);
  };

  // Function and variables to update CSS properties based on dark or light mode
  const containerStyle = {
    border: '1px solid ' + (isDarkMode ? 'rgb(255 255 255 / 30%)' : '#ccc'),
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: isDarkMode ? 'rgb(51 51 51 / 23%)' : '#fff',
    color: isDarkMode ? '#fff' : '#333',
  };

  const updateMainCss = (isDarkMode) => {
    const body = document.querySelector('body');

    if (!isDarkMode) {
      body.style.backgroundColor = '#1a1a1a';
      body.style.color = 'white !important';
    } else {
      body.style.backgroundColor = 'white';
    }
  };
  //-------------------------------------------------------
  // Functions
  //-------------------------------------------------------
  // function to scroll down to ratings and reviews on 'read all reviews click'
  const scrollToRatingsAndReviews = () => {
    ratingsAndReviewsRef.current.scrollToRatingsAndReviews();
  };

  const changeID = function (val) {
    setProductID(val);
  }
  //-------------------------------------------------------
  // Use Effect & relevant objects
  //-------------------------------------------------------
  const token = {
    headers: {
      'Authorization': process.env.REACT_APP_API_KEY,
    }
  };
    // Product and Cart UseEffect
  useEffect(() => {
    // Fetching data using Promise.all
    Promise.all([
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${productID}`, token),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/cart?session_id=${productID}`, token),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${productID}/related`, token),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/meta/?product_id=${productID}`,token),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${productID}/styles`, token)
    ])
      .then(([productResponse, cartResponse, relatedResponse, metaResponse, stylesResponse]) => {
        setproductData(productResponse.data);
        setCartData(cartResponse.data);
        setRelatedIDs(relatedResponse.data);
        let pageItem = {product: productResponse.data, meta: metaResponse.data, styles: stylesResponse.data}
        setPageItemBulk(pageItem);
      })
      .catch((err) => {
      console.log('Error retrieving data', err);
      // Fallback
      alert('We couldn\'t find what you are looking for... Let\'s try getting the Camo Onesie Jacket product id: 65631 ^_^')
      setProductID(65631);
      })
  }, [productID]);

  useEffect(() => {
    setRelatedItems([]);
    if (relatedIDs.length !== 0) {
      let currentCallIndex = 0;
      let result = [];
      const callback = function () {
        let item = {};
        Promise.all([
          axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${relatedIDs[currentCallIndex]}`, token),
          axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/reviews/meta/?product_id=${relatedIDs[currentCallIndex]}`, token),
          axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/rfp/products/${relatedIDs[currentCallIndex]}/styles`, token)
        ])
          .then(([product, meta, styles]) => {
            item.product = product.data;
            item.meta = meta.data;
            item.styles = styles.data;
            result.push(item);
            currentCallIndex ++;
          })
          .then(() => {
            if (currentCallIndex === relatedIDs.length) {
              setRelatedItems(result)
            } else {
              callback();
            }
          })
      }
      callback();
    }
  }, [relatedIDs])

  const handleSearch = (e) => {
    const inputValue = document.getElementById('searchInput').value || 65631;
    setProductID(parseInt(inputValue));
  }

  return (
    <div className="main-container">
      {/* Logo and search input, fake stuff to make it look more real */}
      <div className={`widget-container nav-bar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}><h1 className="logo-container"><HiOutlineBuildingStorefront /> <b className="logo-text">KFC Logo</b></h1>
      <i><i className={`dark-mode-toggle ${isDarkMode}`} onClick={toggleDarkMode}>
      {isDarkMode ? <LuSun className="dark-mode-icon" /> : <MdDarkMode className="dark-mode-icon" />}
    </i><span className="fake-search"> <input id="searchInput" placeholder="Search" />
      <IoSearch className="searchIcon" onClick={handleSearch} /></span>
      <PiBagBold className="cartIcon" /></i> {cartData.length > 0 && (<span className="cart-info-icon">{cartData.length}</span>)}</div>
      <div className="global-announsment">
          <i>SITE-WIDE ANNOUSNMENT MESSAGE &mdash;  SALE /&nbsp;</i> DISCOUNT <b>&nbsp;OFFER &nbsp;</b> &mdash;  <u>&nbsp;NEW PRODUCT HIGHLIGHT</u>
      </div>

      <div className="widget-container p-o" style={containerStyle}><ProductOverview setCartData={setCartData} isDarkMode={isDarkMode} pDataBulk={pageItemBulk} authKey={token} id={productID} onClickReadAllReviews={scrollToRatingsAndReviews}/></div>
      <div className="widget-container r-i-container" style={containerStyle}><Related id={productID} product={productData} productBulk={pageItemBulk} data={relatedItems} setID={changeID}/></div>
      <div className="widget-container" style={containerStyle}><RatingsAndReviews id={productID} token={token} ref={ratingsAndReviewsRef}/></div>
      <div className="widget-container" style={containerStyle}><QuestionsAndAnswers id={productID} token={token} productData={productData}/></div>
    </div>
  );
};

export default App;