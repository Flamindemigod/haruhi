import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import userReducer from "./features/user"
import loadingReducer from "./features/loading"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#42A5F5",
    },
    secondary: {
      main: "#ca006b",
    },
  },
}); 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <App />
      </ThemeProvider>
    </Provider>
    </LocalizationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
