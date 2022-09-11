import Layout from '../layouts/Layout';
import '../styles/globals.css';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import loadingReducer from "../features/loading";
import userReducer from "../features/user";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer,
    loading: loadingReducer,
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: "#42a5f5",
    },
    primary: {
      main: "#ca006b",
    },
  },
});


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
