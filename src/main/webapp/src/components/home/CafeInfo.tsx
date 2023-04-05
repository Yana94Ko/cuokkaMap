import React, {useState, useRef, useEffect} from 'react';
import styled, {css} from "styled-components"

import {CloseBtn} from "./PostCafeInfo";
import {Button, Icon, Tag} from "../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenedCafeInfo} from "../../modules/viewReducer";
import CafeInfoPhotoReview from "./review/CafeInfoPhotoReview";
import CafeInfoReview from "./review/CafeInfoReview";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: 80vh;
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
  overflow-y:scroll;
  &::-webkit-scrollbar{
    display:none;
  }

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
    padding: 2rem 1rem 8rem 2rem;
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
const TitleWrapper = styled.div`
    display:flex;
`;


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
  width: fit-content;
  margin: 0 auto;
  margin-top: 1rem;
  font-size: ${props => props.theme.fontSize.sm};
  background-color: ${props => props.theme.color.gray};
  padding: 0.2rem 1rem;
  display: block;
  color: ${props => props.theme.color.text};

  a {
    outline: none;
    text-decoration: none;
    color: white;
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

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTag = styled(Tag)`
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }
`;

const ReviewTab = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tab = styled.div<{ currentView: string }>`
  width: 50%;
  text-align: center;
  margin-top: 2rem;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.theme.color.gray};
  transition: all 0.2s ease-in-out;
  font-weight: 300;
  color: ${props => props.theme.color.darkGray};
  cursor: pointer;
  margin-bottom: 2rem;
  ${props => props.currentView === props.id && css`
    border-bottom: 2px solid ${props => props.theme.color.primary};
    color: ${props => props.theme.color.text};
    font-weight: 700;
  `}
`;

type CafeInfoProps = {
    cafeInfoContainer: object;
}

const CafeInfo = ({cafeInfoContainer}: CafeInfoProps) => {
    const [currentView, setCurrentView] = useState<string>("review");

    let dataObject: any = {};
    dataObject = Object.assign({}, cafeInfoContainer);
    const filterArr = dataObject.filter;

    const dispatch = useDispatch();

    const closeCafeInfo = () => {
        dispatch(setIsOpenedCafeInfo(false));
    };

    const onReviewTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element) {
            if (e.target.id !== '') {
                setCurrentView(e.target.id);
            }
        }
    }
    return (
        <Base>
            <CloseBtn className="material-symbols-rounded" onClick={closeCafeInfo}>close</CloseBtn>
            {
                cafeInfoContainer !== undefined && (

                    <CafeInfoWrapper>
                        <TitleWrapper>
                        {dataObject.data.place_url ? (
                            <a href={dataObject.data.place_url} target="_blank"><PlaceName>
                                {dataObject.data.place_name}&emsp;

                            </PlaceName></a>
                        ) : (
                            <PlaceName>{dataObject.data.place_name}</PlaceName>
                        )}
                        {dataObject.data.insta ? (
                            <a href={dataObject.data.insta} target="_blank"><img className="insta"
                                                                                 src={process.env.PUBLIC_URL + "/assets/images/markers/insta.png"}
                                                                                 width="30px" alt="insta"/></a>
                        ) : (
                            <PlaceName>{dataObject.data.insta}</PlaceName>
                        )}
                        </TitleWrapper>
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
            <ReviewTab onClick={onReviewTabClick}>
                <Tab id="photo" currentView={currentView}>사진</Tab>
                <Tab id="review" currentView={currentView}>후기</Tab>
            </ReviewTab>
            {
                currentView === "photo" ? <CafeInfoPhotoReview cafeInfoContainer={cafeInfoContainer}/> : <CafeInfoReview/>
            }
        </Base>
    )
}

export default CafeInfo;