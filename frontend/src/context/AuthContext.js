import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Context banana
const AuthContext = createContext();

// 2. Provider Component banana (jo poore app ko wrap karega)
function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // 'user' state, shuru mein null (koi logged-in nahi)

    // Yeh check karega ki kya user pehle se logged-in tha (page refresh hone par)
    useEffect(() => {
        const storedUser = localStorage.getItem('crime_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

  // Login function (Simple version, bina role ke)
    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            // Backend ko ab role nahi bhej rahe hain
            axios.post('http://localhost:5000/api/login', { username, password })
                .then(response => {
                    const loggedInUser = response.data.user;
                    setUser(loggedInUser);
                    localStorage.setItem('crime_user', JSON.stringify(loggedInUser));
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error.response.data);
                });
        });
    };
    // Logout function
    const logout = () => {
        setUser(null); // User state ko null kar diya
        localStorage.removeItem('crime_user'); // 'localStorage' se hata diya
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };