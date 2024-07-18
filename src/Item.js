import React, { useState } from 'react';
import classnames from 'classnames';
const Item = ({ item }) => {
  const [bidPrice, setBidPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleBidChange = (e) => {
    setBidPrice(e.target.value);
  };

  const submitBid = () => {
    // Send a POST request to add the bid to the Bids table
    fetch('/addbid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bidder_id: 1, // Replace with the actual user ID
        item_id: item.item_id,
        amount: bidPrice,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage('Bid added successfully');
          // You can add further logic here, like updating the item's current bid
        } else {
          setMessage('Error adding bid');
        }
      })
      .catch((error) => {
        console.error('Error adding bid:', error);
        setMessage('Error adding bid');
      });
  };

  const addToWatchlist = () => {
    // Send a POST request to add the item to the Watchlist table
    fetch('/addtowatchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 1, // Replace with the actual user ID
        item_id: item.item_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage('Watchlist updated successfully');
        } else {
          setMessage('Error adding item to Watchlist');
        }
      })
      .catch((error) => {
        console.error('Error adding item to Watchlist:', error);
        setMessage('Error adding item to Watchlist');
      });
  };

  return (
    <div className={classnames('item-container', { 'fancy-border': item.currentBid })}>
      <img className="item-image" src={item.image} alt="image" />
      <h2>{item.item_name}</h2>
      <p>Description: {item.description}</p>
      <p>Starting Price: ${item.starting_price}</p>
      <p>Current Bid: ${item.currentBid ? item.currentBid : item.starting_price}</p>
      <input
        className="bid-input"
        type="number"
        placeholder="Enter your bid price"
        value={bidPrice}
        onChange={handleBidChange}
      />
      <button className="bid-button" onClick={submitBid}>
        Submit Bid
      </button>
      <button className="watchlist-button" onClick={addToWatchlist}>
        Add to Watchlist
      </button>
      <p className="message">{message}</p>
    </div>
  );
};

export default Item;
