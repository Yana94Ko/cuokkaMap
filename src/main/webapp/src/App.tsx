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
                {/*↓로그인 콜백 라우팅용*/}
                <Route path="/login/callback" element={<KakaoOauth2RedirectHandler/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
