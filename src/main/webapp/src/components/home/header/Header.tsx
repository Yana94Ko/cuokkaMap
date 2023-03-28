import React, {useState, useRef, useEffect} from 'react';
import {Link} from "react-router-dom";
import FilterContainer from "./FilterContainer";
import styled from "styled-components";
import axios from "axios";
import data from "../cafeDummy.json";
import CafeInfo from "../CafeInfo";


const Header: React.FC = () => {
    //cafeDummy.json 받아올 state
    const [dummyData, setDummyData] = useState<any[]>();

    const [filteredCafeInfo, setFilteredCafeInfo] = useState<object>();

    const [confirmCafeInfo, setConfirmCafeInfo] = useState<boolean>(false);

    //로딩되면 DummyData 세팅
    useEffect(() => {
        setDummyData(data);
    }, [])

    const search = useRef<HTMLInputElement>(null);
    // //검색하면 axios로 백에 요청 보낼거시기

    const searchPlaceSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const searchedInfo = search.current!.value;

        if(dummyData){
            for(let cafe of dummyData){
                if(cafe.name.includes(searchedInfo) | cafe.address.includes(searchedInfo)) {
                    setConfirmCafeInfo(true);
                    console.log(cafe);
                };
            }
        }
        // axios.post('유알엘', {
        //     data: {
        //         "searchedInfo":searchedInfo
        //     }
        // })
    }

    const Base = styled.div`position: absolute;
      z-index: 100
    `;

    return (
        <Base>
            <form onSubmit={searchPlaceSubmitHandler}>
                {/*<label htmlFor="search">장소|주소 검색</label>*/}
                <input type="text" id="search" ref={search}/>&ensp;
                <input type="button" value="검색"/>
            </form>
            <FilterContainer/>
            <Link to="/login">로그인</Link>
            <Link to="/mypage">마이페이지</Link>
        </Base>
    );
}

export default Header;