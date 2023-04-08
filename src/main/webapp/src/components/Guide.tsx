import React, {useState} from 'react';
import styled from "styled-components";

const Base = styled.div`
  width:210vh;
  height:100vh;
  background-color: rgba(0,0,0,0.5);
  z-index:99999;
  position:absolute;
  left:0;
  top:0;
  color:white;
`;

const CloseBtn = styled.span`
  font-size:1.3rem;
  cursor:pointer;
  position:absolute;
  top:5rem;
  right:10rem;
  @media ${props => props.theme.windowSize.mobile} {
    left:25rem;
    top:65rem !important;
  }
`;

const FilterGuide1 = styled.div`
  position:absolute;
  top:8rem;
  left:58rem;
  border:2px solid white;
  width:fit-content;
  padding:20px;
  border-radius:15px;
  @media ${props => props.theme.windowSize.mobile} {
    top:10rem;
    left:0.25rem;
  }
`;

const FilterGuide2 = styled.div`
  position:absolute;
  bottom:10rem;
  left:51rem;
  border:2px solid white;
  width:fit-content;
  padding:20px;
  border-radius:15px;
  @media ${props => props.theme.windowSize.mobile} {
    left:2.8rem;
  }
`;
const Guide = () => {
    const [openGuide, setOpenGuide] = useState<boolean>(true);

    const closeGuide = () => {
        setOpenGuide(false);
    }
    return(
        <>
            {
                openGuide &&
                (<Base>
                    <CloseBtn onClick={closeGuide}>닫기</CloseBtn>
                    <FilterGuide1>
                        <p>👆 각 필터를 클릭해 해당 옵션을 제공하는 카페를 빠르게 찾아보세요!</p>
                    </FilterGuide1>
                    <FilterGuide2>
                        <p>👇 내가 아는 대체유 제공 카페를 커카맵에 추가해보세요!</p>
                    </FilterGuide2>
                </Base>)
            }
        </>
    )
}

export default Guide;