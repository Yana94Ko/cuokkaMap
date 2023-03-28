import React, {ReactNode} from "react";

type Props = {
    children: ReactNode
}

const Tag = ({children}: Props) => {
    return (
        <button>{children}</button>
    )
}

export default Tag;