import React from 'react';
import styled from "styled-components";

const Base = styled.div`
  position:absolute;
  top:11vh;
  background-color:rgba(0,0,0,0.4);
  color:white;
  width:400px;
`;

const SearchedListContainer:React.FC = () => {

    return(<Base id="placesList">

    </Base>)
}

export default SearchedListContainer;

