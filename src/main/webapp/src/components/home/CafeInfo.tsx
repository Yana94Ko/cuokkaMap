import React from 'react';
import styled from "styled-components"
import {CloseBtn} from "./PostCafeInfo";
import {Button, Icon, Tag} from "../../styles/common";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: fit-content;
  position: absolute;
  z-index: 1000;
  top: 100px;
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


const CafeInfo = () => {
    return (
        <Base>
            <CloseBtn className="material-symbols-rounded">close</CloseBtn>
            <CafeInfoWrapper>
                {/*클릭한 카페 이름*/}
                <PlaceName>라운드브릭</PlaceName>
                <Item>
                    <LabelIcon className="material-symbols-rounded">location_on</LabelIcon>
                    {/*클릭한 카페 주소*/}
                    <Info>서울 광진구 광장로 67 1층 라운드브릭</Info>
                </Item>
                <Item>
                    <LabelIcon className="material-symbols-rounded">phone_enabled</LabelIcon>
                    {/*클릭한 카페 전화번호*/}
                    <Info>02-1234-5678</Info>
                </Item>
                <Label>옵션</Label>
                {/*클릭한 카페의 옵션*/}
                <Tag clickable={false}>락토프리우유</Tag>
                <Tag clickable={false}>두유</Tag>
                <Tag clickable={false}>오트밀크</Tag>
                <InfoRequestBtn>정보수정요청</InfoRequestBtn>
            </CafeInfoWrapper>
        </Base>
    )
}

export default CafeInfo;