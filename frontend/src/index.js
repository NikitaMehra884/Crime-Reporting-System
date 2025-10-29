import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// MUI Theme tools import karein
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Apni 'theme.js' file ko import karein

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Step 1: ThemeProvider se poore app ko wrap karein */}
    <ThemeProvider theme={theme}>
      {/* Step 2: CssBaseline add karein (yeh background color aur font ko reset karta hai) */}
      <CssBaseline /> 
      
      {/* Step 3: Baaki app (Auth provider aur App) ko iske andar rakhein */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);