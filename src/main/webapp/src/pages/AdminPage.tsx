import React,{useState} from 'react';
import CafeAdmin from "../components/admin/CafeAdmin";
import MemberAdmin from "../components/admin/MemberAdmin";
import Header from "../components/admin/Header";
import styled, {css} from "styled-components";

const Base = styled.main`
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  padding: 3rem 8rem 8rem 8rem;
  display: grid;
  grid-template-rows: 0.5fr 1fr 6fr;

  @media ${props => props.theme.windowSize.laptop} {
    padding: 2rem 5rem 8rem 5rem;

  }
  @media ${props => props.theme.windowSize.tablet} {
    padding: 2rem 4rem 8rem 4rem;

  }
  @media ${props => props.theme.windowSize.mobile} {
    grid-template-rows: 0.5fr 0.5fr 10fr;
    padding: 2rem 2rem 10rem 2rem;

  }
  /* mobile viewport bug fix */
  /* iOS only */
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
    min-height: -webkit-fill-available;
    padding: 2rem;
  }
`;

const TabWrapper = styled.div`
  margin-top: 5rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 2px;
    bottom: 0;
    background-color: ${props => props.theme.color.gray};
    z-index: 10;
  }

  @media ${props => props.theme.windowSize.mobile} {
    margin-top: 2rem;
  }
`;

const Tab = styled.div<{ active: boolean }>`
  text-align: center;
  padding: 1.5rem 0;
  z-index: 11;
  font-size: ${props => props.theme.fontSize.md};
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  ${props => props.active ? css`
    border-bottom: 2px solid ${props => props.theme.color.primary};
  }
  ` : css`
    border-bottom: 2px solid transparent;
  `};

  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.theme.color.lightGray}80;
    }
  }
`;

const AdminPageContent = styled.div`
  position: relative;
  width: 100%;
  margin-top: 2rem;
  overflow-y: scroll;
  padding: 1rem 2rem 2rem 1rem;

  @media ${props => props.theme.windowSize.tablet} {
    margin-top: 1rem;
  }
`;

const AdminPage = () => {
    //탭이동 state
    const [adminTab, setAdminTab] = useState<string>("member");

    const changeTabHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
        if(!(e.target instanceof Element)){
            return;
        }
        setAdminTab(e.target.id);
    }

    return(
        <Base>
            <Header/>
            <TabWrapper>
                <button id="member" onClick={changeTabHandler}>회원관리</button>
                <button id="cafe"  onClick={changeTabHandler}>카페관리</button>
            </TabWrapper>
            <AdminPageContent>
                {adminTab === "member" ? <MemberAdmin/>:<CafeAdmin/>}
            </AdminPageContent>
        </Base>
    )
}

export default AdminPage;