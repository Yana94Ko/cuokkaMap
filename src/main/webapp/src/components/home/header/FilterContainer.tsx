import React, {useState, useEffect} from 'react';
import styled, {css} from "styled-components";
import axios from "axios";
import {Tag} from "../../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentFilter} from "../../../modules/filterReducer";
import {RootState} from "../../../modules";

const Base = styled.div`
  position: absolute;
  top: 4rem;
  //right: 30rem;
  left: 45vw;
  display: flex;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${props => props.theme.windowSize.laptop} {
    width: 100vw;
    top: 8rem;
    left: 0;
    justify-content: space-between;
    padding: 0 3rem;
  }
  @media ${props => props.theme.windowSize.mobile} {
    top: 7rem;
    padding: 0 2rem;
  }
  //&:last-child{
  //  margin-right: 0;
  //}
  & > button:last-child {
    margin-right: 0;
  }
`;
const FilterTag = styled(Tag)`
  white-space: nowrap;
  margin-bottom: 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  ${props => props.active && css`
    &::before {
      width: 10px;
      height: 10px;
      content: "";
      display: inline-block;
      background-color: ${props.id === "decaf" ?
              props.theme.color.defaf : props.id === "soy" ?
                      props.theme.color.soy : props.id === "zero" ?
                              props.theme.color.zero : props.id === "oat" ?
                                      props.theme.color.oat : props.id === "lactos" ? props.theme.color.lacto : "black"};
      border-radius: 50%;
      margin-right: 10px;
    }
  `}
`;


type filterContentType = {
    name: string,
    id: string
}[]

type FilterContainerProps={
    setDBData:React.Dispatch<React.SetStateAction<any[]>>;
}
const FilterContainer = ({setDBData}:FilterContainerProps) => {
    const dispatch = useDispatch();

    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);
    const isOpenedPostCafe = useSelector((state: RootState) => state.viewReducer.isOpenedPostCafe);

    const filterContent: filterContentType = [
        {
            name: "디카페인",
            id: "decaf"
        },
        {
            name: "락토프리 우유",
            id: "lactos"
        },
        {
            name: "두유",
            id: "soy"
        },
        {
            name: "오트밀크",
            id: "oat"
        },
        {
            name: "제로시럽",
            id: "zero"
        },
    ]
    function fetchDB() {
        console.log(currentFilter)
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter": currentFilter,
                "keywords": "",
            }),
        })
            .then(response => response.text())
            .then((data: any) => {
                // setDB(JSON.parse(data));
                setDBData(JSON.parse(data).map((i: any) => JSON.parse(i.place_info)));
            })
            .catch(err => console.log("에러", err));
    }


    const filterClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(setCurrentFilter(event.currentTarget.id));
        fetchDB();
    }

    return (
        <Base>
            {filterContent.map((filter: { name: string, id: string }, i: number) => (
                <FilterTag clickable={true}
                           active={currentFilter === filter.id}
                           onClick={filterClickHandler}
                           key={i}
                           id={filter.id}
                           disabled={isOpenedPostCafe}
                >
                    {filter.name}
                </FilterTag>
            ))}
        </Base>
    )
}

export default FilterContainer;