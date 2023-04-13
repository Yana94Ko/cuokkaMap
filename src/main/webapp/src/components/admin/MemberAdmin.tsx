import React from 'react';

const MemberAdmin = () => {
    const data:any[] = [];
    return(
        <div>
            <div>
                <p>회원관리</p>
                <input type="text"/>
            </div>
            <p>전체 사용자 : {}명</p>
            <ul>
                <li><input type="checkbox"/></li>
                <li>회원 유형</li>
                <li>ID</li>
                <li>가입일</li>
                <li>이메일</li>
            </ul>
            <ul>
                {
                    data.map((data, i) => (
                        <>
                            <li key={i}><input type="checkbox"/></li>
                            <li key={i}>data</li>
                            <li key={i}>data</li>
                            <li key={i}>data</li>
                            <li key={i}>data</li>
                        </>
                    ))
                }
            </ul>
        </div>
    )
}

export default MemberAdmin;