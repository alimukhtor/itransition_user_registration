import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import MyNavbar from './components/MyNavbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <MyNavbar/>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
