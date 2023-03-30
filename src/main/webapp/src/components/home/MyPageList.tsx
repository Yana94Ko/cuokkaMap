import React from 'react';
import styled from "styled-components";

const Base = styled.div`
  position: absolute;
  right: 3rem;
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
  &:last-child{
    margin-bottom: 0;
  }
  &:hover {
    color: ${props => props.theme.color.primary};
  }
`;

const MyPageList: React.FC = () => {


    return (
        <Base>
            <List>
                <Item>cuokkamap@gmail.com</Item>
                <Item>내 사진</Item>
                <Item>내 후기</Item>
                <Item>의견 보내기</Item>
                <Item onClick={() => {
                    sessionStorage.removeItem("id");
                    window.location.reload();
                }
                }>로그아웃</Item>
            </List>
        </Base>
    )
}

export default MyPageList