import React from 'react';

const CafeAdmin = () => {
    const data:any[] = [];
    return(
        <div>
            <div>
                <p>카페관리</p>
                <input type="text"/>
            </div>
            <p>전체 카페 : {}개</p>
            <ul>
                <li><input type="checkbox"/></li>
                <li>카페이름</li>
                <li>주소</li>
                <li>필터</li>
                <li>등록일</li>
            </ul>
            <ul>
                {
                  data.map((data, i) => (
                      <li key={i}>data</li>
                  ))
                }
            </ul>
        </div>
    )
}

export default CafeAdmin;