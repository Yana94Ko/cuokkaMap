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
  left: 60vw;
  transform: translateX(-50%);

`;
const FilterTag = styled(Tag)`
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

const FilterContainer = () => {
    const dispatch = useDispatch();

    const currentFilter = useSelector((state: RootState) => state.filterReducer.currentFilter);

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
    const [filterInfo, setFilterInfo] = useState<string[]>();
    useEffect(() => {
        // [YANA]
        fetch("/api/place/getAllPlaceInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "place_filter" : [],
                "keywords" : "서울 석관",
            }),
        })
            .then(response => response.text())
            .then(function (message) {
                console.log(message);
            });
        // axios.get('/api/place/getAllPlaceInfo')
        //     .then(res => {setFilterInfo(res)})
        //     .catch(err => console.log(err))
    },[])


    const filterClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // console.log(event.currentTarget.value, event.currentTarget.id);
        //event.currentTarget.value를 서버로 보내서 해당 필터에 해당되는 정보만 받아오도록
        // try {
        //     axios.post('서버로 보내는 api url', {
        //         data: {
        //             //서버에 보낼 필터 키워드
        //             filter: event.currentTarget.value
        //         }
        //     }).then((res: any) => {
        //         setFilteredCafeInfo(res);
        //         console.log(res);
        //     }).catch((err) => console.log(err));
        // } catch (error) {
        //     console.log(error);
        // }

        dispatch(setCurrentFilter(event.currentTarget.id))
    }

    return (
        <Base>
            {
                filterContent.map((filter: { name: string, id: string }, i: number) => (
                    <FilterTag clickable={true} active={currentFilter === filter.id} onClick={filterClickHandler}
                               key={i}
                               id={filter.id}>{filter.name}</FilterTag>))
            }
        </Base>
    )
}

export default FilterContainer;