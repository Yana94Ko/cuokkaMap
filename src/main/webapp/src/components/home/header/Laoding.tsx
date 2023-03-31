import styled from "styled-components";

const Logo = styled.img`
  height: 50px;
`;

const Loading = () => {
    return (
        <div className="background">
            <Logo src={process.env.PUBLIC_URL + "/assets/images/logo/logo.png"} alt="로고이미지"/>
        </div>
    );
};
export default Loading;