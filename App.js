import logo from './logo.svg';
import './App.css';
import Login from "./Components/Login";
import {Route, Routes} from "react-router-dom";
import Register from "./Components/Register";
import Contact from "./Components/Contact";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/contact' element={<Contact />}/>
        </Routes>

    </div>
  );
}

export default App;
