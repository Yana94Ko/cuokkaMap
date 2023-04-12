import React, {useState, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyPageList from "./components/home/header/MyPageList";
import KakaoOauth2RedirectHandler from "./components/KakaoOauth2RedirectHandler";
import {useDispatch} from "react-redux";
import {setIsLoggedin, setUserId} from "./modules/userReducer";
import Banner from "./components/Banner";
import MyPage from "./pages/Mypage";
import {setIsOpenedMyPageList} from "./modules/viewReducer";

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

    //배너를 띄워주기 위한 state
    const [openBanner, setOpenBanner] = useState<boolean>(false);

    useEffect(() => {
        setOpenBanner(true);
    },[])

    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            if (typeof e.target.className === "string" && e.target.className !== "" && e.target.className.includes("myPageList")) {
                return;
            } else {
                dispatch(setIsOpenedMyPageList(false))
            }
        }
    }

    return (
        <BrowserRouter>
            <div onClick={onClickHandler}>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/mypage" element={<MyPage />}/>
                {/*↓로그인 콜백 라우팅용*/}
                <Route path="/login/callback" element={<KakaoOauth2RedirectHandler/>}></Route>
            </Routes>
            {openBanner && <Banner setOpenBanner={setOpenBanner}/>}
            </div>
        </BrowserRouter>
    );
}

export default App;
