import React from 'react';
import {useSelector} from "react-redux";

import {RootState} from "../modules";
import Modal from "../components/Modal";
import KakaoMap from "../components/home/KakaoMap";
import KakaoLogin from "../components/home/header/KakaoLogin";

function HomePage() {
    const isOpenedLoginModal = useSelector((state: RootState) => state.userReducer.isOpenedLoginModal);

    return (
        <>
            {
                isOpenedLoginModal && (
                    <Modal>
                        <KakaoLogin/>
                    </Modal>
                )
            }
            <KakaoMap/>

        </>
    )
}

export default HomePage;