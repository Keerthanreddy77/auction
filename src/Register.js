import { Link } from 'react-router-dom';
import logo from "./logo_auction.png"

function Register() {
    return (
        <div>
                    <header className="navbar navbar-expand-sm bg-dark">
                        <Link to="/"><img className="logo" src={logo} alt='icon'/></Link>
                        <Link to="/register" className="nav-link">| register</Link>
                        <Link to="/adminlogin" className="nav-link">| admin login</Link>
                    </header>
                    <div className="signup">
                        <form  method="POST" name="signin">
                            <centre><h1>Sign up</h1></centre>
                            <p>email</p>
                            <input type="email" name="email"/>
                            <p>password</p>
                            <input type="password" name="password"/>
                            <p>confirm password</p>
                            <input type="password" name="cpassword"/>
                            <p>username</p>
                            <input type="text" name="username"/>
                            <p>mobile number</p>
                            <input type="text" name="phone"></input>
                            <br/> <br/>
                            <button type="submit" class="btn">Sign up</button>
                            
                        </form>
                    </div>
                </div> 

    )
}

export default Register;