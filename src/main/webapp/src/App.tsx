import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPageList from "./components/home/MyPageList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/mypage" element={<MyPageList/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
