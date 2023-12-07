import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../Sole Distributor/Components/navbar/Navbar';
import Sidebar from '../../../Sole Distributor/Components/Sidebar/SoleSidebar';


const BuyedProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('/soleDistributor/my-products');
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
                <div className="cardText" style={{fontSize: "16px",  fontWeight: "bold",  color: "red",   marginBottom: "10px"}}>
                  Quantity: {item.quantity}
                </div>

                
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyedProducts;
