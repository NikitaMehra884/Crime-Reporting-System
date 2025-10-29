import { createTheme } from '@mui/material/styles';

// Yeh hamari "Master Style" file hai (Police Dark Mode)
const theme = createTheme({
    // Palette (Color Scheme) - Police DARK MODE Theme
    // ... (theme.js ka baaki code) ...

    palette: {
        mode: 'dark', // <-- YEH HAI MAIN CHANGE
        primary: {
            main: '#D32F2F', // Red ko thoda bright kar rahe hain dark mode ke liye
        },
        secondary: {
            main: '#BCA474', // Khaki (Gold jaisa lagega)
        },
       background: {
   default: 'transparent', // <-- YEH HAI FINAL FIX // Poora page ka background (Dark Navy Blue)
    paper: '#27303a',   // Box/Card ka background (Lighter Navy Blue)
},
        text: {
            primary: '#ffffff', // Saara text white
            secondary: '#b0bec5', // Halka text (greyish)
        }
    },

// ... (theme.js ka baaki code) ...

    // Typography (Fonts)
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h4: {
            fontWeight: 700, // Heading ko thoda bold rakho
            fontSize: '2.2rem',
        },
    },

    // Shape (Border Radius)
    shape: {
        borderRadius: 12, // Components ko thoda rounded (modern) look dega
    },

    // Component Overrides (Specific component style)
    components: {
        MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundImage: `url('/background.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundAttachment: 'fixed',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // 70% black overlay
                backgroundBlendMode: 'multiply',
            }
        }
    },
        // Button ka default style badal rahe hain
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 'SUBMIT' ki jagah 'Submit' dikhayega
                    fontWeight: 500,
                    padding: '10px 20px',
                    borderRadius: 8, // Buttons ko bhi rounded rakho
                },
            },
        },
        // Form fields ka style
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            }
        },
        // Box ka naya style (Dark Mode ke liye)
        MuiBox: {
            styleOverrides: {
                root: {
                    '&[component="form"]': {
                        // paper color (Light Navy) ab theme se aayega
                        padding: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)', // Shadow thodi gehri
                        border: '1px solid', // Border add kiya
                        borderColor: 'rgba(255, 255, 255, 0.1)' // Halka white border
                    }
                }
            }
        },
        // Dashboard Table (Paper) par bhi border
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
    }
});

export default theme;
