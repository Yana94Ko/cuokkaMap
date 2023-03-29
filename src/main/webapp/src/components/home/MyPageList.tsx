import React from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';

const MyPageList:React.FC = () => {


    return(
        <div>
            <ul>
                <li>cuokkamap@gmail.com</li>
                <li>내 사진</li>
                <li>내 후기</li>
                <li>의견 보내기</li>
                <li>로그아웃</li>
            </ul>
        </div>
    )
}

export default MyPageList