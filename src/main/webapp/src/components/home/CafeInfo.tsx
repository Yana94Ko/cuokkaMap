import React from 'react';
import styled, {css} from "styled-components"

import {CloseBtn} from "./PostCafeInfo";
import {Button, Icon, Tag} from "../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenedCafeInfo} from "../../modules/viewReducer";
import CafeInfoPhotoReview from "./review/CafeInfoPhotoReview";
import CafeInfoReview from "./review/CafeInfoReview";
import {RootState} from "../../modules";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: fit-content;
  position: absolute;
  z-index: 1000;
  top: 15vh;
  left: 50px;
  padding: 2rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 1.5rem;

  @media ${props => props.theme.windowSize.laptop} {
    top: 50%;
    transform: translateY(-50%);
  }
  @media ${props => props.theme.windowSize.tablet} {
    width: 350px;

  }
  @media ${props => props.theme.windowSize.mobile} {
    width: 100%;
    top: calc(100% - 375px);
    bottom: 0;
    left: 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
    
  }
`;
const CafeInfoWrapper = styled.div`
  a {
    outline: none;
    text-decoration: none;
    color: black;
    transition: 0.1s ease-in-out;

    &:hover {
      color: rgb(51, 134, 255);
    }
  }`;
const PlaceName = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 900;
  margin-bottom: 2rem;

  a {
    img {
      position: absolute;
      top: 27px;
    }
  }
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
  margin-bottom: 20px;
`;
const InfoRequestBtn = styled(Button)`
  width: 100%;
  margin-top: 1rem;

  a {
    outline: none;
    text-decoration: none;
    color: white;
  }

  @media ${props => props.theme.windowSize.mobile} {
    margin-bottom: 80px;
  }
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media ${props => props.theme.windowSize.mobile} {
    flex-wrap: nowrap;
    width: 100vw;
    overflow-x: auto;
  }

`;

const StyledTag = styled(Tag)`
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }
`;

type CafeInfoProps = {
    cafeInfoContainer: object;
}

const CafeInfo = ({cafeInfoContainer}: CafeInfoProps) => {
    let dataObject: any = {};
    dataObject = Object.assign({}, cafeInfoContainer);
    const filterArr = dataObject.filter.split(", ");

    const dispatch = useDispatch();

    const closeCafeInfo = () => {
        dispatch(setIsOpenedCafeInfo(false));
    }
    return (
        <Base>
            <CloseBtn className="material-symbols-rounded" onClick={closeCafeInfo}>close</CloseBtn>
            {
                cafeInfoContainer !== undefined && (

                    <CafeInfoWrapper>
                        {dataObject.data.place_url ? (
                            <a href={dataObject.data.place_url} target="_blank"><PlaceName>
                                {dataObject.data.place_name}&emsp;
                                {dataObject.data.insta ? (
                                    <a href={dataObject.data.insta} target="_blank"><img className="insta"
                                                                                         src={process.env.PUBLIC_URL + "/assets/images/markers/insta.png"}
                                                                                         width="30px" alt="insta"/></a>
                                ) : (
                                    <PlaceName>{dataObject.data.insta}</PlaceName>
                                )}
                            </PlaceName></a>
                        ) : (
                            <PlaceName>{dataObject.data.place_name}</PlaceName>
                        )}

                        <Item>
                            <LabelIcon className="material-symbols-rounded">location_on</LabelIcon>
                            {/*클릭한 카페 주소*/}
                            <Info>{dataObject.data.road_address_name}</Info>
                        </Item>
                        <Item>
                            <LabelIcon className="material-symbols-rounded">phone_enabled</LabelIcon>
                            {/*클릭한 카페 전화번호*/}
                            {dataObject.data.phone ? (<Info>{dataObject.data.phone}</Info>) : (<p>연락처 미등록</p>)}
                        </Item>
                        <Label>옵션</Label>
                        <TagWrapper>
                            {
                                filterArr.map((tag: string, idx: number) => (
                                    <StyledTag key={idx} clickable={false} active={false} style={{borderColor: "#3386FF"}}>{
                                        tag === "decaf" ? "디카페인" : tag === "lactos" ? "락토프리 우유" : tag === "soy" ? "두유" : tag === "oat" ? "오트밀크" : tag === "zero" ? "제로시럽" : ""
                                    }</StyledTag>
                                ))
                            }
                        </TagWrapper>
                        <a href="https://forms.gle/H3M3YwCPgqgHVoRn7"
                           target="_blank"><InfoRequestBtn>정보수정요청</InfoRequestBtn></a>
                    </CafeInfoWrapper>


                )
            }
            {/*<CafeInfoPhotoReview/>*/}
            {/*<CafeInfoReview/>*/}
        </Base>
    )
}

export default CafeInfo;