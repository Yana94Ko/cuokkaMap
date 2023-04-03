import React, {useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

import {Button, Icon} from "../../styles/common";
import {RootState} from "../../modules";

const Base = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const StyledLink = styled(Link)``;
const Logo = styled.img`
  height: 50px;
`;
const LogoutButton = styled(Button)`
  width: 40px;
  height: 40px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Header = () => {
    const navigate = useNavigate();

    const onLogoutClick = () => {
        window.alert("로그인 관련 기능은 준비중입니다!")
        // const result = window.confirm("로그아웃 하시겠습니까?");
        // if (result) {
        //     sessionStorage.removeItem("id");
        //     window.location.reload();
        // }
    }
    return (
        <Base>
            <StyledLink to="/">
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"} alt="로고이미지"/>
            </StyledLink>
            <LogoutButton onClick={onLogoutClick}>
                <Icon className="material-symbols-rounded">logout</Icon>
            </LogoutButton>
            {/*TODO(FE): 회원탈퇴 기능 추가해야함*/}
            {/*회원탈퇴관련 DB완료되면 기능 추가하기*/}
            {/*assignees: hwanyb, SeongSilver*/}
        </Base>
    )
}

export default Header;