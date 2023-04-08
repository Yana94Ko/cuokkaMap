import React, {useEffect} from 'react';
import styled, {css} from "styled-components";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../modules";
import {setCurrentMyPageView, setIsOpenedCafeInfo, setIsOpenedPostCafe} from "../modules/viewReducer";
import Header from "../components/mypage/Header";
import PhotoReview from "../components/mypage/PhotoReview";
import Review from "../components/mypage/Review";
import Bookmark from "../components/mypage/Bookmark";

const Base = styled.main`
  width: 100vw;
  height: 100vh;
  padding: 3rem 8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${props => props.theme.windowSize.laptop} {
    padding: 2rem 5rem;
  }
  @media ${props => props.theme.windowSize.tablet} {
    padding: 2rem 4rem;
  }
  @media ${props => props.theme.windowSize.mobile} {
    padding: 2rem;

    /* mobile viewport bug fix */
    /* iOS only */
    @supports (-webkit-touch-callout: none) {
      min-height: -webkit-fill-available;
    }
  }
`;

const TabWrapper = styled.div`
  margin-top: 50px;
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
  `}
  &:hover {
    background-color: ${props => props.theme.color.lightGray}80;
  }
`;

const MyPageContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 50px;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${props => props.theme.windowSize.tablet} {
    margin-top: 1rem;
  }
`;

const Notice = styled.h1`
  position: absolute;
  text-align: center;
  width: 100vw;
  top: 50%;
  left: 0;
  font-size: ${props => props.theme.fontSize.lg};
  word-break: keep-all;
`;

type TabProps = {
    name: string,
    id: string
}

const MyPage = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);
    const {
        currentMyPageView,
        isOpenedPostCafe,
        isOpenedCafeInfo
    } = useSelector((state: RootState) => state.viewReducer);

    useEffect(() => {
        dispatch(setCurrentMyPageView("photo"));
    }, []);

    useEffect(() => {
        if (!isLoggedin) {
            navigate("/");
            window.location.reload();
        }
        if (isOpenedPostCafe) {
            dispatch(setIsOpenedPostCafe(false));
        }
        if (isOpenedCafeInfo) {
            dispatch(setIsOpenedCafeInfo(false));
        }
    });

    const myPageContent: TabProps[] = [
        {
            name: "사진",
            id: "photo"
        },
        {
            name: "후기",
            id: "review"
        },
        {
            name: "북마크",
            id: "bookmark"
        },
    ];

    const onTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(setCurrentMyPageView(e.currentTarget.id));
    }
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
                {currentMyPageView === "photo" ? <PhotoReview/>
                    : currentMyPageView === "review" ? <Review/>
                        : <Bookmark/>}
            </MyPageContent>
        </Base>
    )
}

export default MyPage;