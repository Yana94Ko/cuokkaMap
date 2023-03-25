import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import KakaoLogin from "./components/home/KakaoLogin";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<KakaoLogin/>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
