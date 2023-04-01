import React from 'react';
import styled from "styled-components";
import {Icon} from "../../styles/common";


const Base = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 50px;
  right: 50px;
  border-radius: 10px;
  width: 350px;
  height: 150px;
  overflow: hidden;
  z-index:200;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
`;
const CloseBtn = styled(Icon)` 
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    display: block;
    z-index: 100;
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
            <CloseBtn onClick={closeBanner} className="material-symbols-rounded">close</CloseBtn>
            {/*TODO(hwanyb): 구글 설문조사 배너*/}
            {/*- 이미지 src 채워야 함*/}
            {/*assignees: hwanyb*/}
            <a href="https://forms.gle/HHW9noC2oHbwziV49" target="_blank"><BannerImg src={process.env.PUBLIC_URL + "/assets/images/survey/survey.png"} alt="구글 설문조사 배너"/></a>
        </Base>
    )
}

export default Banner;