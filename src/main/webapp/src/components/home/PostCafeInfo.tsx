import React, {FormEvent, SetStateAction, useEffect, useRef, useState} from 'react';
import styled, {css} from "styled-components";
import {useDispatch, useSelector} from "react-redux";

import SearchedListContainer from "./SearchedListContainer";
import {Button, Icon, Input, Tag} from "../../styles/common";
import {setIsOpenedPostCafe} from "../../modules/viewReducer";
import {RootState} from "../../modules";

const Base = styled.div<{ isOpenedPostCafe: boolean }>`
  background-color: #fff;
  width: 450px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 1rem 2rem 3rem 2rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.5s 1s ease-in-out;
  border-radius: 0 1.5rem 1.5rem 0;

  @media ${props => props.theme.windowSize.tablet} {
    overflow-y: auto;
    width: 100%;
    height: 400px;
    padding: 1rem 2rem 5rem 2rem;
    justify-content: start;
    border-radius: 1.5rem 1.5rem 0 0;
    top: calc(100% - 400px);
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  }
  /* mobile viewport bug fix */
  /* iOS only */
  @supports (-webkit-touch-callout: none) {
    padding: 1rem 2rem 8rem 2rem;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media ${props => props.theme.windowSize.tablet} {
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Header = styled.div`
  background-color: #fff;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1111;
  padding: 2rem;
`;

export const CloseBtn = styled(Icon)`
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: rotate(90deg);
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 700;
  text-align: center;
  color: ${props => props.theme.color.primary};
`;

const Form = styled.form`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SearchCafe = styled.div`
  margin-bottom: 60px;
`;

const CafeInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const CafeInfoItem = styled.div`
  @media ${props => props.theme.windowSize.tablet} {
    height: fit-content;
    justify-content: start;
    margin-bottom: 3rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const TagWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const AddCafeBtn = styled(Button)`
  width: 100%;
  margin-top: 3rem;
  position: relative;
`;

const SearchIcon = styled(Icon)`
  position: absolute;
  right: 1rem;
  top: 0.5rem;
