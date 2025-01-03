import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("All fields are required.");
            return;
        }
        setIsSubmitting(true);
        try {
            // Signup request
            const signupResponse = await axios.post("/auth/signup", { username, password });

            if (signupResponse.status === 200) {
                // After successful signup, log the user in automatically
                const loginResponse = await axios.post("/auth/login", { username, password });

                if (loginResponse.status === 200) {
                    // Store JWT token in localStorage
                    localStorage.setItem("authToken", loginResponse.data.token);
                    alert("Signup and Login successful!");
                    navigate("/dashboard"); // Redirect to dashboard after successful login
                } else {
                    alert("Login failed after signup.");
                }
            } else {
                alert("Signup failed. Please try again.");
            }
        } catch (error) {
            // Log the error message for more detailed debugging
            console.error("Error during signup:", error);

            const message = error.response?.data?.message || "Signup failed.";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-blue-800 shadow-md py-2">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <img
                            src="/logo.png" // Update this path if logo is in src/assets or a URL
                            alt="Logo"
                            className="w-12 h-12 rounded-full object-cover" // Make logo smaller and circular
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-3">
                        <a href="/" className="text-white hover:text-blue-600 text-xs">Login</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center items-center py-4">
                <div className="bg-white p-6 rounded-xl shadow-2xl w-80">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-5">Signup</h2>
                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 bg-[#005eb8] text-white rounded-md ${isSubmitting ? "opacity-50" : ""} text-xs`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing up..." : "Signup"}
                        </button>
                    </form>
                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-600">Already have an account? </span>
                        <a href="/" className="text-[#005eb8] hover:underline text-xs">Login</a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#f5f5f5] py-2">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full sm:w-auto text-center sm:text-left">
                            <ul className="space-y-1 text-xs">
                                <li><a href="/about" className="text-gray-600 hover:text-blue-600">About Us</a></li>
                                <li><a href="/terms" className="text-gray-600 hover:text-blue-600">Terms & Conditions</a></li>
                                <li><a href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="w-full sm:w-auto text-center sm:text-right">
                            <ul className="space-y-1 text-xs">
                                <li><a href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
                                <li><a href="/help" className="text-gray-600 hover:text-blue-600">Help</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-600 mt-3">
                        &copy; 2024 Paytm. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Signup;