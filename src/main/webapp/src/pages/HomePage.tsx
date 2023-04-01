import React,{useState, useEffect} from 'react';
import {useSelector} from "react-redux";

import {RootState} from "../modules";
import Modal from "../components/Modal";
import KakaoMap from "../components/home/KakaoMap";
import KakaoLogin from "../components/home/header/KakaoLogin";



function HomePage() {
    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const [searchDBKeyword, setSearchDBKeyword] = useState("");
    //db에서 받아온 카페정보만 담은 데이터
    const [dbData, setDBData] = useState<any[]>();
    //db에서 받아온 필터만 담은 데이터
    const [dbFilterData, setDBFilterData] = useState<any[]>();
    const [markers, setMarkers] = useState<any[]>();

    useEffect(() => {
        console.log("필터 : ", currentFilter)
        console.log("키워드 : ", searchDBKeyword)
        searchDB()
    },[currentFilter, searchDBKeyword]);

    //모든 마커를 제거하는 함수
    function removeMarker() {

        //DB검색한 것이 있을때
        if(markers !== undefined) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            setMarkers([]);
            //markers = [];
        }

    }
    function searchDB(){
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter": currentFilter === undefined ? [] : currentFilter,
                "keywords": searchDBKeyword === undefined ? "" : searchDBKeyword,
            }),
        })
            .then(response => response.text())
            .then(function (data: any) {
                if(JSON.parse(data).length === 0){
                    alert("검색어가 존재하지 않습니다");
                }else{
                    setDBFilterData(JSON.parse(data).map((filter:any) => filter.filter_type));
                    setDBData(JSON.parse(data).map((i: any) => JSON.parse(i.place_info)));
                }
            })
            .catch(err => console.log("에러", err));
    }


    const isOpenedLoginModal = useSelector((state: RootState) => state.userReducer.isOpenedLoginModal);

    return (
        <>
            {
                isOpenedLoginModal && (
                    <Modal>
                        <KakaoLogin />
                    </Modal>
                )
            }
            {dbData && <KakaoMap dbData={dbData} setDBData={setDBData} setSearchDBKeyword={setSearchDBKeyword} markers={markers} setMarkers={setMarkers} removeMarker={removeMarker} dbFilterData={dbFilterData}/>}

        </>
    )
}

export default HomePage;