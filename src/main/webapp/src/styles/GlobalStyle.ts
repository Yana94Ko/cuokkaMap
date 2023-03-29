import {createGlobalStyle} from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: 'Noto Sans KR Light', sans-serif;
    src: url(${process.env.PUBLIC_URL} + "/assets/font/NotoSansKR-Light.otf");
    font-style: normal;
  }

  @font-face {
    font-family: 'Noto Sans KR Regular', sans-serif;
    src: url(${process.env.PUBLIC_URL} + "/assets/font/NotoSansKR-Regular.otf");
    font-style: normal;
  }

  @font-face {
    font-family: 'Noto Sans KR Bold', sans-serif;
    src: url(${process.env.PUBLIC_URL} + "/assets/font/NotoSansKR-Bold.otf");
    font-style: normal;
  }

  @font-face {
    font-family: 'Noto Sans KR Balck', sans-serif;
    src: url(${process.env.PUBLIC_URL} + "/assets/font/NotoSansKR-Black.otf");
    font-style: normal;
  }

  @font-face {
    font-family: 'Gill Sans Ultra Bold', sans-serif;
    src: url(${process.env.PUBLIC_URL} + "/assets/font/GILSANUB.TTF");
    font-style: normal;
  }

  * {
    box-sizing: border-box;
  }

  body {
    overflow: hidden;
  }

  html {
    font-family: 'Noto Sans KR Reqular', sans-serif;
    font-size: 16px;
    @media ${props => props.theme.windowSize.desktop} {
      font-size: 15px;
    }
    @media ${(props) => props.theme.windowSize.tablet} {
      font-size: 14px;
    }
    @media ${(props) => props.theme.windowSize.mobile} {
      font-size: 13px;
    }
  }
`;

export default GlobalStyle;