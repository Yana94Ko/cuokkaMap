import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        color: {
            primary: string,
            lightGray: string,
            gray: string,
            darkGray: string,
            text: string,
            defaf: string,
            lacto: string,
            oat: string,
            zero: string,
            soy: string
            white: string,
        };
        windowSize: {
            mobile: string;
            tablet: string;
            laptop: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            md: string;
            lg: string;
            xl: string;
        };
    }
}