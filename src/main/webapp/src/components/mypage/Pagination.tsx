import React, {SetStateAction, useState} from 'react';
import styled, {css} from "styled-components";
import {Button, Icon} from "../../styles/common";

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
  align-items: center;
`;

const PageButton = styled(Button)`
  color: ${props => props.theme.color.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background-color: transparent;

  ${props => props.disabled && css`
    & span {
      color: ${props => props.theme.color.darkGray};
      cursor: default;
    }
  `}
`;

const CurrentPageNum = styled.p`
  font-weight: 500;
  text-align: center;
`;

type PaginationProps = {
    dataLength: number;
    limit: number;
    page: number;
    setPage: React.Dispatch<SetStateAction<number>>
}

const Pagination = ({dataLength, limit, page, setPage}: PaginationProps) => {
    const total = dataLength;
    //페이지 개수 = 전체 요소 개수 / 한페이지에 보여줄 개수 올림
    const numPages = Math.ceil(total / limit);

    const onPageClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        if (e.target instanceof Element) {
            if (e.target.id === "prev") {
                setPage(page - 1)
            } else if (e.target.id === "next") {
                setPage(page + 1)
            }
        }
    }
    return (
        <Base>
            <PageButton
                onClick={onPageClick}
                disabled={page === 1}>
                <Icon
                    id={"prev"}
                    className="material-symbols-rounded">chevron_left</Icon>
            </PageButton>
            <CurrentPageNum>{page}</CurrentPageNum>
            <PageButton
                onClick={onPageClick}
                disabled={page === numPages}>
                <Icon
                    id={"next"}
                    className="material-symbols-rounded">chevron_right</Icon>
            </PageButton>
        </Base>
    )
}

export default Pagination;