import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateItem.css';
const CreateItem = () => {
  const [item, setItem] = useState({
    seller_id: 2, // Initialize seller_id as null
    item_name: '',
    description: '',
    starting_price: 0,
    start_time: '',
    end_time: '',
    image:'',
  });
  const navigate=useNavigate();
  useEffect(() => {
    // Fetch the seller_id cookie
    const sellerIdFromCookie = document.cookie.split('; ').find(row => row.startsWith('seller_id='));
    
    if (sellerIdFromCookie) {
      const sellerId = sellerIdFromCookie.split('=')[1];
      setItem((prevItem) => ({ ...prevItem, seller_id: sellerId }));
    }
  }, []);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a POST request to the server to add the item
    fetch('/createitem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Item added:', data);
        navigate('/items');
        // Clear the form
        setItem({
          ...item,
          item_name: '',
          description: '',
          starting_price: 0,
          start_time: '',
          end_time: '',
          image:'',
        });
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  };

  return (
    <div className="container">
      <h2 className="title">Create a New Item</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Item Name:
          <input type="text" name="item_name" className="form-input" value={item.item_name} onChange={handleChange} />
        </label>
        <label className="form-label">
          Description:
          <textarea name="description" className="form-textarea" value={item.description} onChange={handleChange} />
        </label>
        <label className="form-label">
          Starting Price:
          <input type="number" name="starting_price" className="form-input" value={item.starting_price} onChange={handleChange} />
        </label>
        <label className="form-label">
          Start Time:
          <input type="datetime-local" name="start_time" className="form-datetime" value={item.start_time} onChange={handleChange} />
        </label>
        <label className="form-label">
          End Time:
          <input type="datetime-local" name="end_time" className="form-datetime" value={item.end_time} onChange={handleChange} />
        </label>
        <label className="form-label">
          Image:
          <input type="text" name="image" className="form-input" value={item.image} onChange={handleChange} />
        </label>
        <button type="submit" className="form-button">Create Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
