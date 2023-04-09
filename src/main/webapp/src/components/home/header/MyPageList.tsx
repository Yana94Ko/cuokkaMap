import React from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";
import {setCurrentMyPageView} from "../../../modules/viewReducer";

const Base = styled.div`
  width: 100px;
  position: absolute;
  top: 110%;
  left: 30%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  @media ${props => props.theme.windowSize.mobile} {
    width: 70px;
    left: 0;
  }
`;

const List = styled.ul``;

const Item = styled.li`
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.color.text};
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  padding: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (hover: hover) {
    &:hover {
      color: ${props => props.theme.color.primary};
      background-color: ${props => props.theme.color.lightGray};
    }
  }

  @media ${props => props.theme.windowSize.mobile} {
    padding: 1rem 0;
  
  }
`;

const StyledA = styled.a`
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  color: ${props => props.theme.color.text};

  &:visited {
    color: ${props => props.theme.color.text};
  }

  @media (hover: hover) {
    &:hover {
      color: ${props => props.theme.color.primary};
    }
  }
`;

const MyPageList: React.FC = () => {
    const dispatch = useDispatch();

    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);

    const navigate = useNavigate();

    const onLogoutClick = () => {
        const result = window.confirm("로그아웃 하시겠습니까?");
        if (result) {
            sessionStorage.removeItem("id");
            window.location.reload();
        }
    }

    const onItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
        if (e.target instanceof Element) {
            if (e.target.id !== "") {
                navigate('/mypage');
                dispatch(setCurrentMyPageView(e.target.id));
            } else return;
        }
    }
    return (
        <Base>
            {
                isLoggedin ? (
                    <List onClick={onItemClick}>
                        <Item id="favorite">내 즐겨찾기</Item>
                        <Item id="photo">내 사진</Item>
                        <Item id="review">내 후기</Item>
                        <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                 target="_blank">
                            <Item>고객센터</Item>
                        </StyledA>
                        <Item onClick={onLogoutClick}>로그아웃</Item>
                    </List>
                ) : (
                    <List>
                        <Item onClick={() => dispatch(setIsOpenedLoginModal(true))}>로그인</Item>
                        <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                 target="_blank">
                            <Item>고객센터</Item>
                        </StyledA>
                    </List>
                )
            }
        </Base>
    )
}

export default MyPageList