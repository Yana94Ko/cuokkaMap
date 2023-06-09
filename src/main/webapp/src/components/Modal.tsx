import React, {ReactNode} from 'react';
import styled from "styled-components";

// TODO(FE): Modal 컴포넌트 todo
// close btn 추가해야함
// 영역 밖 클릭시 e.target !== e.currentTarget 으로 모달 꺼지게 해야함
// assignsees: hwanyb

const Base = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  z-index: 999999;
  left: 0;
  top: 0;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  @media ${props => props.theme.windowSize.mobile} {
    /* mobile viewport bug fix */
    /* iOS only */
    @supports (-webkit-touch-callout: none) {
      height: -webkit-fill-available;
      min-height: -webkit-fill-available;
    }
  }
`;

type Props = {
    children: ReactNode,
}
const Modal = ({children}: Props) => {
    return (
        <Base>{children}</Base>
    )
}

export default Modal;