import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    overflow: hidden;
  }

  html {
    color: #000;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 15px;
    @media ${(props) => props.theme.windowSize.tablet} {
      font-size: 14px;
    }
    @media ${(props) => props.theme.windowSize.mobile} {
      font-size: 12px;
    }
  }

  img {
    transform: translateZ(0);
  }

  .infoWindowWrapper {
    position: relative;
  }

  .infoWindow {
    position: absolute;
    border-radius: 1rem;
    background-color: #fff;
    text-align: center;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-10%, -35%);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-size: ${props => props.theme.fontSize.base};
  }
`;


export default GlobalStyle;