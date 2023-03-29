import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import KakaoLogin from "./components/home/header/KakaoLogin";
import MyPageList from "./components/home/MyPageList";
import KakaoOauth2RedirectHandler from "./components/home/header/KakaoOauth2RedirectHandler";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                {/*↓확인차 만든 라우팅 지워질 친구(모달로 만들것)*/}
                <Route path="/login" element={<KakaoLogin/>}/>
                {/*↓얘도 진짜는 아님 잠시 보이기 위한 용도*/}
                <Route path="/mypage" element={<MyPageList/>}/>
                {/*↓얘도 진짜는 아님 잠시 보이기 위한 용도*/}
                <Route path="/login/callback" element={<KakaoOauth2RedirectHandler/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
