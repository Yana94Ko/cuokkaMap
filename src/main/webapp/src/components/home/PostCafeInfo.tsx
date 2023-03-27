import React, {useEffect, useState} from 'react';
import Icon from "../common/Icon";
import Input from "../common/Input";
import styled from "styled-components";
import SearchedListContainer from "./SearchedListContainer";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: 100vh;
  position: absolute;
  top: 0;
  left:0;
  z-index:1000;
`;
const Title = styled.h1``;
const Form = styled.form``;
const SearchCafe = styled.div``;
const CafeInfoWrapper = styled.div``;
const CafeInfoItem = styled.div``;

const Label = styled.label`
  display: block;
`;
const TagWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;
const Tag = styled.li``;

type cafeInfo = {
    name: string,
    address: string,
    contact: string,
    tag: string,
    insta?: string,
}

interface FnProps{
    setKeyword: (keyword:string) => void;
    closePostCafeInfo: () => void;
    clickMarkerCafeInfo:string[];
}
const PostCafeInfo = ({setKeyword, closePostCafeInfo, clickMarkerCafeInfo}:FnProps) => {
    const [searchCafe, setSearchCafe] = useState<string>("");
    const [cafeInfo, setCafeInfo] = useState<cafeInfo>({
        name: "",
        address: "",
        contact: "",
        tag: "",
        insta: ""
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value},} = e;
        if (e.target.name === "search") {
            setSearchCafe(value);
        }
    }

    //***************03.27.2시 30분 추가
    //입력 폼 변화 감지하여 입력 값 관리
    const [value, setValue] = useState<string>("");

    //입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
    const keywordChange = (e:{preventDefault: () => void; target: {value:string}}) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    //제출한 검색어 state에 담아주는 함수
    const submitKeyword = (e : {preventDefault:() => void}) => {
        e.preventDefault();

        if(value === ""){
            alert("검색어를 입력해주세요");
        }

        setKeyword(value);
    }

    return (
        <Base>
            <button onClick={closePostCafeInfo}><Icon>close</Icon></button>
            <Title>카페 추가</Title>
            <Form>
                <SearchCafe>
                    <Label>카페찾기</Label>
                    <Input
                        value={value}
                        name="search"
                        onChange={keywordChange}
                        placeholder="카페 이름으로 검색해주세요.">
                    </Input>
                    <button onClick={submitKeyword}><Icon >search</Icon></button>
                    {value && <SearchedListContainer/>}
                </SearchCafe>
                <CafeInfoWrapper>
                    <CafeInfoItem>
                        <Label>카페명*</Label>
                        <Input
                            value={clickMarkerCafeInfo[0]}
                            name="name"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            disabled={cafeInfo.name === ""}
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>주소*</Label>
                        <Input
                            value={clickMarkerCafeInfo[1]}
                            name="address"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            disabled={cafeInfo.name === ""}
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>연락처*</Label>
                        <Input
                            value={clickMarkerCafeInfo[2]}
                            name="contact"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            disabled={cafeInfo.name === ""}
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>옵션*</Label>
                        <TagWrapper>
                            <Tag>디카페인</Tag>
                            <Tag>락토프리 우유</Tag>
                            <Tag>두유</Tag>
                            <Tag>오트밀크</Tag>
                            <Tag>제로시럽</Tag>
                        </TagWrapper>
                    </CafeInfoItem>
                </CafeInfoWrapper>
                <CafeInfoItem>
                    <Label>인스타그램</Label>
                    <Input
                        value={cafeInfo.insta}
                        name="insta"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        placeholder="카페 인스타그램 URL을 입력해 주세요."
                        disabled={cafeInfo.name === ""}
                    />
                </CafeInfoItem>
            </Form>
        </Base>
    )
}

export default PostCafeInfo;