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
`;

export default GlobalStyle;