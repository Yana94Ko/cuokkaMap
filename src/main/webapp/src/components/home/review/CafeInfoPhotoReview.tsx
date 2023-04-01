import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Button} from "../../../styles/common";

const Base = styled.div`
  background-color: #fff;
  width: 400px;
  height: 45vh;
  position: absolute;
  z-index: 1000;
  top: 327px;
  left: 0;
  padding: 2rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2rem;
`;

const CafeInfoPhotoReview = () => {
    //사진파일 받아와서 사진 후기에 뿌려줄 배열
    const [photoData, setPhotoData] = useState<string[]>([]);

    // //사진 업로드할 때 보낼 요청
    // const submit = () => {
    //     useEffect(() => {
    //         fetch("불러오는 url", {
    //             method:"POST",
    //
    //         })
    //     },[])
    // }


    return(
        <Base>
            <Button>
                <label htmlFor="file" style={{cursor:"pointer"}}>
                    <div className="btn-upload">파일 업로드하기</div>
                </label>
                <input type="file" name="file" id="file" style={{display:"none"}}/>
            </Button>
            <div style={{height:"100%", }}>
                {/*{photoData && photoData.map(*/}
                {/*이미지 사이즈 동일하게 맞추고 그 안에서 fit하게 */}
                {/*    (data, i) => (*/}
                {/*        <img src={data} alt="reviewImage"/>*/}
                {/*<span className="material-symbols-outlined">close</span>*/}
                {/*    )*/}
                {/*)}*/}
            </div>
        </Base>
    )
}

export default CafeInfoPhotoReview;