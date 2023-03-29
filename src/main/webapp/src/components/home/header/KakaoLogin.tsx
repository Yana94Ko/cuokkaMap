import React from 'react';
import styled from "styled-components";
import Modal from "../../Modal";
import axios from "axios";

const Base = styled.div``;

const KakaoLogin: React.FC = () => {
    const KAKAO_LOGIN_KEY = process.env.REACT_APP_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

    return (
        <Modal>
            <Base>
                <p>로그인 페이지</p>
                <img src={process.env.PUBLIC_URL + '/assets/img/logo/symbol.png'} alt="로고"/>
                <p>{KAKAO_LOGIN_KEY},{KAKAO_REDIRECT_URI}</p>
                <a href = {`https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_LOGIN_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`}>
                    <img src={process.env.PUBLIC_URL + '/assets/img/kakaologin/kakao_login_medium_wide.png'} alt="카카오로그인"/>
                </a>
            </Base>
        </Modal>
    )
}

export default KakaoLogin;