import React from 'react';
import styled from "styled-components";
import axios from "axios";

const KakaoLogin:React.FC = () => {
    const Base = styled.div``;
    const KakaoBtn = styled.div`
    `;

    const loginClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("카카오로그인");
        //버튼 누르면 보낼 거시기
        // axios.post('/user/login')
    }

    return (
        <Base>
            <p>로그인 페이지</p>
            <img src={process.env.PUBLIC_URL + '/assets/img/logo/symbol.png'} alt="로고"/>
            <button onClick={loginClickHandler}>
                <img src={process.env.PUBLIC_URL + '/assets/img/kakaologin/kakao_login_medium_wide.png'} alt="카카오로그인"/>
            </button>
        </Base>
    )
}

export default KakaoLogin;