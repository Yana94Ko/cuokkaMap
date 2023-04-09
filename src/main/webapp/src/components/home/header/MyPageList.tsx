import React from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";
import {setCurrentMyPageView} from "../../../modules/viewReducer";

const Base = styled.div`
  position: absolute;
  top: 105%;
  left: -90%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const List = styled.ul``;

const Item = styled.li`
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.color.text};
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  padding: 1rem 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    color: ${props => props.theme.color.primary};
    background-color: ${props => props.theme.color.lightGray};
  }
`;

const StyledA = styled.a`
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  color: ${props => props.theme.color.text};

  &:visited {
    color: ${props => props.theme.color.text};
  }

  &:hover {
    color: ${props => props.theme.color.primary};
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
            navigate('/mypage');
            dispatch(setCurrentMyPageView(e.target.id))
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
                            <Item>
                                고객센터
                            </Item>
                        </StyledA>
                        <Item onClick={onLogoutClick}>로그아웃</Item>
                    </List>
                ) : (
                    <List>
                        <Item onClick={() => dispatch(setIsOpenedLoginModal(true))}>로그인</Item>
                        <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                 target="_blank">
                            <Item>
                                고객센터
                            </Item>
                        </StyledA>
                    </List>
                )
            }
        </Base>
    )
}

export default MyPageList