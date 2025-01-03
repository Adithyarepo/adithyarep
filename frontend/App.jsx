import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    return (
        
        <Router>
            <Routes>
                <Route path="/" element={<Login setToken={setToken} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/history" element={<TransactionHistory token={token} />} />
            </Routes>
        </Router>
    );
}
export default App;
