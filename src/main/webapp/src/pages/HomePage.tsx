import React, {useState} from 'react';
import Header from "../components/home/header/Header";
import KakaoMap from "../components/home/KakaoMap";

export interface propsType {
    searchKeyword: string
}
function HomePage(){
    // //입력 폼 변화 감지하여 입력 값 관리
    // const [value, setValue] = useState<string>("");
    // //제출한 검색어 관리
    // const [keyword, setKeyword] = useState<string>("");
    //
    // //입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
    // const keywordChange = (e:{preventDefault: () => void; target: {value:string}}) => {
    //     e.preventDefault();
    //     setValue(e.target.value);
    // }
    //
    // //제출한 검색어 state에 담아주는 함수
    // const submitKeyword = (e : {preventDefault:() => void}) => {
    //     e.preventDefault();
    //     setKeyword(value);
    // }
    // //검색어를 입력하지 않고 검색 버튼을 눌렀을 경우
    // const valueChecker = () => {
    //     if(value === ""){
    //         alert("검색어를 입력해주세요");
    //     }
    // }

    return(
        <div>
            {/*<div className="landing-page">*/}
            {/*    <div className="landing-page__inner">*/}
            {/*        <div className="search-form-container">*/}
            {/*            <form className="search-form" onSubmit={ submitKeyword }>*/}
            {/*                <label htmlFor="place" className="form__label">*/}
            {/*                    <input type="text" id="movie-title" className="form__input" name="place" onChange={ keywordChange } placeholder="검색어를 입력해주세요. (ex: 강남 맛집)" required />*/}
            {/*                    <div className="btn-box">*/}
            {/*                        <input className="btn form__submit" type="submit" value="검색" onClick={ valueChecker }/>*/}
            {/*                    </div>*/}
            {/*                </label>*/}
            {/*            </form>*/}
            {/*        </div>*/}
                    {/* 제출한 검색어 넘기기 */}
                <Header/>
                <KakaoMap/>
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

export default HomePage;