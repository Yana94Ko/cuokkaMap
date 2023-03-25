import React, {RefObject, useRef} from 'react';
import {Link} from "react-router-dom";
import styled from "styled-components";
const Header = () => {
    const searchPlaceInputRef = useRef<HTMLInputElement>(null);
    // //검색하면 axios로 백에 요청 보낼거시기
    const searchPlaceChangeHandler = (event: React.ChangeEvent<HTMLInputElement>):void => {
        console.log(event.target.value)
    }

    const Base = styled.div`
      width:calc(100vw - 100px);
    {/*스크롤 없애야댐*/}
      position:fixed;
      z-index:100;
    `;

    const HeaderBox = styled.div`
      width:100%;
      margin:10px 50px;
      display:flex;
      justify-content: space-between;
      form{
        background:white;
        border-radius:10px;
        input{
          width:20vw;
          height:3em;
          margin:10px;
          border:none;
          outline:none;
        }
      }
    `;

    return (
        <Base>
            <HeaderBox>
            <form>
                <input type="text"  ref={searchPlaceInputRef} onChange={searchPlaceChangeHandler}/>&emsp;
                <button>검색아이콘들어갈자리</button>
            </form>
            <Link to="/login">로그인</Link>
            </HeaderBox>
        </Base>
    )
}

export default Header;