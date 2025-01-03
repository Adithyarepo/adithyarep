// TransactionHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const TransactionHistory = ({ token }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/transactions/history', {
                headers: { 'x-auth-token': token },
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            alert('Unable to fetch transactions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-3xl font-semibold text-center mb-6">Transaction History</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-gray-500">No transactions to display.</p>
                ) : (
                    <ul className="space-y-4">
                        {transactions.map((txn, index) => (
                            <li
                                key={index}
                                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                            >
                                <p className="font-medium">Sender: <span className="font-normal">{txn.sender}</span></p>
                                <p className="font-medium">Receiver: <span className="font-normal">{txn.receiver}</span></p>
                                <p className="font-medium">Amount: <span className="font-normal">₹{txn.amount}</span></p>
                                <p className="font-medium">Date: <span className="font-normal">{new Date(txn.date).toLocaleString()}</span></p>
                                <p className="font-medium">Status: <span className="font-normal">{txn.status}</span></p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
