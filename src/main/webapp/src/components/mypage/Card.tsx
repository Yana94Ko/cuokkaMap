import React, {ReactNode} from "react";
import styled from "styled-components";

const Base = styled.div`
  width: 100%;
  height: 200px;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type Props = {
    children: ReactNode;
}
const Card = ({children}: Props) => {
    return(
        <Base>{children}</Base>
    )
}

export default Card;