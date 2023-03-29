import React from 'react';
import styled from "styled-components";

import Icon from "../common/Icon";

const Base = styled.div`
  background-color: #fff;
  position: fixed;
  bottom: 50px;
  right: 50px;
  border-radius: 10px;
  width: 300px;
  height: 150px;
  overflow: hidden;
`;
const CloseBtn = styled(Icon)` 
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
    display: block;
`;
const BannerImg = styled.img``;
const Banner = () => {
    return (
        <Base>
            <CloseBtn>close</CloseBtn>
            {/*TODO(hwanyb): 구글 설문조사 배너*/}
            {/*- 이미지 src 채워야 함*/}
            {/*assignees: hwanyb*/}
            <BannerImg alt="구글 설문조사 배너"/>
        </Base>
    )
}

export default Banner;