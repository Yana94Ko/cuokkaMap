import React from 'react';
import styled from "styled-components";

const Base = styled.input``;


type Props = {
    value: string
}
const Input = ({value}: Props) => {
    return (
        <Base type="text" value={value}></Base>
    )
}

export default Input;