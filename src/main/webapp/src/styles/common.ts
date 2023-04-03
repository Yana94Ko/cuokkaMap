import styled, {css} from "styled-components";

export const Icon = styled.span`
  font-variation-settings: 'FILL' 1,
  'wght' 700,
  'GRAD' 0,
  'opsz' 48;
  font-size: ${props => props.theme.fontSize.lg};
  cursor: pointer;
  
  @media ${props => props.theme.windowSize.mobile} {
    font-variation-settings: 'FILL' 1,
    'wght' 600,
    'GRAD' 0,
    'opsz' 48;
  }
`;
export const Button = styled.button`
  font-family: 'Noto Sans KR', sans-serif;
  background-color: ${props => props.theme.color.primary};
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.color.white};
  font-size: ${props => props.theme.fontSize.base};
  ${props => props.disabled && css`
    background-color: ${props => props.theme.color.lightGray};
    color: ${props => props.theme.color.darkGray};
    cursor: default;
  `}
`;

export const Tag = styled.button<{ clickable: boolean; active: boolean }>`
  font-family: 'Noto Sans KR', sans-serif;
  color: #000;
  border: 1px solid ${props => props.theme.color.darkGray};
  background-color: ${props => props.theme.color.white};
  font-size: ${props => props.theme.fontSize.base};
  border-radius: 1rem;
  padding: 0.2rem 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  ${props => props.clickable && css`
    cursor: pointer;

    &:hover {
      border: 1px solid ${props.id === "decaf" ?
              props.theme.color.defaf : props.id === "soy" ?
                      props.theme.color.soy : props.id === "zero" ?
                              props.theme.color.zero : props.id === "oat" ?
                                      props.theme.color.oat : props.id === "lactos" ? props.theme.color.lacto : "black"};
    }
    
  `}
  
  ${props => props.active && css`
    border: 1px solid ${props.id === "decaf" ?
        props.theme.color.defaf : props.id === "soy" ?
            props.theme.color.soy : props.id === "zero" ?
                props.theme.color.zero : props.id === "oat" ?
                    props.theme.color.oat : props.id === "lactos" ? props.theme.color.lacto : "black"};
  `}

  ${props => props.disabled && css`
    cursor: default;
    background-color: ${props.theme.color.lightGray};
    color: ${props.theme.color.darkGray};
    &:hover{
      border: 1px solid ${props.theme.color.darkGray};
      
    }
  `}
  
`;
export const Input = styled.input`
  width: 100%;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 300;
  border-radius: 1rem;
  font-size: ${props => props.theme.fontSize.base};
  padding: 0.5rem 3rem;
  ${props => props.disabled ? css`
    background-color: ${props => props.theme.color.lightGray};
    border: 1px solid ${props => props.theme.color.gray};

    &::placeholder {
      color: ${props => props.theme.color.darkGray};
    }
  ` : css`
    border: 1px solid ${props => props.theme.color.gray};
    color: ${props => props.theme.color.text};

    &::placeholder {
      color: ${props => props.theme.color.text};
    }

    &:focus {
      border: 1px solid ${props => props.theme.color.primary};
      outline: none;
    }
  `}
`;
