import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    // Nayi Blue/White Palette
    palette: {
        mode: 'light', // Light Mode (White Background)
        primary: {
            main: '#1565C0', // Police Blue color (aapke screenshot jaisa)
        },
        secondary: {
            main: '#D32F2F', // Alert Red
        },
        background: {
            default: '#FFFFFF', // Pure White Background
            paper: '#F5F5F5',   // Cards/Forms ke liye halka Grey
        },
        text: {
            primary: '#000000', // Black text
            secondary: '#555555', // Grey text
        }
    },
    // Naya Font
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h4: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 300,
        }
    },
    // Naya Shape
    shape: {
        borderRadius: 4, // Thoda sharp/official look
    },
    // Naye Component Styles
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 20px',
                },
            },
        },
        // Navbar ka color (aapke screenshot jaisa)
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0D47A1', // Deep Blue Navbar
                    color: '#FFFFFF' // <-- YEH HAI NAYA CHANGE (Text color white)
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    // Cards/Forms par halki shadow
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }
            }
        }
    }
});

export default theme;