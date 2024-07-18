// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import Item from './Item'; // Assuming you have an Item component
import { Link } from 'react-router-dom';
import logo from './logo_auction.png';
const ToggleMenu = () => {
  const [menuOpen] = useState(false);

 

  return (
    <div className={`toggle-menu ${menuOpen ? 'menu-open' : ''}`}>
      
      <div className="menu-content">
        <ul>
          <li>Luxuries</li>
          <li>Limited Editions</li>
          <li>Antiques</li>
          <li>Used Items</li>
        </ul>
      </div>
    </div>
  );
};
const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch items with status "sold" and buyer_id matching user_id
    fetch('/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <header className="navbar navbar-expand-sm bg-dark">
          <Link to="/items">
            <img className="logo" src={logo} alt="icon" />
          </Link>
          <Link to="/items" className="nav-link">| popular</Link>
          <Link to="/orders" className="nav-link">| orders</Link>
          <Link to="/watchlist" className="nav-link">| watchlist</Link>
        </header>
      <div className="page-container">
      <div className="menu">
        <ToggleMenu />
      </div>
      <div className="content">
        
      <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        orders.map((order) => <Item key={order.item_id} item={order} />)
      )}
    </div>
      </div>
    </div>
    </div>
    
  );
};

export default Orders;
