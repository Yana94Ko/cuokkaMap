import React from 'react';
import {Link} from "react-router-dom";
const Header = () => {
    // const searcBox = styled.div`
    //   position:absolute;
    //   top:10;
    //   left:10;
    //   z-index:100;
    // `;

    return (
        <header style={{width:"80vw", position:"absolute", top:"10", left:"10", zIndex:"100"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
            <form>
                <input type="search" name="search" spellCheck="false"/>
                <input type="submit" value="검색"/>
            </form>
            <Link to="/login">로그인</Link>
            </div>
            <div>
                <button>락토프리</button>
                <button>디카페인</button>
                <button>두유</button>
                <button>맛있는거</button>
            </div>
        </header>
    )
}

export default Header;