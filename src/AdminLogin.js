import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from "./logo_auction.png"
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
const navigate=useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to the server for seller login
    fetch('/adminlogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.msg);
        // Handle the response from the server (e.g., check for success or error)
        if(data.msg=="success"){
        navigate('/createitem');}
        else{
          var theDiv = document.getElementById("incorrect");
          var content = document.createTextNode("password or username incorrect");
          theDiv.appendChild(content);
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <div>
  <header className="navbar navbar-expand-sm bg-dark">
    <Link to="/">
      <img className="logo" src={logo} alt="icon" />
    </Link>
    <Link to="/register" className="nav-link">| register</Link>
    <Link to="/adminlogin" className="nav-link">| admin login</Link>
  </header>
  <div className="seller-signin-container">
    <div className="seller-signin-content">
      <h2>Seller Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <label className="form-label">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <button type="submit" className="submit-button">
          Sign In
        </button>
        <div id="incorrect" className="form-message"></div>
      </form>
    </div>
  </div>
</div>

    
  );
};

export default AdminLogin;
