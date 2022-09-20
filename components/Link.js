import NextLink from "next/link";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/loading";

const Link = ({ href, aClasses, onClick = () => { }, children }) => {
    const dispatch = useDispatch();
    return (
        <NextLink href={href}>
            <a className={aClasses} onClick={() => {
                onClick();
                dispatch(setLoading(true))
            }}>
                {children}
            </a>
        </NextLink>
    )
}

export default Link