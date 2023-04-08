import React from 'react';
import styled from "styled-components";
import Modal from "./Modal";
import {Icon} from "../styles/common";
import {useDispatch} from "react-redux";
import {setIsOpenedLoginModal} from "../modules/userReducer";

const Base = styled.div`
  position: relative;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 3rem;
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  gap: 3rem;
  @media ${props => props.theme.windowSize.mobile}{
    padding: 2rem;
  }
`;

const CloseBtn = styled(Icon)`
  color: ${props => props.theme.color.primary};
  position: absolute;
  right: 3rem;
  top: 3rem;
  @media ${props => props.theme.windowSize.mobile}{
    right: 2rem;
    top: 2rem;
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.color.primary};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: 700;
`;

const SymbolImg = styled.img`
  width: 200px;
  @media ${props => props.theme.windowSize.mobile}{
    width: 150px;
  }
`;

const LoginImg = styled.img`
  width: 250px;
  @media ${props => props.theme.windowSize.mobile}{
    width: 200px;
  }
`;

const NoticeWrapper = styled.div`
  display: flex;
`;
const NoticeLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${props => props.theme.color.darkGray};
  font-weight: 300;
  font-size: ${props => props.theme.fontSize.sm};

  &:first-child {
    margin-right: 20px;
  }
`;

const KakaoLogin: React.FC = () => {
    const KAKAO_LOGIN_KEY = process.env.REACT_APP_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

    const dispatch = useDispatch();

    return (
        <Modal>
            <Base>
                <Title>로그인</Title>
                <CloseBtn className="material-symbols-rounded" onClick={() => {
                    dispatch(setIsOpenedLoginModal(false))
                }
                }>close</CloseBtn>

                <SymbolImg src={process.env.PUBLIC_URL + '/assets/images/logo/symbol.png'} alt="로고"/>
                <a href={`https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_LOGIN_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`}>
                    <LoginImg src={process.env.PUBLIC_URL + '/assets/images/kakaologin/kakao_login_medium_wide.png'}
                              alt="카카오로그인"/>
                </a>
                <NoticeWrapper>
                    <NoticeLink href="https://tough-dietician-fdf.notion.site/95cba12f0f8c41d896270c0357dc7655"
                                target="_blank">개인정보처리방침</NoticeLink>
                    <NoticeLink href="https://tough-dietician-fdf.notion.site/b92549b28ffa48c59c06ebd3b4e5adb7"
                                target="_blank">이용약관</NoticeLink>
                </NoticeWrapper>
            </Base>
        </Modal>
    )
}

export default KakaoLogin;

