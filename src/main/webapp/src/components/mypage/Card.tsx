import React, {ReactNode} from "react";
import styled from "styled-components";

const Base = styled.div<{ height: number }>`
  width: 100%;
  height: ${props => props.height}px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

type Props = {
    children: ReactNode;
    height: number
}
const Card = ({children, height}: Props) => {
    return(
        <Base height={height}>{children}</Base>
    )
}

export default Card;