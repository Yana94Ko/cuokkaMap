import React, {useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const KakaoOauth2RedirectHandler:React.FC = () => {
    const navigate = useNavigate();
    // 인가코드
    let code = new URL(window.location.href).searchParams.get("code");
    // 백으로 보낼 주소
    const REACT_APP_REDIRECT_URI_TO_SPTRING = process.env.REACT_APP_REDIRECT_URI_TO_SPTRING;

    useEffect(() => {
        axios({
            method: "GET",
            url: `${REACT_APP_REDIRECT_URI_TO_SPTRING}?code=${code}`,
        })
            .then((res) => {
                sessionStorage.setItem("id", res.data.user_num);
                navigate("/") // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
            })
            .catch((err) => {
                console.log("소셜로그인 에러", err);
                window.alert("로그인에 실패하였습니다.");
                navigate("/login"); // 로그인 실패하면 로그인화면으로 돌려보냄
            })
    },[code])

    return (
        <p> 카카오 로그인 진행중 </p>
    )
}

export default KakaoOauth2RedirectHandler;