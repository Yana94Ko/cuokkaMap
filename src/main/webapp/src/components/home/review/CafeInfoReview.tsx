import React from "react";
import styled from "styled-components";
import {Button, Tag} from "../../../styles/common";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: calc(330px + 45vh);
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 400px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2rem;
`;
const UploadReview = styled.div`
  height:330px;
  background-color:rgba(0,0,0,0.1);
`;
const ShowReview = styled.div`
  height:45vh;
  background-color:rgba(0,0,0,0.2);
`;

const CafeInfoReview = () => {
    return(
        <Base>
            <UploadReview>
                <h3>이 카페 추천 키워드</h3>
               
                <Button>후기 올리기</Button>
            </UploadReview>
            <ShowReview>

            </ShowReview>
        </Base>
    )
}

export default CafeInfoReview;