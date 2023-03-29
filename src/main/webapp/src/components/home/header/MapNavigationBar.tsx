import React, {useState, useRef, useEffect} from 'react';
import {Link} from "react-router-dom";
import FilterContainer from "./FilterContainer";
import styled from "styled-components";
import axios from "axios";
import data from "../../../cafeDummy.json";
import CafeInfo from "../CafeInfo";
import {Button, Tag, Icon, Input} from "../../../styles/common";
import MyPageList from "../MyPageList";
import Modal from "../../Modal";
import KakaoLogin from "./KakaoLogin";

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

const Logo = styled.img``;
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
    // background-color: ${props => props.theme.color.white};
  a {
    color: white;
    text-decoration: none !important;
  }
`;
const MapNavigationBar = ({setSearchedPlaceInfoInNav, setConfirmCafeInfo, removeMarker}: PropsToKaKaoMap) => {
    //로그인 여부
    const [isLogin, setIsLogin] = useState<boolean>(false);
    //cafeDummy.json 받아올 state
    const [dummyData, setDummyData] = useState<any[]>();
    //search input 핸들링하는 state
    const [searchValue, setSearchValue] = useState<string>("");
    //마이페이지 마우스 호버 여부
    const [isMypage, setIsMypage] = useState<boolean>(false);

    const [showLogin, setShowLogin] = useState<boolean>(false);

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

    const onLoginClick = () => {
        setShowLogin(true)
    }
    return (
        <Base>
            {/*<label htmlFor="search">장소|주소 검색</label>*/}

            <InputWrapper>
                <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"}/>
                <SearchInput autoComplete="off" type="text" id="search" value={searchValue}
                             onChange={searchInputChangeHandler}/>
                <Icon className="material-symbols-rounded" onClick={searchPlaceSubmitHandler}>search</Icon>

            </InputWrapper>
            <FilterContainer/>
            <NavLoginOrMyPage>
                {
                    isLogin ? (
                        <div onMouseMove={openMyPageList} onMouseOut={closeMyPageList}>
                            <NavBtn onMouseMove={openMyPageList} onMouseOut={closeMyPageList}>
                                <Link to="/mypage">
                                    <span className="material-symbols-rounded">person</span>
                                </Link>
                            </NavBtn>
                            {isMypage && <MyPageList/>}
                        </div>
                    ) : (
                        <NavBtn onClick={onLoginClick}>
                            <span className="material-symbols-rounded">login</span>
                        </NavBtn>)
                }
            </NavLoginOrMyPage>
            {
                showLogin && (
                    <Modal>
                        <KakaoLogin/>
                    </Modal>
                )
            }
        </Base>
    );
}

export default MapNavigationBar;