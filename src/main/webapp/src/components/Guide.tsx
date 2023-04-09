import React, {useState} from 'react';
import styled from "styled-components";

import {Icon} from "../styles/common";

const Base = styled.div`
  width:100vw;
  height:100vh;
  background-color: rgba(0,0,0,0.5);
  z-index:999;
  position:absolute;
  left:0;
  top:0;
`;

const CloseBtn = styled(Icon)`
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
  font-size: ${props => props.theme.fontSize.xl};
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  backdrop-filter: blur(2px);
  padding: 1rem;
`;

const FilterGuide1 = styled.div`
  position: absolute;
  top: 8rem;
  left: 45vw;
  border: 1px solid ${props => props.theme.color.primary};
  width: fit-content;
  padding: 2rem;
  border-radius: 1rem;
  word-break: keep-all;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  @media ${props => props.theme.windowSize.laptop} {
    width: 90%;
    left: 50%;
    top: 12rem;
    transform: translateX(-50%);
  }
  @media ${props => props.theme.windowSize.mobile} {
    top: 10rem;
  }
`;

const FilterGuide2 = styled.div`
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid ${props => props.theme.color.primary};
  width: fit-content;
  padding: 2rem;
  border-radius: 1rem;
  word-break: keep-all;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  @media ${props => props.theme.windowSize.tablet} {
    width: 90%;
  }
  @media ${props => props.theme.windowSize.mobile} {
    bottom: 11rem;
  }
`;
const Guide = () => {
    const [openGuide, setOpenGuide] = useState<boolean>(true);

    const closeGuide = () => {
        setOpenGuide(false);
    }
    return (
        <>
            {openGuide &&
                (
                    <Base>
                        <CloseBtn className="material-symbols-rounded" onClick={closeGuide}>close</CloseBtn>
                        <FilterGuide1>
                            <p>👆 각 필터를 클릭해 해당 옵션을 제공하는 카페를 빠르게 찾아보세요!</p>
                        </FilterGuide1>
                        <FilterGuide2>
                            <p>👇 내가 아는 대체유 제공 카페를 커카맵에 추가해보세요!</p>
                        </FilterGuide2>
                    </Base>
                )}
        </>
    )
}

export default Guide;