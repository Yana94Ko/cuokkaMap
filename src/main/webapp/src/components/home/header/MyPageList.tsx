import React, {useEffect} from 'react';
import styled, {css} from "styled-components";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";
import {
    setCurrentMyPageView,
    setIsOpenedCafeInfo,
    setIsOpenedMyPageList,
    setIsOpenedPostCafe
} from "../../../modules/viewReducer";

const Base = styled.div<{ location: string }>`
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
  ${props => props.location === "/mypage" && css`
    @media ${props => props.theme.windowSize.mobile} {
      width: 70px;
      left: 25%;
    }
  `}
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

  ${props => props.id === "secession" && css`
    border-top: 1px solid ${props.theme.color.gray};
    color: ${props => props.theme.color.darkGray};
    font-weight: 300;
    font-size: ${props.theme.fontSize.sm};
  `} @media(hover: hover) {
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

    const location = useLocation();

    const onLogoutClick = () => {
        const result = window.confirm("로그아웃 하시겠습니까?");
        if (result) {
            sessionStorage.removeItem("id");
            window.location.reload();
        }
    }

    // console.log(location.pathname)

    const onItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
        if (e.target instanceof Element) {
            if (e.target.id !== "") {
                navigate('/mypage');
                dispatch(setCurrentMyPageView(e.target.id));
                dispatch(setIsOpenedCafeInfo(false));
                dispatch(setIsOpenedPostCafe(false));
                dispatch(setIsOpenedMyPageList(false));
            } else return;
        }
    }
    const onSecessionClick = () => {
        const result = window.confirm("지금 탈퇴하시면 추가하신 즐겨찾기, 후기, 사진 등 정보가 모두 삭제되며, 복구 불가능합니다."
            + "\n" + "정말 탈퇴하시겠습니까?");
        if (result) {
            // TODO(FE): 탈퇴 api 연동하기
            // assignees: hwanyb
            // window.alert("탈퇴되셨습니다.");
            // sessionStorage.removeItem("id");
            // navigate("/");
            // window.location.reload();
        } else return;
    }
    return (
        <Base location={location.pathname}>
            {
                isLoggedin ? (
                    location.pathname === "/mypage" ? (
                        <List onClick={onItemClick}>
                            <Item className="myPageList" onClick={onLogoutClick}>로그아웃</Item>
                            <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                     target="_blank">
                                <Item className="myPageList">고객센터</Item>
                            </StyledA>
                            <Item id="secession" className="myPageList" onClick={onSecessionClick}>회원탈퇴</Item>
                        </List>
                    ) : (
                        <List onClick={onItemClick}>
                            <Item className="myPageList" id="favorite">내 즐겨찾기</Item>
                            <Item className="myPageList" id="photo">내 사진</Item>
                            <Item className="myPageList" id="review">내 후기</Item>
                            <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                     target="_blank">
                                <Item className="myPageList">고객센터</Item>
                            </StyledA>
                            <Item className="myPageList" onClick={onLogoutClick}>로그아웃</Item>
                        </List>
                    )
                ) : (
                    <List>
                        <Item className="myPageList" onClick={() => dispatch(setIsOpenedLoginModal(true))}>로그인</Item>
                        <StyledA href="https://tough-dietician-fdf.notion.site/907b20e0956443a589d6ec3a041457cb"
                                 target="_blank">
                            <Item className="myPageList">고객센터</Item>
                        </StyledA>
                    </List>
                )
            }
        </Base>
    )
}

export default MyPageList