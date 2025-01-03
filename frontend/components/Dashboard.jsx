import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Dashboard = ({ token }) => {
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);

    const fetchBalance = async () => {
        try {
            const response = await axios.get('/user/balance', {
                headers: { 'x-auth-token': token },
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const handleSendMoney = async (e) => {
        e.preventDefault();
        
        // Check if the amount and receiver UPI ID are valid
        if (!receiver || !amount) {
            alert("Please enter both receiver UPI ID and amount.");
            return;
        }

        try {
            // Make the POST request to initiate the transaction
            const response = await axios.post(
                '/transactions/transaction',
                { receiver, amount },
                { headers: { 'x-auth-token': token } }
            );

            // On success, show a success message and update the balance
            alert(response.data); // e.g., "Transaction successful"
            fetchBalance(); // Re-fetch the user's balance after the transaction

            // Clear the form fields after the transaction
            setReceiver('');
            setAmount('');
        } catch (error) {
            // If an error occurs, alert the error message from the backend
            alert(`Transaction failed: ${error.response ? error.response.data : 'An error occurred'}`);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">Dashboard</h2>
                <div className="text-center mb-4">
                    <p className="text-xl font-medium">Balance: ₹{balance}</p>
                </div>

                <form onSubmit={handleSendMoney} className="space-y-4">
                    <div>
                        <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">Receiver UPI ID</label>
                        <input
                            id="receiver"
                            type="text"
                            placeholder="Enter Receiver UPI ID"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={!receiver || !amount}
                    >
                        Send Money
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
