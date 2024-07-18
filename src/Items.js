import React, { useState, useEffect } from 'react';
import Item from './Item';
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


const Items = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

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
          <h1>Items</h1>
          {items.map((item) => (
            <Item key={item.item_id} item={item} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Items;
