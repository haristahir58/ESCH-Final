import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "./ProductDetails.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({
    title: "",
    categoryId: "",
    description: "",
    imageUrl: "",
    price: "",
    quantity: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const response = await fetch(`/admin/products/${params.id}`);
      if (response.ok) {
        const result = await response.json();
        setProduct({
          title: result.title,
          categoryId: result.category,
          description: result.description,
          imageUrl: result.imageUrl,
          price: result.price,
          quantity: result.quantity,
        });
      } else {
        console.error("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <>
      <div className="list">
        <Sidebar />
        <div className="listContainer">
          <Navbar />

          <div className="card-wrapper45">
            <div className="card45">
              {/* card left  */}
              <div className="product-imgs">
                <div className="img-display">
                  <div className="img-showcase">
                    <img
                      src={
                        product.imageUrl
                          ? `http://localhost:4000/${product.imageUrl}`
                          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }
                      alt=""
                    />
                  </div>
                </div>
              </div>
              {/* card right */}
              <div className="product-content">
                <h2 className="product-title55">{product.title}</h2>

                <div className="product-detail">
                  <h2>about this item: </h2>
                  <p>{product.description}</p>

                  <ul>
                    <li>
                      Quantity: <span>{product.quantity}</span>
                    </li>
                    <li>
                      Category:{" "}
                      <span>{getCategoryName(product.categoryId)}</span>
                    </li>
                  </ul>
                </div>

                <div className="product-price">
                  <p className="new-price">
                    Rs. <span>{product.price} PKR</span>
                  </p>
                </div>
              </div>

              <div
                className="sales-info"
                style={{ marginTop: "-75px", marginLeft: "97px", width: '208%' }}
              >
                <h3 style={{ color: "#856666", marginBottom: "33px" }}>
                  Product Sales
                </h3>

                <h5 className="trend" style={{ color: "#856666" }}>
                  View Trend:
                  <select className="time-period" style={{marginLeft:'63px'}}>
                    <option value="1">Next 1 month</option>
                    <option value="2">Next 2 months</option>
                    <option value="3">Next 3 months</option>
                    <option value="6">Next 6 months</option>
                    <option value="9">Next 9 months</option>
                    <option value="12">Next 1 year</option>
                  </select>
                  <button className="predictBtn">Predict</button>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
