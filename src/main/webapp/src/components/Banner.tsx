import React from 'react';
import styled from "styled-components";
import {Icon} from "../styles/common";


const Base = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  border-radius: 1rem;
  width: 350px;
  height: 150px;
  overflow: hidden;
  z-index: 200;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  @media ${props => props.theme.windowSize.laptop} {
    bottom: 8rem;
    right: 50%;
    transform: translateX(50%);
  }
  @media ${props => props.theme.windowSize.mobile} {
    bottom: 11rem;
  }
`;
const CloseBtn = styled(Icon)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  display: block;
  z-index: 10011;
  padding: 0.5rem;
  transition: all 0.2s ease-in-out;
  @media (hover: hover) {
    &:hover {
      transform: rotate(90deg);
    }
  }
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
            <a href="https://forms.gle/HHW9noC2oHbwziV49" target="_blank"><BannerImg
                src={process.env.PUBLIC_URL + "/assets/images/survey/survey.png"} alt="구글 설문조사 배너"/></a>
        </Base>
    )
}

export default Banner;