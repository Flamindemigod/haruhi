import React from 'react';
import List from "./pages/List";
import Anime from "./pages/Anime";
import Seasonal from "./pages/Seasonal";
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Studio from './pages/Studio';
const Routing = () => {
    return (
    
    <><Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/anime" element={<List />} />
                <Route path="/anime/:id" element={<Anime />} />
                <Route path="/studio/:id" element={<Studio />} />
                <Route path="/seasonal" element={<Seasonal  />} />
            </Routes>
        </>
    )
}

export default Routing