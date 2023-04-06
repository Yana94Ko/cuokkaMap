import React, {SetStateAction, useState} from 'react';
import styled, {css} from "styled-components";

type PaginationProps = {
    dataLength:number;
    limit:number;
    page:number;
    setPage:React.Dispatch<SetStateAction<number>>
}
const Base = styled.div`
  position:absolute;
  bottom:10vh;
  //TODO : [FE] : 페이지네이션 위치지정좀 부탁드립니다...
  //assigness: hwanyb
  left:38vw;
`;
const PageButton = styled.button`
  font-family: 'Noto Sans KR', sans-serif;
  background-color: ${props => props.theme.color.white};
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
  font-size: ${props => props.theme.fontSize.base};
  ${props => props.disabled && css`
    background-color: ${props => props.theme.color.lightGray};
    color: ${props => props.theme.color.darkGray};
    cursor: default;
  `}
  &.active{
    background-color: ${props => props.theme.color.primary};
    color:${props => props.theme.color.white};
  }
`;


const Pagination = ({dataLength, limit, page, setPage}:PaginationProps) => {
    const total = dataLength;
    //페이지 개수 = 전체 요소 개수 / 한페이지에 보여줄 개수 올림
    const numPages = Math.ceil(total / limit);
    //페이지의 넘버만큼 원소를 가지는 배열
    const showedContent = new Array(numPages).fill(0);

    return(
        <Base>
            <PageButton onClick={() => setPage(page-1)} disabled={page === 1}>
                {/*<span className="material-symbols-rounded">arrow_back_ios</span>*/}
                {/*<span className="material-symbols-rounded">chevron_left</span>*/}
                &lt;
            </PageButton>
            {
                showedContent.map((item, index) => (
                    <PageButton
                        key={index}
                        onClick={() => setPage(index+1)}
                        className={
                            (index+1) === page ? 'active': ''
                        }
                    >
                        {index+1}
                    </PageButton>
                ))
            }
            <PageButton onClick={() => setPage(page+1)} disabled={page === numPages}>
                &gt;
                {/*<span className="material-symbols-rounded">chevron_right</span>*/}
                {/*<span className="material-symbols-rounded">arrow_forward_ios</span>*/}
            </PageButton>
        </Base>
    )
}

export default Pagination;