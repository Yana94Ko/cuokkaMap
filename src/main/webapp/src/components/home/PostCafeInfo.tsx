import React, {useState} from 'react';
import Icon from "../common/Icon";
import Input from "../common/Input";
import styled from "styled-components";

const Base = styled.div`
  background-color: #fff;
  width: 500px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
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
const PostCafeInfo = () => {
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
    return (
        <Base>
            <Icon>close</Icon>
            <Title>카페 추가</Title>
            <Form>
                <SearchCafe>
                    <Label>카페찾기</Label>
                    <Input
                        value={searchCafe}
                        name="search"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        placeholder="카페 이름으로 검색해주세요.">
                    </Input>
                    <Icon>search</Icon>
                </SearchCafe>
                <CafeInfoWrapper>
                    <CafeInfoItem>
                        <Label>카페명*</Label>
                        <Input
                            value={cafeInfo.name}
                            name="name"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            disabled={cafeInfo.name === ""}
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>주소*</Label>
                        <Input
                            value={cafeInfo.address}
                            name="address"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                            placeholder="카페 찾기를 완료하시면 자동으로 입력됩니다."
                            disabled={cafeInfo.name === ""}
                        />
                    </CafeInfoItem>
                    <CafeInfoItem>
                        <Label>연락처*</Label>
                        <Input
                            value={cafeInfo.contact}
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