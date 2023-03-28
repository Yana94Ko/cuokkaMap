import React, {useState, useRef, useEffect} from 'react';
import {Link} from "react-router-dom";
import FilterContainer from "./FilterContainer";
import styled from "styled-components";
import axios from "axios";
import data from "../cafeDummy.json";
import CafeInfo from "../CafeInfo";
import {Button, Tag, Icon, Input} from "../../../styles/common";

interface PropsToKaKaoMap {
    setSearchedPlaceInfoInNav: React.Dispatch<React.SetStateAction<object[] | null>>;
    setConfirmCafeInfo: React.Dispatch<React.SetStateAction<boolean>>;

    displayDBPlaces:(places:any[]) => void;
}

const MapNavigationBar = ({setSearchedPlaceInfoInNav, setConfirmCafeInfo, displayDBPlaces}:PropsToKaKaoMap) => {
    //로그인 여부
    const [isLogin, setIsLogin] = useState<boolean>(false);

    //cafeDummy.json 받아올 state
    const [dummyData, setDummyData] = useState<any[]>();



    //로딩되면 DummyData 세팅
    useEffect(() => {
        setDummyData(data);
    }, [])

    const search = useRef<HTMLInputElement>(null);
    // //검색하면 axios로 백에 요청 보낼거시기

    const searchPlaceSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const searchedInfo = search.current!.value;
        if(searchedInfo === ""){
            alert("검색어가 입력되지 않았습니다");
        }

        setSearchedPlaceInfoInNav([]);

        if(dummyData){
            for(let i=0;i<dummyData.length;i++){
                if(dummyData[i].name.includes(searchedInfo) ) {
                    setConfirmCafeInfo(true);
                    setSearchedPlaceInfoInNav((searchedPlaceInfoInNav) => [...searchedPlaceInfoInNav,dummyData[i]]);
                };
            }
        }

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

    const Base = styled.div`
      width:96vw;
      height:5vh;
      position: absolute;
      top:2vh;
      left:2vw;
      z-index: 1000;
      display:flex;
      justify-content:space-between;
    `;
    const NavContentSearch = styled.div`
      flex-grow: 1;
        width:70%;
      display:flex;
      margin-right:3vw;
    `;
    const NavContentFilter = styled.div`
        flex-grow:2;
        width:100%;
    `;
    const NavLoginOrMyPage = styled.div`
        flex-grow:1;
        width:100%;
      text-align:right;
    `;
    const NavBtn = styled(Button)`
      a{
        color:white;
        text-decoration:none !important;
      }
    `;
    return (
        <Base>
            <NavContentSearch>
                {/*<label htmlFor="search">장소|주소 검색</label>*/}
                <Input type="text" id="search" ref={search}/>&ensp;
                <Button type="button" value="검색" onClick={searchPlaceSubmitHandler}>
                    <Icon className="material-symbols-rounded">Search</Icon>
                </Button>
            </NavContentSearch>
            <NavContentFilter>
                <FilterContainer/>
            </NavContentFilter>
            <NavLoginOrMyPage>
                {
                    isLogin ? (
                        <NavBtn>
                            <Link to="/mypage">
                                <span className="material-symbols-rounded">person</span>
                            </Link>
                        </NavBtn>
                    ):(
                        <NavBtn>
                            <Link to="/login">
                                <span className="material-symbols-rounded">login</span>
                            </Link>
                        </NavBtn>)
                }
            </NavLoginOrMyPage>
        </Base>
    );
}

export default MapNavigationBar;