import React from 'react';
import List from "./pages/List";
import Anime from "./pages/Anime";
import Seasonal from "./pages/Seasonal";
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import Header from './components/Header';
import Studio from './pages/Studio';
import Character from './pages/Character';
import Staff from './pages/Staff';
import Footer from './components/Footer';
import AdvancedSearchAnime from './pages/AdvancedSearchAnime';

const Routing = () => {
    return (
    
    <><Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/anime" element={<List />} />
                <Route path="/anime/:id" element={<Anime />} />
                <Route path="/studio/:id" element={<Studio />} />
                <Route path="/character/:id" element={<Character />} />
                <Route path="/character/:id/:name   " element={<Character />} />
                <Route path="/staff/:id" element={<Staff />} />
                <Route path="/seasonal" element={<Seasonal  />} />
                <Route path="/search" element={<AdvancedSearchAnime></AdvancedSearchAnime>} />

            </Routes>
        <Footer />
        </>
    )
}

export default Routing