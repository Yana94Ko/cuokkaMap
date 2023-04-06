import React, {useState, useRef, useEffect, SetStateAction} from 'react';
import styled, {css} from "styled-components"

import {Icon, Tag} from "../../styles/common";
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
  left: 3rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 1.5rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${props => props.theme.windowSize.laptop} {
    height: 70vh;
    top: 50%;
    transform: translateY(-48%);
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

const CloseBtn = styled(Icon)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: rotate(90deg);
  }
`;
const CafeInfoWrapper = styled.div``;
const TitleWrapper = styled.div`
  display: flex;
  position: sticky;
  position: -webkit-sticky;
  z-index: 11;
  top: 0;
  left: 0;
  background-color: #fff;
  padding: 2rem;
`;

const PlaceName = styled.a`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: 900;
  color: #000;
  transition: all 0.3s ease-in-out;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.color.primary};
  }
`;

const Item = styled.div`
  display: flex;
  line-height: 2rem;
  margin-bottom: 1.5rem;
  padding: 0 2rem 0 2rem;
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
  padding-left: 2rem;
`;

const InfoRequestBtn = styled.a`
  width: fit-content;
  margin: 0 auto;
  margin-top: 1rem;
  font-size: ${props => props.theme.fontSize.sm};
  background-color: ${props => props.theme.color.gray};
  padding: 0.5rem 1rem;
  display: block;
  color: ${props => props.theme.color.text};
  border-radius: 1rem;

  &:visited {
    color: ${props => props.theme.color.text};
  }
`;

const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 2rem 0 2rem;

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
  position: sticky;
  position: -webkit-sticky;
  z-index: 11;
  top: 70px;
  background-color: #fff;
  padding: 2rem 0 0 0;
  justify-content: space-between;
`;

const Tab = styled.div<{ currentView: string }>`
  width: 50%;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.theme.color.gray};
  transition: all 0.2s ease-in-out;
  font-weight: 300;
  color: ${props => props.theme.color.darkGray};
  cursor: pointer;
  ${props => props.currentView === props.id && css`
    border-bottom: 2px solid ${props => props.theme.color.primary};
    color: ${props => props.theme.color.text};
    font-weight: 700;
  `}
`;

const CafeReviewContent = styled.div`
  padding: 2rem;
`;

type CafeInfoProps = {
    cafeInfoContainer: object;
    setCafeInfoContainer: React.Dispatch<SetStateAction<object>>
}

const CafeInfo = ({cafeInfoContainer, setCafeInfoContainer}: CafeInfoProps) => {
    const [currentView, setCurrentView] = useState<string>("photo");

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
            {
                cafeInfoContainer !== undefined && (
                    <>
                        {
                            dataObject.data.insta ? (
                                <TitleWrapper>
                                    <CloseBtn className="material-symbols-rounded" onClick={closeCafeInfo}>close</CloseBtn>
                                    <PlaceName href={dataObject.data.place_url} target="_blank">
                                        {dataObject.data.place_name}
                                    </PlaceName>
                                    <a href={dataObject.data.insta} target="_blank">
                                        <img className="insta"
                                             src={process.env.PUBLIC_URL + "/assets/images/markers/insta.png"}
                                             width="30px" alt="insta"/>
                                    </a>
                                </TitleWrapper>

                            ) : (
                                <TitleWrapper>
                                    <CloseBtn className="material-symbols-rounded" onClick={closeCafeInfo}>close</CloseBtn>
                                    <PlaceName href={dataObject.data.place_url} target="_blank">
                                        {dataObject.data.place_name}
                                    </PlaceName>
                                </TitleWrapper>
                            )
                        }

                        <CafeInfoWrapper>
                            <Item>
                                <LabelIcon className="material-symbols-rounded">location_on</LabelIcon>
                                <Info>{dataObject.data.road_address_name}</Info>
                            </Item>
                            <Item>
                                <LabelIcon className="material-symbols-rounded">phone_enabled</LabelIcon>
                                {dataObject.data.phone ? (<Info>{dataObject.data.phone}</Info>) : (<p>연락처 미등록</p>)}
                            </Item>
                            <Label>옵션</Label>
                            <TagWrapper>
                                {
                                    filterArr.map((tag: string, idx: number) => (
                                        <StyledTag key={idx} clickable={false} active={false}
                                                   style={{borderColor: "#3386FF"}}>{
                                            tag === "decaf" ? "디카페인" : tag === "lactos" ? "락토프리 우유" : tag === "soy" ? "두유" : tag === "oat" ? "오트밀크" : tag === "zero" ? "제로시럽" : ""
                                        }</StyledTag>
                                    ))
                                }
                            </TagWrapper>
                            <InfoRequestBtn href="https://forms.gle/H3M3YwCPgqgHVoRn7"
                                            target="_blank">정보수정요청</InfoRequestBtn>

                        </CafeInfoWrapper>
                    </>
                )}

            <ReviewTab onClick={onReviewTabClick}>
                <Tab id="photo" currentView={currentView}>사진</Tab>
                <Tab id="review" currentView={currentView}>후기</Tab>
            </ReviewTab>
            <CafeReviewContent>
                {currentView === "photo" ? <CafeInfoPhotoReview cafeInfoContainer={cafeInfoContainer}/> :
                    <CafeInfoReview cafeInfoContainer={cafeInfoContainer} setCafeInfoContainer={setCafeInfoContainer}/>}
            </CafeReviewContent>
        </Base>
    )
}

export default CafeInfo;