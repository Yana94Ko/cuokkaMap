import React, {useState, useEffect} from 'react';
import styled from "styled-components"

type CafeInfoProps = {
    cafeInfoContainer : object;
    setCafeInfoCheck : React.Dispatch<React.SetStateAction<boolean>>;
}

const CafeInfo = ({cafeInfoContainer, setCafeInfoCheck}:CafeInfoProps) => {
    const [data, setData] = useState<any[]>([]);
    const Base = styled.div`
      width:20vw;
      height:100vh;
      position:absolute;
      top:0vh;
      left:0;
      z-index: 1500;
      background-color:rgba(0,0,0,0.2)
    `;
    var a;
    useEffect(() => {
        setData(Object.values(cafeInfoContainer));
    },[cafeInfoContainer])
    return(
        <Base>
            <input type="button" onClick={() => setCafeInfoCheck(false)} value="X"/>
            {data &&(
                <div>
                <h1>{data[1]}</h1>
                    <br/>
                <h1>{data[4]}</h1>
                    <br/>
                <h1>{data[5]
                    // .map((a:string) => (<span style={{marginRight:"10px"}}>{a}</span>))
                }</h1>
                </div>
            )}
        </Base>
    )
}

export default CafeInfo;