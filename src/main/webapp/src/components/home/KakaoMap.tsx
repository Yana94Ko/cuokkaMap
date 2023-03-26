import React, {
    useState,
    useEffect,
    useRef
} from "react";
import {propsType} from '../../pages/HomePage';
import './map.css';

interface placeType {
    place_name: string,
    road_address_name: string,
    address_name: string,
    phone: string,
    place_url: string
}

declare global {
    interface Window {
        kakao: any;
    }
}


const KakaoMap = () => {
    //입력 폼 변화 감지하여 입력 값 관리
    const [value, setValue] = useState<string>("");
    //제출한 검색어 관리
    const [keyword, setKeyword] = useState<string>("");

    //입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
    const keywordChange = (e:{preventDefault: () => void; target: {value:string}}) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    //제출한 검색어 state에 담아주는 함수
    const submitKeyword = (e : {preventDefault:() => void}) => {
        e.preventDefault();
        setKeyword(value);
    }
    //검색어를 입력하지 않고 검색 버튼을 눌렀을 경우
    const valueChecker = () => {
        if(value === ""){
            alert("검색어를 입력해주세요");
        }
    }
    const keywordRef = useRef<HTMLInputElement>(null);
    // 마커를 담을 배열입니다
    var markers: any[] = [];

    useEffect(() => {

            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(37.56667, 126.97806),
                level: 3,
            };
            var map = new window.kakao.maps.Map(container as HTMLElement, options);

            //장소 검색 객체 생성
            var placeSearch = new window.kakao.maps.services.Places();

            //검색 결과 목록이나 마커를 클릭했을 때 장소명을 표시할 인포 윈도우 생성
            var infowindow = new window.kakao.maps.InfoWindow({zIndex:1});

            //키워드로 장소 검색
            searchPlaces();

            //키워드 검색을 요청하는 함수
            function searchPlaces(){

                if(!keyword.replace(/^\s+|\s+$/g, '')){
                    alert("키워드를 입력해주세요!");
                    return false;
                }

                //장소 검색 객체를 통해 키워드로 장소검색을 요청합니다.
                placeSearch.keywordSearch(keyword, placesSearchCB)
            }

            //장소검색이 완료됬을 때 호출하는 콜백함수
            function placesSearchCB(data: any, status: any, pagination:any){
                if(status === window.kakao.maps.services.Status.OK){

                    //정상적으로 검색이 완료됬으면 검색 목록과 마커 표출
                    displayPlaces(data);

                    //페이지 번호를 표출
                    displayPagination(pagination);
                }else if(status === window.kakao.maps.services.Status.ZERO_RESULT){
                    alert("검색 결과가 존재하지 않습니다");
                    return;
                }else if(status === window.kakao.maps.services.Status.ERROR){
                    alert("검색 결과 중 오류가 발생했습니다.");
                    return;
                }
            }

            //검색 결과 목록과 마커를 표출하는 함수
        function displayPlaces(places: any){
            const listEl = document.getElementById('places-list'),
                resultEl = document.getElementById('search-result'),
                fragment = document.createDocumentFragment(),
                //좌표계에서 사각영역 정보를 표현하는 객체를 생성한다.
                // var bounds = new kakao.maps.LatLngBounds(sw, ne); // 인자를 주지 않으면 빈 영역을 생성한다.
                // var sw = new kakao.maps.LatLng(36, 127),
                // ne = new kakao.maps.LatLng(37, 128);
                //sw : 사각영역에서 남서쪽 좌표
                //ne : 사각 영역에서 북동쪽 좌표
            bounds = new window.kakao.maps.LatLngBounds();

            //검색 결과 목록에 추가된 항목들을 제거
            listEl && removeAllChildNods(listEl);

            //지도에 표시되고 있는 마크 제거
            removeMarker();

            for(let i=0;i<places.length;i++){
                //마커를 생성하고 지도에 표시
                var placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i, undefined),
                    itemEl = getListItem(i, places[i]); //검색 결과 항목 Element를 생성

                //검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                //LatLngBounds 객채에 좌표를 추가합니다
                //extend(latlng) 인수로 주어진 좌표를 포함하도록 영역 정보를 확장한다
                //for문으로 돌아가면서 생긴 마커들마다 영역을 계속 확장한다고 생각하면 됨
                bounds.extend(placePosition);

                //마커와 검색결과 항목에 mouseover 했을 때 해당 장소에 인포윈도우에 장소명 표시 마우스 떼면 닫음
                (function(marker: any, title: string){
                    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                        displayInfowindow(marker, title);
                    });
                    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                        infowindow.close();
                    });
                })(marker, places[i].place_name);

                fragment.appendChild(itemEl);
            }

            //검색 결과 항목들을 검색결과 목록 Element에 추가
            listEl && listEl.appendChild(fragment);
            if(resultEl){
                resultEl.scrollTop = 0;
            }

            //검색된 장소 위치를 기준으로 지도 범위를 재설정
            //setBounds() : 주어진 영역이 화면 안에 전부 나타날 수 있도록 지도의 중심 좌표와 확대 수준 결정
            map.setBounds(bounds);
        }

        // 검색결과 항목을 Element로 반환하는 함수
        function getListItem(index: number, places: placeType) {

            const el = document.createElement('li');
            let itemStr = `
          <div class="info">
            <span class="marker marker_${index+1}">
              ${index+1}
            </span>
            <a href="${places.place_url}">
              <h5 class="info-item place-name">${places.place_name}</h5>
              ${
                places.road_address_name
                    ? `<span class="info-item road-address-name">
                    ${places.road_address_name}
                   </span>
                   <span class="info-item address-name">
                 	 ${places.address_name}
               	   </span>`
                    : `<span class="info-item address-name">
             	     ${places.address_name}
                  </span>`
            }
              <span class="info-item tel">
                ${places.phone}
              </span>
            </a>
          </div>
          `

            el.innerHTML = itemStr;
            el.className = 'item';

            return el;
        }
        // //검색결과 항목을 Element로 반환하는 함수
        // function getListItem(index: number, places: any){
        //     const el = document.createElement("li");
        //
        //     let itemStr = `<span className="markerbg marker_${index+1}"></span>
        //                     <div className="info"><h5>${places.place_name}</h5>
        //                     ${places.road_address_name
        //                         ? `<span>${places.road_address_name}</span>
        //                         <span className="jibun gray">${places.address_name}</span>`
        //                         : `<span>${places.address_name}</span>`
        //                     }
        //                     <span>${places.phone}</span></div>`;
        //     el.innerHTML = itemStr;
        //     el.className="item";
        //
        //     return el;
        // }

        //마커를 생성하고 지도 위에 마커를 표시하는 함수
        function addMarker(position:() => {}, idx: number, title: undefined){
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지 사용
                imageSize = new window.kakao.maps.Size(34, 37), //마커크기
                imgOptions = {
                    spriteSize: new window.kakao.maps.Size(36, 691), //스프라이트 크기
                    spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10), //스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset : new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new window.kakao.maps.Marker({
                    position:position,
                    image:markerImage
                });

            marker.setMap(map);
            markers.push(marker);

            return marker;
        }

        //지도 위에 표시되고 있는 마커 모두 제거
        function removeMarker(){
            for(let i=0;i<markers.length;i++){
                markers[i].setMap(null);
            }
            markers=[];
        }

        //검색 결과 목록 하단에 페이지 번호를 표시하는 함수
        function displayPagination(pagination: any){
            const paginationEl = document.getElementById('pagination') as HTMLElement;
            let fragment = document.createDocumentFragment(),
            i;

            //기존에 추가된 페이지 번호 삭제
            while (paginationEl.hasChildNodes()) {
                paginationEl.lastChild &&
                paginationEl.removeChild(paginationEl.lastChild);
            }

            for(i=1;i<=pagination.last;i++){
                var el = document.createElement('a');
                el.href="#";
                el.innerHTML = i.toString();

                if(i === pagination.current){
                    el.className="on";
                }else{
                    el.onclick = (function(i){
                        return function(){
                            pagination.gotoPage(i);
                        }
                    })(i);
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }

        //검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
        //인포윈도우에 장소명 표시
        function displayInfowindow(marker:any, title:string){
            var content = `<div style={{padding:"5px",zIndex:"1"}}>${title}</div>`

            infowindow.setContent(content);
            infowindow.open(map, marker);
        }

        //검색겨로가 목록의 자식 Element를 제거하는 함수
        function removeAllChildNods(el:HTMLElement){
                while(el.hasChildNodes()){
                    el.lastChild && el.removeChild(el.lastChild);
                }
        }


    }, [keyword]);

    return <>
        <div id="map" style={{  width:"100vw", height:"100vh" }} />
            <div id="menu_wrap" className="bg_white" >
                <div className="option">
                    <div>
                        <form
                            onSubmit={ submitKeyword }
                        >
                            키워드 : <input type="text" value={value} onChange={keywordChange}/>
                            <button
                                type="submit" onClick={valueChecker}>검색하기</button>
                        </form>
                    </div>
                </div>
                <hr/>
                <ul id="placesList" ></ul>
                <div id="pagination" ></div>
            </div>
    </>;
}

export default KakaoMap;