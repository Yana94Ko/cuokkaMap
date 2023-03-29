import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPageList from "./components/home/MyPageList";
import KakaoOauth2RedirectHandler from "./components/home/header/KakaoOauth2RedirectHandler";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/mypage" element={<MyPageList/>}/>
                {/*↓얘도 진짜는 아님 잠시 보이기 위한 용도*/}
                <Route path="/login/callback" element={<KakaoOauth2RedirectHandler/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
