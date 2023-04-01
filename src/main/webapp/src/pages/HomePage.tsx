import React,{useState, useEffect} from 'react';
import {useSelector} from "react-redux";

import {RootState} from "../modules";
import Modal from "../components/Modal";
import KakaoMap from "../components/home/KakaoMap";
import KakaoLogin from "../components/home/header/KakaoLogin";

function HomePage() {
    const [dbData, setDBData] = useState<any[]>();

    useEffect(() => {
        loadEntireData()
    },[]);

    function loadEntireData(){
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter": [],
                "keywords": "",
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
            {dbData && <KakaoMap dbData={dbData} setDBData={setDBData}/>}

        </>
    )
}

export default HomePage;