import React, {useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Http2ServerResponse} from "http2";

const KakaoOauth2RedirectHandler:React.FC = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        sessionStorage.setItem("id", "2");
        window.location.reload();
        navigate("/"); // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
    },[])


    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const refresh = urlParams.get('refresh');
    //     if (refresh === 'true') {
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("GET", "http://localhost:8021/login/callback");
    //         xhr.responseType = "json";
    //         xhr.onreadystatechange = function () {
    //             console.log(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200);
    //             if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //                 const userInfo = JSON.parse(xhr.response);
    //                 console.log(userInfo);
    //                 console.log(userInfo.user_num);
    //                 sessionStorage.setItem("id", userInfo.user_num);
    //                 navigate("/"); // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
    //                 window.location.reload();
    //             } else {
    //                 console.log("소셜로그인 에러");
    //                 window.alert("로그인에 실패하였습니다.");
    //                 navigate("/"); // 로그인 실패하면 로그인화면으로 돌려보냄
    //             }
    //         };
    //         xhr.send();
    //     }
    // }, []);

    // 인가코드
    // let code = new URL(window.location.href).searchParams.get("code");
    // 백으로 보낼 주소
    //const REACT_APP_REDIRECT_URI_TO_SPTRING = process.env.REACT_APP_REDIRECT_URI_TO_SPTRING;



    return (
        <p> 카카오 로그인 진행중 </p>
    )
}

export default KakaoOauth2RedirectHandler;