import React, {useState, useRef, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import FilterContainer from "./FilterContainer";
import data from "../../../cafeDummy.json";
import {Button, Tag, Icon, Input} from "../../../styles/common";
import MyPageList from "../MyPageList";
import {RootState} from "../../../modules";
import {setIsOpenedLoginModal} from "../../../modules/userReducer";

interface PropsToKaKaoMap {
    setSearchedPlaceInfoInNav: React.Dispatch<React.SetStateAction<object[] | null>>;
    setConfirmCafeInfo: React.Dispatch<React.SetStateAction<boolean>>;
    removeMarker: () => void;

}

const Base = styled.div`
  width: 100%;
  height: fit-content;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem;
  @media ${props => props.theme.windowSize.mobile} {
    padding: 2rem;
  }
`;
const InputWrapper = styled.div`
  width: 400px;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.color.white};
  box-shadow: 0 0 5px rgb(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  @media ${props => props.theme.windowSize.tablet} {
    width: 350px;

  }
  @media ${props => props.theme.windowSize.mobile} {
    width: 70vw;
  }
`;

const Logo = styled.img`
  height: 40px;
  @media ${props => props.theme.windowSize.mobile} {
    height: 30px;

  }
`;
const SearchInput = styled(Input)`
  background-color: transparent;
  border: none;
  font-weight: 500;

  &:focus {
    border: none;
  }

  @media ${props => props.theme.windowSize.mobile} {
    padding: 0 1.5rem;
  }
`;
const NavLoginOrMyPage = styled.div``;
const NavBtn = styled(Button)`
  background-color: ${props => props.theme.color.white};
  padding: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  a {
    color: white;
    text-decoration: none !important;
  }
`;

const NavIcon = styled(Icon)`
  color: ${props => props.theme.color.primary};
`;


const MapNavigationBar = ({setSearchedPlaceInfoInNav, setConfirmCafeInfo, removeMarker}: PropsToKaKaoMap) => {
    const isLoggedin = useSelector((state: RootState) => state.userReducer.isLoggedin);
    const dispatch = useDispatch();

    //search input 핸들링하는 state
    const [searchValue, setSearchValue] = useState<string>("");
    //마이페이지 마우스 호버 여부
    const [isMypage, setIsMypage] = useState<boolean>(false);
    const [tag, setTag] = useState<any>();
    const searchInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }


    const searchPlaceSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        removeMarker();

        if (searchValue === "") {
            alert("검색어가 입력되지 않았습니다");
            return;
        }

        setSearchedPlaceInfoInNav([]);
        // TODO(FE): DB 결과 없을 시 알림
        // assignees: hwanyb
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter": [],
                "keywords": searchValue,
            }),
        })
            .then(response => response.text())
            .then(function (data: any) {
                const searchedCafe = JSON.parse(data).map((i: any) => JSON.parse(i.place_info));
                setSearchedPlaceInfoInNav(searchedCafe);

            }).catch(err => console.log("에러", err));
        setSearchValue("")
    }
    const openMyPageList = (): void => {
        setIsMypage(true);
    }
    const closeMyPageList = (): void => {
        setIsMypage(false);
    }

    return (
        <Base>
            <InputWrapper>
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"}/>
                <SearchInput autoComplete="off" type="text" id="search" value={searchValue}
                             onChange={searchInputChangeHandler}/>
                <NavIcon className="material-symbols-rounded" onClick={searchPlaceSubmitHandler}>search</NavIcon>
            </InputWrapper>
            <FilterContainer/>
            <NavLoginOrMyPage>
                {
                    isLoggedin ? (
                        <div onMouseMove={openMyPageList} onMouseOut={closeMyPageList}>
                            <NavBtn onMouseMove={openMyPageList} onMouseOut={closeMyPageList}>
                                <Link to="/mypage">
                                    <NavIcon className="material-symbols-rounded">person</NavIcon>
                                </Link>
                            </NavBtn>
                            {isMypage && <MyPageList/>}
                        </div>
                    ) : (
                        <NavBtn onClick={() => dispatch(setIsOpenedLoginModal(true))}>
                            <NavIcon className="material-symbols-rounded">login</NavIcon>
                        </NavBtn>)
                }
            </NavLoginOrMyPage>
        </Base>
    );
}

export default MapNavigationBar;