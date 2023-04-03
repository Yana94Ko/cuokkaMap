import React from 'react';
import styled from "styled-components";

const Base = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const List = styled.ul`
  border-radius: 1rem;
`;
const Item = styled.li`
  transition: all 0.3s ease-in-out;
  color: ${props => props.theme.color.darkGray};
  cursor: pointer;
  margin-bottom: 10px;
  text-align: right;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    color: ${props => props.theme.color.primary};
  }
`;

const MyPageList: React.FC = () => {

    const onLogoutClick = () => {
        const result = window.confirm("로그아웃 하시겠습니까?");
        if (result) {
            sessionStorage.removeItem("id");
            window.location.reload();
        }
    }
    return (
        <Base>
            {/*<List>*/}
            {/*    <Item>cuokkamap@gmail.com</Item>*/}
            {/*    <Item>내 사진</Item>*/}
            {/*    <Item>내 후기</Item>*/}
            {/*    <Item>의견 보내기</Item>*/}
            {/*    <Item onClick={onLogoutClick}>로그아웃</Item>*/}
            {/*</List>*/}
            <p style={{wordBreak: "keep-all", textAlign: "center"}}>마이페이지 서비스 준비중입니다 😊</p>
        </Base>
    )
}

export default MyPageList