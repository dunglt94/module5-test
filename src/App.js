import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Order from "./componants/Order";
import {Route, Routes} from "react-router-dom";
import OrderForm from "./componants/OrderForm";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Order/>} />
                <Route path="/add" element={<OrderForm/>} />
            </Routes>

        </div>
    );
}

export default App;
