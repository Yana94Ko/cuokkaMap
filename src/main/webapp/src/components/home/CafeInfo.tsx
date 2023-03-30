import React, {useState, useEffect} from 'react';
import styled from "styled-components"

import {CloseBtn} from "./PostCafeInfo";
import {Button, Icon, Tag} from "../../styles/common";
import {useDispatch} from "react-redux";
import {setIsOpenedCafeInfo} from "../../modules/viewReducer";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: fit-content;
  position: absolute;
  z-index: 1000;
  top: 150px;
  left: 50px;
  padding: 2rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2rem;
`;
const CafeInfoWrapper = styled.div``;
const PlaceName = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 900;
  margin-bottom: 4rem;
`;
const Item = styled.div`
  display: flex;
  line-height: 2rem;
  margin-bottom: 1.5rem;
`;
const LabelIcon = styled(Icon)`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;
const Info = styled.div`
  font-size: ${props => props.theme.fontSize.base};
  font-weight: 500;
`;
const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.base};
  font-weight: 700;
  margin-bottom: 10px;
`;
const InfoRequestBtn = styled(Button)`
  width: 100%;
  margin-top: 4rem;
  background-color: ${props => props.theme.color.gray};
  color: ${props => props.theme.color.darkGray};
`;

type CafeInfoProps = {
    cafeInfoContainer: any;
}
const CafeInfo = ({cafeInfoContainer}: CafeInfoProps) => {
    const dispatch = useDispatch();
    const clickedData = {...cafeInfoContainer};

    const closeCafeInfo = () => {
        dispatch(setIsOpenedCafeInfo(false));
    }
    // TODO(FE): 카페상세정보 DB요청한 후 받은 데이터로 렌더링하기
    // 카페 상세정보 DB 완성되면 진행하면 됩니다
    // assignees: hwanyb, SeongSilver
    return (
        <Base>
            <CloseBtn className="material-symbols-rounded" onClick={closeCafeInfo}>close</CloseBtn>
            {
                clickedData !== undefined && (

                    <CafeInfoWrapper>
                        {/*    /!*클릭한 카페 이름*!/*/}
                        <PlaceName>{clickedData.name}</PlaceName>
                        <Item>
                            <LabelIcon className="material-symbols-rounded">location_on</LabelIcon>
                            {/*클릭한 카페 주소*/}
                            <Info>{clickedData.address}</Info>
                        </Item>
                        <Item>
                            <LabelIcon className="material-symbols-rounded">phone_enabled</LabelIcon>
                            {/*클릭한 카페 전화번호*/}
                            <Info>{clickedData.phone}</Info>
                        </Item>
                        {/*<Label>옵션</Label>*/}
                        {/*{*/}
                        {/*    clickedData.tag.map((tag: string) => (*/}
                        {/*        <Tag clickable={false} active={true}>{tag}</Tag>*/}
                        {/*    ))*/}
                        {/*}*/}

                        <InfoRequestBtn>정보수정요청</InfoRequestBtn>
                    </CafeInfoWrapper>


                ) //ddd
            }

        </Base>
    )
}

export default CafeInfo;