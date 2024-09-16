import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Cart from '../components/Cart';
import CommentSection from '../components/Comments'; // Import the CommentSection component
import { useStoreContext } from '../utils/GlobalState';
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
} from '../utils/actions';
import { QUERY_PRODUCT_BY_ID } from '../utils/queries'; // Use QUERY_PRODUCT_BY_ID instead of QUERY_PRODUCTS
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import AuthService from '../utils/auth'; // Import AuthService

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();
  const { cart } = state;

  // Fetch the specific product using the productId from the URL
  const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, {
    variables: { id },
  });

  const [currentProduct, setCurrentProduct] = useState({});

  // Check if user is logged in using AuthService
  const isLoggedIn = AuthService.loggedIn();

  useEffect(() => {
    if (data) {
      const product = data.product;

      // Save product data in local state
      setCurrentProduct({
        image: product.image,
        name: product.name,
        _id: product._id,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        comments: product.comments || [], // Set comments if they exist
      });

      // Add product to IndexedDB for offline access
      idbPromise('products', 'put', product);
    } else if (!loading) {
      // Fallback to IndexedDB if loading fails
      idbPromise('products', 'get').then((indexedProducts) => {
        const product = indexedProducts.find((product) => product._id === id);
        if (product) {
          setCurrentProduct(product);
        }
      });
    }
  }, [data, loading, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });

    idbPromise('cart', 'delete', { ...currentProduct });
  };

  if (loading) return <img src={spinner} alt="loading" />;
  if (error) return <p>Error loading product details.</p>;

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <h3>{currentProduct.description}</h3>

          <p>
            <strong>Price:</strong> ${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />

          {/* Pass the comments and isLoggedIn prop to CommentSection */}
          <CommentSection comments={currentProduct.comments} isLoggedIn={isLoggedIn} />
        </div>
      ) : null}
      <Cart />
    </>
  );
}

export default Detail;