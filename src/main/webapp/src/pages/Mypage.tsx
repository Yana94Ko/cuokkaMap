import React, {useEffect, useState} from 'react';
import styled, {css} from "styled-components";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../modules";
import {setCurrentMyPageView} from "../modules/viewReducer";
import Header from "../components/mypage/Header";
import PhotoReview from "../components/mypage/PhotoReview";
import Review from "../components/mypage/Review";
import Favorite from "../components/mypage/Favorite";
import Modal from "../components/Modal";
import {ModalCloseBtn, ModalContainer, ModalImg} from "../components/home/KakaoMap";

const Base = styled.main`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  padding: 3rem 8rem 8rem 8rem;
  display: grid;
  grid-template-rows: 0.5fr 1fr 6fr;

  @media ${props => props.theme.windowSize.laptop} {
    padding: 2rem 5rem 8rem 5rem;

  }
  @media ${props => props.theme.windowSize.tablet} {
    padding: 2rem 4rem 8rem 4rem;

  }
  @media ${props => props.theme.windowSize.mobile} {
    grid-template-rows: 0.5fr 0.5fr 10fr;
    padding: 2rem 2rem 10rem 2rem;

    /* mobile viewport bug fix */
    /* iOS only */
    @supports (-webkit-touch-callout: none) {
      height: -webkit-fill-available;
      min-height: -webkit-fill-available;
      padding: 2rem;
    }
  }
`;

const TabWrapper = styled.div`
  margin-top: 5rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 2px;
    bottom: 0;
    background-color: ${props => props.theme.color.gray};
    z-index: 10;
  }

  @media ${props => props.theme.windowSize.mobile} {
    margin-top: 2rem;
  }
`;

const Tab = styled.div<{ active: boolean }>`
  text-align: center;
  padding: 1.5rem 0;
  z-index: 11;
  font-size: ${props => props.theme.fontSize.md};
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  ${props => props.active ? css`
    border-bottom: 2px solid ${props => props.theme.color.primary};
  }
  ` : css`
    border-bottom: 2px solid transparent;
  `};

  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.theme.color.lightGray}80;
    }
  }
`;

const MyPageContent = styled.div`
  position: relative;
  width: 100%;
  margin-top: 2rem;
  overflow-y: scroll;
  padding: 1rem 2rem 2rem 1rem;

  @media ${props => props.theme.windowSize.tablet} {
    margin-top: 1rem;
  }
`;

export const ContentCount = styled.h4`
  margin-bottom: 2rem;
  font-weight: 700;
`;

type TabProps = {
    name: string,
    id: string
}

const MyPage = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);
    const {currentMyPageView} = useSelector((state: RootState) => state.viewReducer);

    useEffect(() => {
        if (!isLoggedin) {
            navigate("/");
            window.location.reload();
        }
    });

    const myPageContent: TabProps[] = [
        {
            name: "즐겨찾기",
            id: "favorite"
        },
        {
            name: "사진",
            id: "photo"
        },
        {
            name: "후기",
            id: "review"
        }
    ];

    const onTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(setCurrentMyPageView(e.currentTarget.id));
    }

    /*=========================================================================================================*/
    /*============================================== CafeInfo 사진 후기 관련 START ==============================================*/
    const [openPhotoModal, setOpenPhotoModal] = useState<boolean>(false);
    const [modalImgSrc, setModalImgSrc] = useState<string>("#");

    //사진모달 닫는 함수
    const closePhotoModal = () => {
        setOpenPhotoModal(false);
    }
    /*============================================== [ END ] CafeInfo 사진 후기 관련 ============================================*/
    /*=========================================================================================================*/
    // TODO(BE,FE) : 로그인 auth 추가(백엔드 - 로그인시 1회성 토큰 발행, 프론트에서 토큰값 auth 진행)
    // assignees : Yana94Ko
    return (
        <Base>
            <Header/>
            <TabWrapper>
                {
                    myPageContent.map((tab, index) => (
                        <Tab key={index} id={tab.id} active={currentMyPageView === tab.id} onClick={onTabClick}>
                            {tab.name}
                        </Tab>
                    ))
                }
            </TabWrapper>
            <MyPageContent>
                {currentMyPageView === "photo" ? <PhotoReview setOpenPhotoModal={setOpenPhotoModal}
                                                              setModalImgSrc={setModalImgSrc}/>
                    : currentMyPageView === "review" ? <Review/>
                        : <Favorite/>}
            </MyPageContent>
            {openPhotoModal && (<Modal>
                <ModalContainer>
                    <ModalImg src={modalImgSrc}/>
                    <ModalCloseBtn className="material-symbols-rounded" onClick={closePhotoModal}>Close</ModalCloseBtn>
                </ModalContainer>
            </Modal>)}
        </Base>
    )
}

export default MyPage;