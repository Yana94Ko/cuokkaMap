import React from 'react';
import styled from "styled-components";
interface listProps {
    setSearchedListCheck:(searchedListCheck:boolean) => void;
}
const Base = styled.div`
  position:absolute;
  top:11vh;
  background-color:rgba(0,0,0,0.4);
  color:white;
  width:400px;
  z-index:1000;
`;



const SearchedListContainer = ({setSearchedListCheck}:listProps) => {
    const removeValue = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchedListCheck(false);
    }

    return(<Base id={"search-result"}><input type="button" value="x" onClick={removeValue}/><ul id="placesList"></ul></Base>)
}

export default SearchedListContainer;