`;

type markerInfo = {
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    distance: string,
    id: string,
    phone?: string,
    place_name: string,
    place_url?: string,
    road_address_name?: string,
    x: number,
    y: number,
    insta?: string,
    tag?: string[],
}

interface FnProps {
    setKeyword: React.Dispatch<SetStateAction<string>>;
    clickMarkerCafeInfo: markerInfo;
    searchPlaces: () => void;
    removeMarker: () => void;
    moveToPosition: (x: number, y: number) => void;
    displayDBPlaces: (data: any[], filter?: any[]) => void;
    dbData: any[];
    dbFilterData: any[];
    removeMarkerAPI: () => void;
    searchCafeInfo: string;
    setSearchCafeInfo: React.Dispatch<SetStateAction<string>>;
    setDBData: React.Dispatch<SetStateAction<any[]>>;
    setIsPostedCafe: React.Dispatch<SetStateAction<boolean>>;
}

const PostCafeInfo = ({
                          setKeyword,
                          clickMarkerCafeInfo,
                          searchPlaces,
                          removeMarker,
                          moveToPosition,
                          displayDBPlaces, dbData, dbFilterData,
                          removeMarkerAPI,
                          searchCafeInfo,
                          setSearchCafeInfo,
                          setDBData,
                          setIsPostedCafe,
                      }: FnProps) => {
    const dispatch = useDispatch();

    const PostCafeInput = useRef<HTMLInputElement>(null);

    const isOpenedPostCafe = useSelector((state: RootState) => state.viewReducer.isOpenedPostCafe);

    const [copiedClickedInfo, setCopiedClickedInfo] = useState<any>({...clickMarkerCafeInfo})
    const [searchedListCheck, setSearchedListCheck] = useState<boolean>(false);
    const [tag, setTag] = useState<string[]>([]);
    const [needToSearch, setNeedToSearch] = useState<boolean>(false);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {target: {name, value},} = e;
        if (name === "search") {
            setSearchCafeInfo(value);
        } else {
            setCopiedClickedInfo({
                ...copiedClickedInfo,
                [name]: value
            })
        }
    }

    const onTagClick = (e: React.MouseEvent<HTMLUListElement>) => {
        e.preventDefault()
        if (e.target instanceof Element) {
            // tag 안에 클릭한 값이 없을때만 setTag
            if (e.target.id !== "") {
                if (!tag.includes(e.target.id)) {
                    setTag([...tag, e.target.id])
                } else {
                    // tag 안에 클릭한 태그 값이 있을 때 해당 값 빼기
                    const copiedTag = [...tag];
                    const index = copiedTag.indexOf(e.target.id);
                    copiedTag.splice(index, 1);
                    setTag([...copiedTag]);
                }
            }
        }
    };

    //카페찾기 input에 enter 이벤트
    function activeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            if (searchCafeInfo === "") {
                alert("검색어를 입력해주세요");
            } else {
                setSearchedListCheck(true);
                setKeyword(searchCafeInfo);
                setNeedToSearch(true);
                PostCafeInput.current.blur();
            }
        }
    }

    //카페찾기 돋보기 클릭 시 검색어 state에 담아주는 함수
    const submitKeyword = (e: React.MouseEvent<HTMLButtonElement>) => {
        //setNeedToRemove(!setNeedToRemove)
        e.preventDefault();
        if (searchCafeInfo === "") {
            alert("검색어를 입력해주세요");
        } else {
            setSearchedListCheck(true);
            setKeyword(searchCafeInfo);
            setNeedToSearch(true);
        }
    }
    useEffect(() => {
        if (needToSearch) {
            removeMarkerAPI(); //살아았어야함
            searchPlaces();
            setNeedToSearch(false);
        }
    }, [needToSearch])

    //클릭한 마커가 db에 있는 정보인지아닌지 판별하는 useEffect
    useEffect(() => {
        if (Object.keys(clickMarkerCafeInfo).length > 0) {
            setSearchedListCheck(false)
            fetch("/api/place/isThereSamePlaceDB", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "x": clickMarkerCafeInfo.x,
                    "y": clickMarkerCafeInfo.y,
                }),
            })
                .then(response => response.text())
                .then(function (message) {
                    if (message === "0") {
                        setCopiedClickedInfo({
                            ...clickMarkerCafeInfo,
                        })
                    } else {
                        setCopiedClickedInfo({})
                        alert("이미 DB에 저장된 카페입니다")
                    }
                });
        }
    }, [clickMarkerCafeInfo]);

    const AddCafeInfo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = window.confirm("입력하신 정보로 카페정보를 등록하시겠습니까?");
        const dataToSave = {
            user_num: sessionStorage.getItem("id"),
            place_filter: tag,
            place_info: copiedClickedInfo,
        }
        if (result) {
            fetch("/api/place/placeInsert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSave),
            })
                .then(response => response.text())
                .then((data) => {
                    const loadData = JSON.parse(data);
                    const placeInfo = JSON.parse(loadData.place_info);
                    alert("카페등록이 완료되었습니다.");
                    removeMarker();
                    //settingKeywordPostCafeName(placeInfo.place_name);
                    dispatch(setIsOpenedPostCafe(false));
                    settingKeywordPostCafeName(placeInfo);

                    // var markerPosition = new window.kakao.maps.LatLng(placeInfo.y, placeInfo.x);
                    // var marker = new window.kakao.maps.Markers({
                    //     image:filterMarkerImg,
                    //     position:markerPosition,
                    //     title:placeInfo.place_name
                    // });
                    // marker.setMap(mapState);
                    settingKeywordPostCafeName(loadData);
                    setIsPostedCafe(true);
                    return placeInfo;
                })
                .then((placeInfo) => {
                    moveToPosition(placeInfo.y, placeInfo.x);
                });
        }
    }
    const settingKeywordPostCafeName = (placeInfo: any) => {
        setDBData(() => [...dbData, placeInfo])
    }
    const closePostCafe = () => {
        dispatch(setIsOpenedPostCafe(false));
        removeMarker();
        removeMarkerAPI();
        setKeyword("");
        displayDBPlaces(dbData, dbFilterData);
    }
    const onInputClick = () => {
        if (Object.keys(copiedClickedInfo).length === 0) {
            alert("카페찾기를 먼저 완료해 주세요.");
        }
    }


    return (
        <Base isOpenedPostCafe={isOpenedPostCafe}>
            <Container>
                <Header>
                    <Title>카페 추가</Title>
                    <CloseBtn className="material-symbols-rounded" onClick={closePostCafe}>close</CloseBtn>
                </Header>
                <Form onSubmit={AddCafeInfo}>
                    <SearchCafe>
                        <Label>카페찾기</Label>
                        <SearchInputWrapper>
                            <Input
                                ref={PostCafeInput}
                                value={searchCafeInfo || ""}
                                name="search"
                                onChange={onChange}
                                autoComplete="off"
                                placeholder="카페 이름으로 검색해주세요."
                                onKeyPress={activeEnter}
                            >
                            </Input>
                            <SearchIcon className="material-symbols-rounded" onClick={submitKeyword}>search</SearchIcon>
                            {searchedListCheck && <SearchedListContainer setSearchedListCheck={setSearchedListCheck}/>}
                        </SearchInputWrapper>
                    </SearchCafe>
                    <CafeInfoWrapper>
                        <CafeInfoItem onClick={onInputClick}>
                            <Label>카페명*</Label>
                            <Input
                                value={copiedClickedInfo.place_name || ""}
                                placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                                disabled={true}
                                onChange={onChange}
                                name="name"
                            />
                        </CafeInfoItem>
                        <CafeInfoItem onClick={onInputClick}>
                            <Label>주소*</Label>
                            <Input
                                value={copiedClickedInfo.address_name || ""}
                                placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                                disabled={true}
                                onChange={onChange}
                                name="address"
                            />
                        </CafeInfoItem>
                        <CafeInfoItem>
                            <Label>옵션*</Label>
                            <TagWrapper onClick={onTagClick}>
                                <Tag
                                    clickable={true}
                                    active={tag.includes("decaf")}
                                    id="decaf"
                                    disabled={Object.keys(copiedClickedInfo).length === 0}
                                >디카페인</Tag>
                                <Tag clickable={true}
                                     active={tag.includes("lactos")}
                                     id="lactos"
                                     disabled={Object.keys(copiedClickedInfo).length === 0}
                                >락토프리 우유</Tag>
                                <Tag clickable={true}
                                     active={tag.includes("soy")}
                                     id="soy"
                                     disabled={Object.keys(copiedClickedInfo).length === 0}
                                >두유</Tag>
                                <Tag clickable={true}
                                     active={tag.includes("oat")}
                                     id="oat"
                                     disabled={Object.keys(copiedClickedInfo).length === 0}
                                >오트밀크</Tag>
                                <Tag clickable={true}
                                     active={tag.includes("zero")}
                                     id="zero"
                                     disabled={Object.keys(copiedClickedInfo).length === 0}
                                >제로슈가</Tag>
                            </TagWrapper>
                        </CafeInfoItem>
                        <CafeInfoItem onClick={onInputClick}>
                            <Label>연락처</Label>
                            <Input
                                ref={PostCafeInput}
                                defaultValue={copiedClickedInfo.phone || ""}
                                name="contact"
                                onChange={onChange}
                                placeholder="카페 연락처를 입력해 주세요."
                                disabled={Object.keys(copiedClickedInfo).length === 0}
                                onClick={onInputClick}
                            />
                        </CafeInfoItem>
                        <CafeInfoItem onClick={onInputClick}>
                            <Label>인스타그램</Label>
                            <Input
                                ref={PostCafeInput}
                                // type=url 설정함으로 인해서 값 입력시 url 형태인지 자동으로 유효성검사
                                // 값 입력되어있지 않을 시 유효성검사 안함
                                type="url"
                                value={copiedClickedInfo.insta || ""}
                                name="insta"
                                onChange={onChange}
                                placeholder="카페 인스타그램 URL을 입력해 주세요."
                                disabled={Object.keys(copiedClickedInfo).length === 0}
                                onClick={onInputClick}
                            />
                        </CafeInfoItem>
                        {/*cafeInfo의 name, address, tag 값이 하나라도 "" 일때 버튼 비활성화*/}
                        <AddCafeBtn type="submit"
                                    disabled={copiedClickedInfo.place_name === ""
                                        || copiedClickedInfo.address_name === ""
                                        || tag?.length < 1}
                        >카페 등록
                        </AddCafeBtn>
                    </CafeInfoWrapper>
                </Form>
            </Container>
        </Base>
    )
}

export default PostCafeInfo;