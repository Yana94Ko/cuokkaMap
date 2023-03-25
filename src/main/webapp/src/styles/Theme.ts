import { DefaultTheme } from "styled-components";

const windowSize = {
  mobile: `screen and (max-width: 480px)`,
  tablet: `screen and (max-width: 768px)`,
  desktop: `screen and (max-width: 1600px)`,
};

const fontSize = {
  xs: "0.5rem",
  sm: "0.75rem",
  base: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem"
};


export const theme: DefaultTheme = {
  windowSize,
  fontSize,

};