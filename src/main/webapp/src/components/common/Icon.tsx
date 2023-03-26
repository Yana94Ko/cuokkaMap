import React from 'react';
import styled from "styled-components";

const IconSpan = styled.span`
  font-variation-settings:
          'FILL' 0,
          'wght' 500,
          'GRAD' 0,
          'opsz' 48;
  
`;

type Props = {
    children: string
}
const Icon = ({children}: Props) => {
    return (
        <IconSpan className="material-symbols-rounded">{children}</IconSpan>
    )
}

export default Icon;