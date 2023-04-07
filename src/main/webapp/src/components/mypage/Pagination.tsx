import React, {SetStateAction, useState} from 'react';
import styled, {css} from "styled-components";
import {Button} from "../../styles/common";

type PaginationProps = {
    dataLength: number;
    limit: number;
    page: number;
    setPage: React.Dispatch<SetStateAction<number>>
}
const Base = styled.div`
  position: fixed;
  width: 100%;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 30px 30px 30px;
  gap: 1rem;
  background-color: #fff;
  padding: 2rem 0 1rem 0;
  justify-content: center;
  z-index: 5555;
`;
const PageButton = styled(Button)`
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
  font-size: ${props => props.theme.fontSize.base};

  ${props => props.disabled && css`
    background-color: ${props => props.theme.color.lightGray};
    color: ${props => props.theme.color.darkGray};
    cursor: default;
  `}
  &.active {
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.white};
  }
`;


const Pagination = ({dataLength, limit, page, setPage}: PaginationProps) => {
    const total = dataLength;
    //페이지 개수 = 전체 요소 개수 / 한페이지에 보여줄 개수 올림
    const numPages = Math.ceil(total / limit);
    //페이지의 넘버만큼 원소를 가지는 배열
    const showedContent = new Array(numPages).fill(0);

    return (
        <Base>
            <PageButton onClick={() => {
                setPage(page - 1)
                //setNeedToSet(!needToSet);
            }} disabled={page === 1}>
                {/*<span className="material-symbols-rounded">arrow_back_ios</span>*/}
                {/*<span className="material-symbols-rounded">chevron_left</span>*/}
                &lt;
            </PageButton>
            {
                showedContent.map((item, index) => (
                    <PageButton
                        key={index}
                        onClick={() => {
                            setPage(index + 1);
                            //setNeedToSet(!needToSet);
                        }}
                        className={
                            (index + 1) === page ? 'active' : ''
                        }
                    >
                        {index + 1}
                    </PageButton>
                ))
            }
            <PageButton onClick={() => {
                setPage(page + 1);
                //setNeedToSet(!needToSet);
            }} disabled={page === numPages}>
                &gt;
                {/*<span className="material-symbols-rounded">chevron_right</span>*/}
                {/*<span className="material-symbols-rounded">arrow_forward_ios</span>*/}
            </PageButton>
        </Base>
    )
}

export default Pagination;