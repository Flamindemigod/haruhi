import NextLink from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/loading";

const Link = ({ href, aClasses, onClick = () => { }, children }) => {
    const dispatch = useDispatch();
    const { asPath } = useRouter();
    return (
        <NextLink href={href}>
            <a className={aClasses} onClick={(e) => {
                onClick(e);
                if (asPath === href) return null;
                if (
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.metaKey || // apple
                    (e.button && e.button == 1) // middle click, >IE9 + everyone else
                ) return null;
                dispatch(setLoading(true));
            }}>
                {children}
            </a>
        </NextLink>
    )
}

export default Link