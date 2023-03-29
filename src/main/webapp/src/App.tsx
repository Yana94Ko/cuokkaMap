import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPageList from "./components/home/MyPageList";
import KakaoOauth2RedirectHandler from "./components/home/header/KakaoOauth2RedirectHandler";
import {useDispatch} from "react-redux";
import {setIsLoggedin, setUserId} from "./modules/userReducer";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
     if(sessionStorage.getItem("id") !== null){
         dispatch(setIsLoggedin(true));
         dispatch(setUserId(sessionStorage.getItem("id")));
     }else {
         dispatch(setIsLoggedin(false));
         dispatch(setUserId(""));
     }
    });
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
