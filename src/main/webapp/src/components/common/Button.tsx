import React, {ReactNode} from 'react';
import styled from "styled-components";

// TODO(FE): Button 컴포넌트 todo
// props로 color 받아서 boader 추가
// 기능 별로 버튼 구분하여 props로 기능 받아서 조건부 렌더링 하는 방식으로 바꾸어야함
// filter 버튼의 경우 active를 리덕스 스테이트 또는 useState로 저장하여
// active 되었을 경우와 default의 경우 조건부 스타일링
const Base = styled.button`
  outline: none;
`;

type Props = {
    children: ReactNode,
}
const Button = ({children}: Props) => {
    return (<Base>{children}</Base>)
}

export default Button;