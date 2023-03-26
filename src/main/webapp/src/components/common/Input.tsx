import React, {ChangeEvent} from 'react';
import styled from "styled-components";

const Base = styled.input``;

type Props = {
    value: string;
    name: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({...Props}) => {
    return (
        <Base type="text" value={Props.value} name={Props.name} onChange={Props.onChange}></Base>
    )
}

export default Input;