import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const storedUser = localStorage.getItem('crime_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // --- FINAL FIX: LOGIN FUNCTION ---
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            // Render URL
            axios.post('https://crime-backend-ptv8.onrender.com/api/login', { username, password })
                .then(response => {
                    const loggedInUser = response.data.user; 
                    setUser(loggedInUser); 
                    localStorage.setItem('crime_user', JSON.stringify(loggedInUser));
                    resolve(response.data); 
                })
                .catch(error => {
                    // YEH HAI FIX: Hum check kar rahe hain ki error.response hai ya nahi
                    // Agar nahi hai, toh hum 'error' ko 'undefined' hone se bacha rahe hain
                    const errorMessage = error.response && error.response.data ? error.response.data : { message: 'Network or Server connection failed.' };
                    
                    console.error("Login API Failed:", errorMessage);
                    reject(errorMessage); 
                });
        });
    };

    // Logout function
    const logout = () => {
        setUser(null); 
        localStorage.removeItem('crime_user'); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };