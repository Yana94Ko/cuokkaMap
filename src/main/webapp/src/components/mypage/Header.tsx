import React, {useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../modules";
import {setIsOpenedMyPageList} from "../../modules/viewReducer";
import MyPageList from "../home/header/MyPageList";
import {NavBtn, NavIcon, NavLoginOrMyPage} from "../home/header/Header";

const Base = styled.header`
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-box-align: center;
  width: 100%;
  z-index: 9999;
`;
const StyledLink = styled(Link)``;

const Logo = styled.img`
  width: 100px;
  height: 50px;
  object-fit: contain;
  object-position: left;
  @media ${props => props.theme.windowSize.mobile} {
    width: 70px;
    height: 40px;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.md};
`;

const Header = () => {
    const dispatch = useDispatch();

    const isOpenedMyPageList = useSelector((state: RootState) => state.viewReducer.isOpenedMyPageList);

    return (
        <Base>
            <StyledLink to="/">
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"} alt="로고이미지"/>
            </StyledLink>
            <Title>마이페이지</Title>
            <NavLoginOrMyPage>
                <NavBtn className="myPageList" onClick={() => dispatch(setIsOpenedMyPageList(!isOpenedMyPageList))}>
                    <NavIcon className="material-symbols-rounded myPageList">person</NavIcon>
                </NavBtn>
                {isOpenedMyPageList && <MyPageList/>}
            </NavLoginOrMyPage>
        </Base>
    )
}

export default Header;