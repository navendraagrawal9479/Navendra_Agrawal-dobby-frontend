import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from './theme'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostPage from "scenes/postPage";
import SearchPage from "scenes/searchPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);  // change this theme when the mode changes
  const isAuth = useSelector(state => state.token);

  const startServer = async () => {
    const response = await fetch(process.env.REACT_APP_BASE_URL, {
      method: 'GET'
    });
    console.log(await response.json());
  }

  useEffect(() => {
    startServer();
  }, []);

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* <Navbar /> */}
          <CssBaseline />
          <Routes>
            <Route path='/' element={!isAuth ? <LoginPage /> : <Navigate to={'/home'} />} />
            <Route path='/home' element={isAuth ? <HomePage /> : <Navigate to={'/'} />} />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to={'/'} />} />
            <Route path='/posts/:postId' element={isAuth ? <PostPage /> : <Navigate to={'/'} />} />
            <Route path='/search/:searchParams' element={isAuth ? <SearchPage /> : <Navigate to={'/'} />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode === "dark" ? mode : "colored"}
      />
    </div>
  );
}

export default App;
