import React from 'react';
import styled from "styled-components";
import {Icon} from "../../styles/common";


const Base = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 50px;
  right: 50px;
  border-radius: 10px;
  width: 300px;
  height: 150px;
  overflow: hidden;
  z-index:200;
`;
const CloseBtn = styled(Icon)` 
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
    display: block;
`;

type BannerProps = {
    setOpenBanner: (openBanner: boolean) => void;
}

const BannerImg = styled.img``;
const Banner = ({setOpenBanner}: BannerProps) => {
    const closeBanner = () => {
        setOpenBanner(false);
    }

    return (
        <Base>
            <CloseBtn onClick={closeBanner}>close</CloseBtn>
            {/*TODO(hwanyb): 구글 설문조사 배너*/}
            {/*- 이미지 src 채워야 함*/}
            {/*assignees: hwanyb*/}
            <a href="https://forms.gle/HHW9noC2oHbwziV49" target="_blank"><BannerImg alt="구글 설문조사 배너"/></a>
        </Base>
    )
}

export default Banner;