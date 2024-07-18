import { Link } from 'react-router-dom';
import logo from "./logo_auction.png"

function Signin() {
    return (
        <div>
            <centre>
                    <header className="navbar navbar-expand-sm bg-dark">
                        <Link to="/"><img className="logo" src={logo} alt='icon'/></Link>
                        <Link to="/register" className="nav-link">| register</Link>
                        <Link to="/adminlogin" className="nav-link">| admin login</Link>
                    </header>
                <div className="sign">
                    <div className="signin">
                        <form  method="POST" name="signin">
                            <centre><h1>Sign in</h1></centre><br/>
                            <p>email</p>
                            <input type="email" name="email"/>
                            <p>password</p>
                            <input type="password" name="password"/><br/>
                            <centre><button type="submit" class="btn">Sign in</button></centre>
                            <br></br>
                        </form>
                    </div>
                 </div>
            </centre>
            <p> .</p>
        </div>
    )
}

export default Signin;