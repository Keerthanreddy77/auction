const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the current directory
app.use(express.static(__dirname));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Keerthan@3685',
  database: 'online_auction',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

});



app.use(bodyParser.json());

// Endpoint for user sign-in
app.post('/', (req, res) => {
  console.log("sign in recieved");
  const { email, password } = req.body;

  // Query the database to find the user with the given email
  db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if a user with the given email exists
    if (results.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (bcryptResult) {
        // Passwords match, user is authenticated
        res.cookie('user_id', user.user_id, { maxAge: 3600000, httpOnly: true });
        return res.redirect("/items")
      } else {
        // Passwords do not match
        res.status(401).json({ error: 'Authentication failed' });
      }
    });
  });
});

// Endpoint for user sign-up
app.post('/register', (req, res) => {
  console.log("sign up recieved");
  const { username, email, password, c, u , m } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Insert the new user into the database
    db.query(
      'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash],
      (insertErr) => {
        if (insertErr) {
          console.error('Error inserting user into database:', insertErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.redirect('/')
      }
    );
  });
});

app.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;

  // Use a JOIN to retrieve seller and user information in a single query
  const findSellerQuery = `
    SELECT s.seller_id, s.user_id, s.contact_email, s.contact_phone, u.password
    FROM Sellers s
    JOIN Users u ON s.user_id = u.user_id
    WHERE s.seller_name = ?`;

  db.query(findSellerQuery, [username], (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Seller login failed' });
    }

    const { seller_id, user_id, contact_email, contact_phone, password: hashedPassword } = results[0];

    // Compare the provided password with the hashed password
    bcrypt.compare(password, hashedPassword, (bcryptErr, passwordMatch) => {
      if (bcryptErr) {
        console.error('Password comparison error: ' + bcryptErr.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (passwordMatch) {
        // Authentication successful
        console.log("seller authed");
        res.cookie('seller_id', seller_id, { maxAge: 3600000, httpOnly: true });
        return res.status(200).json({ msg: "success" });
      } else {
        // Authentication failed
        console.log("seller failed");
        res.status(401).json({ error: 'Seller login failed' });
      }
    });
  });
});


app.post('/createitem', (req, res) => {
  const newItem = req.body;
  console.log(newItem);
  // Insert the new item into the "Items" table (use your database connection)
  // For simplicity, we're assuming you have a `db` object for the database connection
  db.query(
    'INSERT INTO Items (seller_id, item_name, description, starting_price, start_time, end_time, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [newItem.seller_id, newItem.item_name, newItem.description, newItem.starting_price, newItem.start_time, newItem.end_time, 'active',newItem.image],
    (insertErr, results) => {
      if (insertErr) {
        console.error('Error adding item to the database:', insertErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      console.log(results);
      const itemId = results.item_id;

      // Calculate the time remaining for the item
      const currentTime = new Date();
      const endTime = new Date(newItem.end_time);

      const timeRemaining = endTime - currentTime;

      // Schedule a timeout to update the item's status to "sold" after the time remaining has elapsed
      if (timeRemaining > 0) {
        console.log("timer set");
        setTimeout(() => {
          console.log("timer exec");
          db.query('UPDATE Items SET status = ? WHERE item_id = ?', ['sold', itemId], (updateErr) => {
            if (updateErr) {
              console.error('Error updating item status:', updateErr);
            }
            
          });
        }, timeRemaining); // Use timeRemaining as the delay
      }
      res.redirect("/items");
    });
});




app.get('/items', (req, res) => {
  // Query the database to retrieve items and their current bids
  const query = `
    SELECT
      i.item_id,
      i.item_name,
      i.description,
      i.starting_price,
      i.image,
      (SELECT MAX(amount) FROM Bids WHERE item_id = i.item_id) AS currentBid
    FROM Items i where status="active"
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Send the retrieved items with their current bids as a JSON response
    res.json(results);
  });
});



app.post('/addbid', (req, res) => {
  const { item_id, amount } = req.body;
  const bidder_id=req.cookies.user_id;
  // Check the current bid for the item
  const getCurrentBidQuery = 'SELECT MAX(amount) AS currentBid FROM Bids WHERE item_id = ?';
  db.query(getCurrentBidQuery, [item_id], (currentBidErr, currentBidResults) => {
    if (currentBidErr) {
      console.error('Error fetching current bid:', currentBidErr);
      return res.json({ success: false, message: 'Error adding bid' });
    }
    console.log(currentBidResults[0].currentBid);
    if(currentBidResults[0].currentBid==null){
      console.log('inserting');
      db.query(
        'INSERT INTO Bids (bidder_id, item_id, amount) VALUES (?, ?, ?)',
        [bidder_id, item_id, amount],
        (insertErr, results) => {
          if (insertErr) {
            console.error('Error adding bid to the database:', insertErr);
            res.json({ success: false, message: 'Error adding bid' });
            return;
          }
    
          // You can add further logic here, like updating the item's current bid
    
          res.json({ success: true, message: 'Bid added successfully' });
        }
      );
    }
    // Check if the bidder's amount is higher than the current bid
    else{
    const currentBid = currentBidResults[0].currentBid;
    if (amount > currentBid) {
      // Update the existing bid
      const updateBidQuery = 'UPDATE Bids SET bidder_id = ?, amount = ? WHERE item_id = ?';
      db.query(updateBidQuery, [bidder_id, amount, item_id], (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating bid:', updateErr);
          return res.json({ success: false, message: 'Error adding bid' });
        }
        res.json({ success: true, message: 'Bid updated successfully' });
      });
    } else {
      res.json({ success: false, message: 'Bid amount must be higher than the current bid' });
    }}
  });
});


// Assuming you have an endpoint like '/addtowatchlist' to handle adding items to the watchlist

app.post('/addtowatchlist', (req, res) => {
  const { item_id } = req.body;
  const user_id = req.cookies.user_id;

  // Call the stored procedure to add or remove the item from the watchlist
  db.query('CALL AddToWatchlist(?, ?)', [user_id, item_id], (procedureErr, results) => {
    if (procedureErr) {
      console.error('Error calling stored procedure:', procedureErr);
      return res.json({ success: false, message: 'Error updating watchlist' });
    }
    // Check if results is an array and has at least one element
    if (results.affectedRows > 0) {
      // Assuming the stored procedure returns an object with an affectedRows property
      
      res.json({ success: true, message: 'Watchlist updated successfully' });
    } else {
      res.json({ success: false, message: 'Failed to update watchlist' });
    }
  });
});
app.get('/watchlist', (req, res) => {
  const user_id = req.cookies.user_id;

  // Fetch details of items from the Items table that are in the user's watchlist
  const query = `
    SELECT i.*, (
      SELECT MAX(amount) FROM Bids WHERE item_id = i.item_id
    ) AS currentBid
    FROM Items i
    WHERE i.item_id IN (SELECT item_id FROM Watchlist WHERE user_id = ?)
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching watchlist items:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Send the items to the frontend
    res.json({ watchlistItems: results });
  });
});


// Add this endpoint to server.js
app.get('/orders', (req, res) => {
  const user_id = req.cookies.user_id;

  // Fetch items with status "sold" and buyer_id matching user_id
  db.query(
    'SELECT * FROM Items WHERE status = "sold" AND buyer_id = ?',
    [user_id],
    (queryErr, ordersResults) => {
      if (queryErr) {
        console.error('Error fetching orders:', queryErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Send the orders to the frontend
      res.json({ orders: ordersResults });
    }
  );
});



const port = 3002;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

