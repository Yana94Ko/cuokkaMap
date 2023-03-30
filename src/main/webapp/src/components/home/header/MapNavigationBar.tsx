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
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.color.white};
  box-shadow: 0 0 5px rgb(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 0.5rem 1rem;
`;

const Logo = styled.img`
  height: 40px;
`;
const SearchInput = styled(Input)`
  width: 30vw;
  background-color: transparent;
  border: none;
  color: ${props => props.theme.color.primary};

  &:focus {
    border: none;

  }
`;
const NavLoginOrMyPage = styled.div`
  flex-grow: 1;
  width: 100%;
  text-align: right;
`;
const NavBtn = styled(Button)`
  background-color: ${props => props.theme.color.white};
  padding: 0.5rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);

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

    //로그인 여부
    // const [isLogin, setIsLogin] = useState<boolean>(false);
    //cafeDummy.json 받아올 state
    const [dummyData, setDummyData] = useState<any[]>();
    //search input 핸들링하는 state
    const [searchValue, setSearchValue] = useState<string>("");
    //마이페이지 마우스 호버 여부
    const [isMypage, setIsMypage] = useState<boolean>(false);

    // const [showLogin, setShowLogin] = useState<boolean>(false);

    //로딩되면 DummyData 세팅
    useEffect(() => {
        setDummyData(data);
    }, [])

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
        let count: number = 0;
        if (dummyData) {
            for (let i = 0; i < dummyData.length; i++) {
                if (dummyData[i].name.includes(searchValue)) {
                    setConfirmCafeInfo(true);
                    setSearchedPlaceInfoInNav((searchedPlaceInfoInNav) => [...searchedPlaceInfoInNav, dummyData[i]]);
                } else {
                    count++;
                }
            }
            if (count === dummyData.length) {
                alert("검색 결과가 없습니다.");
                setSearchValue("");
            }
        }

        //검색하면 axios로 백에 요청 보낼거시기
        //검색버튼이 눌리면 해당 name을 서버에 보내서 DB조회 후 이름이 같은 놈을 받을것임..
        //받은 놈을 state 배열에 넣고, KakaoMap에 보내서 마커를 다른놈으로 만들어야 한다
        // axios.post('유알엘', {
        //     data: {
        //         "searchedInfo":searchedInfo
        //     }
        //})
        //.then(res => setSearchedPlaceInfoInNav(res.json())
        //.catch(err => {console.log(err)};
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