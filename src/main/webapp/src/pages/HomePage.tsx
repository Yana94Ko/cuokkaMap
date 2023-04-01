import React,{useState, useEffect} from 'react';
import {useSelector} from "react-redux";

import {RootState} from "../modules";
import Modal from "../components/Modal";
import KakaoMap from "../components/home/KakaoMap";
import KakaoLogin from "../components/home/header/KakaoLogin";



function HomePage() {
    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const [searchDBKeyword, setSearchDBKeyword] = useState("");
    const [dbData, setDBData] = useState<any[]>();
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
            console.log("마커지우러 왔어요 0 " ,markers ? 0 :markers.length)
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            setMarkers([]);
            //markers = [];
        }

    }

    function searchDB(){
        removeMarker()
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
                setDBData(JSON.parse(data).map((i: any) => JSON.parse(i.place_info)));
            }).catch(err => console.log("에러", err));
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
            {dbData && <KakaoMap dbData={dbData} setDBData={setDBData} setSearchDBKeyword={setSearchDBKeyword} markers={markers} setMarkers={setMarkers} removeMarker={removeMarker}/>}

        </>
    )
}

export default HomePage;