import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import FilterContainer from "./FilterContainer";
import {Button, Icon, Input} from "../../../styles/common";
import MyPageList from "./MyPageList";
import {setCurrentFilter, setIsBookmarkMode} from "../../../modules/filterReducer";
import {RootState} from "../../../modules";
import {setIsOpenedMyPageList} from "../../../modules/viewReducer";


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
    width: 500px;
  }
  @media ${props => props.theme.windowSize.mobile} {
    width: 100vw;
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
  padding: 0 2rem;

  &:focus {
    border: none;
  }

  &::placeholder {
    color: ${props => props.theme.color.text};
    font-weight: 300;
  }

  @media ${props => props.theme.windowSize.mobile} {
    padding: 0 1rem;
  }
`;
const NavLoginOrMyPage = styled.div`
  position: relative;
  width: 100px;
  display: flex;
  justify-content: end;
  @media ${props => props.theme.windowSize.mobile} {
    width: 70px;
  }
`;
const NavBtn = styled(Button)`
  background-color: ${props => props.theme.color.white};
  padding: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  @media (hover: hover) {
    &:hover {
      transform: scale(110%);
    }
  }

  a {
    color: white;
    text-decoration: none !important;
  }
`;

const NavIcon = styled(Icon)`
  color: ${props => props.theme.color.primary};
  transition: all 0.1s ease-in-out;

  @media (hover: hover) {
    &:hover {
      transform: scale(110%);
    }
  }
`;


interface PropsToKaKaoMap {
    setSearchedPlaceInfoInNav: React.Dispatch<React.SetStateAction<object[] | null>>;
    removeMarker: () => void;
    setDBData: React.Dispatch<React.SetStateAction<any[]>>;
    setSearchDBKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({
                    setSearchedPlaceInfoInNav,
                    removeMarker,
                    setDBData,
                    setSearchDBKeyword
                }: PropsToKaKaoMap) => {
    const dispatch = useDispatch();

    const isOpenedMyPageList = useSelector((state: RootState) => state.viewReducer.isOpenedMyPageList);

    const searchInput = useRef<HTMLInputElement>(null);


    //search input 핸들링하는 state
    const [searchValue, setSearchValue] = useState<string>("");
    //마이페이지 마우스 호버 여부
    // const [isMypage, setIsMypage] = useState<boolean>(false);
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
        dispatch(setCurrentFilter([]));
        setSearchDBKeyword(searchValue);
        setSearchedPlaceInfoInNav([]);
        setSearchValue("")
    }

    //카페찾기 input에 enter 이벤트
    const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            removeMarker();

            if (searchValue === "") {
                alert("검색어가 입력되지 않았습니다");
                return;
            }
            dispatch(setCurrentFilter([]));
            setSearchDBKeyword(searchValue);
            setSearchedPlaceInfoInNav([]);
            //[YANA] 키워드 검색시 북마크 해제
            dispatch(setIsBookmarkMode(false));
            setSearchValue("")

            // 모바일에서 엔터키로 검색 시 키보드창이 닫기지 않는 이슈 해결하기 위한 코드
            searchInput.current.blur();
        }
    }

    return (
        <Base>
            <InputWrapper>
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"}/>
                <SearchInput autoComplete="off" type="text" id="search" value={searchValue} ref={searchInput}
                             onKeyPress={activeEnter}
                             onChange={searchInputChangeHandler}
                             placeholder="커카맵에 등록된 카페를 검색해보세요!"
                />
                <NavIcon className="material-symbols-rounded" onClick={searchPlaceSubmitHandler}>search</NavIcon>
            </InputWrapper>
            <FilterContainer setSearchDBKeyword={setSearchDBKeyword}/>
            <NavLoginOrMyPage>
                <NavBtn className="myPageList" onClick={() => dispatch(setIsOpenedMyPageList(!isOpenedMyPageList))}>
                    <NavIcon className="material-symbols-rounded myPageList">person</NavIcon>
                </NavBtn>
                {isOpenedMyPageList && <MyPageList/>}
            </NavLoginOrMyPage>
        </Base>
    );
}

export default Header;