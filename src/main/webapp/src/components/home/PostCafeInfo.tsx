import React, {FormEvent, SetStateAction, useEffect, useState} from 'react';
import styled from "styled-components";
import SearchedListContainer from "./SearchedListContainer";
import {Button, Icon, Input, Tag} from "../../styles/common";
import axios from "axios";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 2rem 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const CloseBtn = styled(Icon)`
  position: absolute;
  right: 1rem;
  top: 1rem;
`;
const Title = styled.h1`
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 700;
  text-align: center;
  color: ${props => props.theme.color.primary};
  margin-bottom: 50px;
`;
const Form = styled.form`
  height: 100%;
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
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
`;
const TagWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;


const SearchInput = styled(Input)``;
const SearchInputWrapper = styled.div`
  position: relative;
`;
const AddCafeBtn = styled(Button)`
  width: 100%;
  margin-top: 3rem;
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
    closePostCafeInfo: () => void;
    clickMarkerCafeInfo: markerInfo;
    searchPlaces: () => void;
}

const PostCafeInfo = ({setKeyword, closePostCafeInfo, clickMarkerCafeInfo, searchPlaces}: FnProps) => {
    const [copiedClickedInfo, setCopiedClickedInfo] = useState<markerInfo>({...clickMarkerCafeInfo})
    //***************03.27.2시 30분 추가
    //입력 폼 변화 감지하여 입력 값 관리
    const [searchCafeInfo, setSearchCafeInfo] = useState<string>("");
    const [searchedListCheck, setSearchedListCheck] = useState<boolean>(false);
    const [tag, setTag] = useState<string[]>([]);
    const [needToSearch, setNeedToSearch] = useState<boolean>(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            if (!tag.includes(e.target.id)) {
                setTag([...tag, e.target.id])
            }
        }
    };

    //제출한 검색어 state에 담아주는 함수
    const submitKeyword = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        searchPlaces();
        setNeedToSearch(false);
    }, [needToSearch])
    useEffect(() => {
        if (clickMarkerCafeInfo !== undefined) {
            setSearchedListCheck(false)
            setCopiedClickedInfo({
                ...clickMarkerCafeInfo,
                tag: tag,
            })

        }
        console.log(copiedClickedInfo)

    }, [clickMarkerCafeInfo, tag]);
    const AddCafeInfo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const result = window.confirm("입력하신 정보로 카페정보를 등록하시겠어요?");
        //
        // if (result) {
        //     axios.post('/place/placeInsert', copiedClickedInfo).then((res) => {
        //         console.log(res);
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        //     // 카페추가 api 로직 작성
        //     // TODO(FE): 카페추가 api 로직 작성
        //     // 카페정보등록 api 완성되면 로직 작성하기만 하면 됨
        //     // assignees: hwanyb
        //     alert("카페등록")
        // }

        // axios.post('/place/placeInsert', copiedClickedInfo).then((res) => {
        //     console.log(res);
        // }).catch((error) => {
        //     console.log(error)
        // })
        axios({
            method: "post",
            url: "/place/placeInsert",
            responseType: "json",
            data: copiedClickedInfo
        }).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <Base>
            <CloseBtn className="material-symbols-rounded" onClick={closePostCafeInfo}>close</CloseBtn>
            <Title>카페 추가</Title>
            <Form onSubmit={AddCafeInfo}>
                <SearchCafe>
                    <Label>카페찾기</Label>
                    <SearchInputWrapper>
                        <SearchInput
                            value={searchCafeInfo}
                            name="search"
                            onChange={onChange}
                            autoComplete="off"
                            placeholder="카페 이름으로 검색해주세요."
                        >
                        </SearchInput>
                        <SearchIcon className="material-symbols-rounded" onClick={submitKeyword}>search</SearchIcon>
                        {searchedListCheck && <SearchedListContainer setSearchedListCheck={setSearchedListCheck}/>}
                    </SearchInputWrapper>
                </SearchCafe>
                <CafeInfoWrapper>
                    <CafeInfoItem>
                        <Label>카페명*</Label>
                        <Input
                            value={copiedClickedInfo.place_name}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            // disabled={true}
                            onChange={onChange}
                            name="name"
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>주소*</Label>
                        <Input
                            value={copiedClickedInfo.address_name}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            // disabled={true}
                            onChange={onChange}
                            name="address"
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>옵션*</Label>
                        <TagWrapper onClick={onTagClick}>
                            <Tag clickable={true} id="decaf">디카페인</Tag>
                            <Tag clickable={true} id="lactos">락토프리 우유</Tag>
                            <Tag clickable={true} id="soy">두유</Tag>
                            <Tag clickable={true} id="oat">오트밀크</Tag>
                            <Tag clickable={true} id="zero">제로슈가</Tag>
                        </TagWrapper>
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>연락처</Label>
                        <Input
                            value={copiedClickedInfo.phone}
                            name="contact"
                            onChange={onChange}
                            placeholder="카페 연락처를 입력해 주세요."
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>인스타그램</Label>
                        <Input
                            // type=url 설정함으로 인해서 값 입력시 url 형태인지 자동으로 유효성검사
                            // 값 입력되어있지 않을 시 유효성검사 안함
                            type="url"
                            value={copiedClickedInfo.insta}
                            name="insta"
                            onChange={onChange}
                            placeholder="카페 인스타그램 URL을 입력해 주세요."
                        />
                    </CafeInfoItem>
                </CafeInfoWrapper>
                {/*cafeInfo의 name, address, tag 값이 하나라도 "" 일때 버튼 비활성화*/}
                <AddCafeBtn type="submit"
                            disabled={copiedClickedInfo.place_name === ""
                                || copiedClickedInfo.address_name === ""
                                || copiedClickedInfo.tag?.length < 1}
                >카페 등록</AddCafeBtn>
            </Form>
        </Base>
    )
}

export default PostCafeInfo;