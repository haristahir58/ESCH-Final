import React, { useState, useEffect, useContext  } from 'react';
import { useCart } from '../Cart/CartContext';
import Navbar from '../../../Sole Distributor/Components/navbar/Navbar';
import Sidebar from '../../../Sole Distributor/Components/Sidebar/SoleSidebar';
import './soleProduct.scss';

const SoleProduct = () => {

  const { dispatch } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (products) => {
    // Generate a unique ID for the cart item
    const uniqueId = generateUniqueId();

    // Dispatch the ADD_TO_CART action with the product item and unique ID
    dispatch({ type: 'ADD_TO_CART', payload: { ...products, id: uniqueId } });
  };

  // Function to generate a unique ID (you can use UUID or another method)
  const generateUniqueId = () => {
    // Implement your unique ID generation logic here (e.g., UUID)
    // For simplicity, you can use a random number for demonstration
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <>
      <div className="list">
        <Sidebar />
        <div className="listContainer">
          <Navbar />
          <div className="cardContainer1">
            {products.map((item) => (
              <div key={item._id} className="card1">
                <div className="cardImage">
                  <img src={`http://localhost:4000/${item?.imageUrl}`} alt={item.title} />
                </div>
                <div className="cardTitle1">
                  {item.title}
                </div>
                <div className="cardText">
                  {item.description}
                </div>
                <div className="cardText1">
                  Rs. {item.price}
                </div>
                <div className='btn5'>
                  <button
                    className="addToCartButton"
                    onClick={() => addToCart(item)} // Call addToCart with the product item
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SoleProduct;
