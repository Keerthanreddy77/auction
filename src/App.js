import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Signin from "./Signin"
import Register from "./Register"
import AdminLogin from './AdminLogin'
import CreateItem from "./CreateItem"
import Items from './Items'
import Watchlist from './Watchlist'
import Orders from "./Orders"
function App() {
  return (
    <div className="App">
      
    <Routes>
      <Route exact path='/' element={<Signin/>}></Route>
      <Route exact path='/register' element={<Register/>}></Route>
      <Route exact path='/adminlogin' element={<AdminLogin/>}></Route>
      <Route exact path='/createitem' element={<CreateItem/>}></Route>
      <Route exact path='/items' element={<Items/>}></Route>
      <Route exact path='/watchlist' element={<Watchlist/>}></Route>
      <Route exact path='/orders' element={<Orders/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
