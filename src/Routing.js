import React from 'react';
import List from "./pages/List";
import Anime from "./pages/Anime";
import Calender from "./pages/Calender";
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
const Routing = () => {
    return (
    
    <><Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/anime" element={<List />} />
                <Route path="/anime/:id" element={<Anime />} />
                <Route path="/calender" element={<Calender />} />
            </Routes>
        </>
    )
}

export default Routing