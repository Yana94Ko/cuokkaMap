import React, {useState, useEffect} from 'react';
import styled from "styled-components";
import axios from "axios";

const FilterContainer = () => {
    //얘는 HomePage에 띄워서...map으로 내린다음에 그 정보들을 띄워줘야 할거같은디...맞나...
    const [filteredPlaceData, setFilteredPlaceData] = useState<any[] | null>();

    //필터될 5가지 정보
    const filterContent:string[] = ["디카페인", "락토프리 우유", "두유", "오트밀크","제로시럽"]
    //유동적으로 필터를 추가하게 될거면...원래는 DB에서 받아와야 되냐며
    // const [filterInfo, setFilterInfo] = useState<string[]>();
    // useEffect(() => {
    //     axios.get('필터가져오는 url')
    //         .then(res => {setFilterInfo(res)})
    //         .catch(err => console.log(err))
    // },[])


    const Base = styled.div``;

    const filterClickHandler = (event : React.MouseEvent<HTMLButtonElement>):void => {
        event.preventDefault();
        console.log(event.currentTarget.value);
        //event.currentTarget.value를 서버로 보내서 해당 필터에 해당되는 정보만 받아오도록
        try{
            axios.post('서버로 보내는 api url',{data:{
                //서버에 보낼 필터 키워드
                filter : event.currentTarget.value
            }}).then((res: any) => {
                setFilteredPlaceData(res);
                console.log(res);
            }).catch((err) => console.log(err));
        }catch(error){
            console.log(error);
        }
    }

    return(
        <Base>
            {
                filterContent.map((filter:string, i:number) => (<button onClick={filterClickHandler} value={filter} key={i}>{filter}</button>))
            }
        </Base>
    )
}

export default FilterContainer;