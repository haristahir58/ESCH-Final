import React,{useState, useEffect} from 'react'
import Sidebar from '../../Distributor/Components/Sidebar/DisSidebar'
import { Link } from 'react-router-dom';
import Navbar from '../Components/navbar/Navbar'
import Chart from '../../Admin/Components/chart/Chart';
import Featured from '../../Admin/Components/featured/Featured'
import '../Components/Profile/Profile.css'

function DisHome() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('/distributor/products/latest');
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
    <div className='home'>
        <Sidebar/>
        <div className="homeContainer">
          <Navbar/>
          <h1 style={{textAlign:'center', fontSize:'25px', marginTop:'10px'}}>Latest Products</h1>
          <div className="cardContainer1">
            {products.map((item) => (
              <div key={item._id} className="card1">
                <div className="cardImage">
                  <img src={`http://localhost:4000/${item?.product.imageUrl}`} alt={item?.product.title || 'Unknown'} />
                </div>
                <div className="cardTitle1">
                  {item?.product.title || 'Unknown'}
                </div>
                <div className="cardText">
                  {item?.product.description || 'No description available'}
                </div>
                <div className="cardText1">
                  Rs. {item.price || 0}
                </div>
                <div className="cardText1">
                  Quantity: {item.quantity || 0}
                </div>

                <div className="tableCell" style={{display:'flex', justifyContent:'center'}}>
              <span className={`status ${item.status || 'Unknown'}`}>{item.status || 'Unknown'}</span>
                </div>

                <div className="btn5">
                    <Link to={'/distributor/products'}
                      className="Button accept-button"
                    >
                      View Products
                    </Link>


                </div>
              </div>
            ))}
          </div>

          </div>
          </div>
          
  )
}

export default DisHome
