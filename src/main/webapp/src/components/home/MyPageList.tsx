import React from 'react';
import styled from "styled-components";
import axios from "axios";
import {Link} from 'react-router-dom';

const Base = styled.div`
    background-color:white;
  padding-left:10vw;
`;

const MyPageList:React.FC = () => {


    return(
        <Base>
            <ul>
                <li>cuokkamap@gmail.com</li>
                <li>내 사진</li>
                <li>내 후기</li>
                <li>의견 보내기</li>
                <li>로그아웃</li>
            </ul>
        </Base>
    )
}

export default MyPageList