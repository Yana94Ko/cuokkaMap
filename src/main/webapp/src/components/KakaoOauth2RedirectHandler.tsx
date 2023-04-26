import React, {useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

const Base = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 300;
  background-color: #fff;
`;
const LodingSvg = styled.svg`
  transform: rotate(360deg);
  transition: all 0.8s 0.2s ease-in-out;
`;
const LoadingText = styled.h3`
  margin-top: 10px;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 700;
`;

const KakaoOauth2RedirectHandler: React.FC = () => {
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
                // TODO(BE,FE) : 로그인시 id 값이 아닌 토큰을 전달
                // assignees : Yana94Ko
                sessionStorage.setItem("id", res.data.user_num);
                navigate("/"); // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
                window.location.reload();
            })
            .catch((err) => {
                console.log("소셜로그인 에러", err);
                window.alert("로그인에 실패하였습니다.");
                navigate("/"); // 로그인 실패하면 로그인화면으로 돌려보냄
            })
    }, [code])

    return (
        <Base>
            {/*<LoadingImg src={process.env.PUBLIC_URL + "/assets/images/logo/loading.png"} />*/}
            <LodingSvg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M4.88012 28.16C10.9949 32.1322 20.4828 29.4604 26.0718 22.1923C31.6609 14.9242 31.2347 5.81216 25.1199 1.83997C19.0051 -2.13221 9.51724 0.539638 3.92818 7.80772C-1.66087 15.0758 -1.23468 24.1878 4.88012 28.16ZM23.1567 5.22435C23.8314 5.00563 24.1854 4.3256 23.9475 3.70546C23.7095 3.08533 22.9696 2.75991 22.2949 2.97863C19.8905 3.75806 15.0432 6.77545 13.6337 12.8377C12.8936 16.0211 10.9599 18.4088 9.05273 20.0614C7.12827 21.7289 5.30836 22.5806 4.97083 22.7025C4.30494 22.943 3.97723 23.6341 4.23888 24.2461C4.50052 24.8581 5.25245 25.1593 5.91835 24.9189C6.58575 24.6778 8.6831 23.6544 10.83 21.7941C12.9943 19.9188 15.2861 17.1259 16.1674 13.3353C17.3522 8.23919 21.4252 5.78562 23.1567 5.22435Z"
                      fill="black"/>
            </LodingSvg>
            <LoadingText>잠시만 기다려 주세요 :)</LoadingText>
        </Base>
    )
}

export default KakaoOauth2RedirectHandler;