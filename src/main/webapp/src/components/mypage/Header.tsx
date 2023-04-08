import React, {useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";

import {Button, Icon} from "../../styles/common";

const Base = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const StyledLink = styled(Link)``;

const Logo = styled.img`
  width: 100px;
  height: 50px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.md};
`;

const LogoutButton = styled(Button)`
  width: 100px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.color.gray};
  color: ${props => props.theme.color.text};
  font-weight: 700;

  &:hover {
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.white};
  }
`;


const Header = () => {
    const onLogoutClick = () => {
        const result = window.confirm("로그아웃 하시겠습니까?");
        if (result) {
            sessionStorage.removeItem("id");
            window.location.reload();
        }
    }
    return (
        <Base>
            <StyledLink to="/">
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"} alt="로고이미지"/>
            </StyledLink>
            <Title>마이페이지</Title>
            <LogoutButton onClick={onLogoutClick}>
                로그아웃
            </LogoutButton>
            {/*TODO(FE): 회원탈퇴 기능 추가해야함*/}
            {/*회원탈퇴관련 DB완료되면 기능 추가하기*/}
            {/*assignees: hwanyb, SeongSilver*/}
        </Base>
    )
}

export default Header;