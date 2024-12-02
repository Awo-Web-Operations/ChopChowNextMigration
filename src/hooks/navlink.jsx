import Link from 'next/link';
import { useRouter } from 'next/router';

function NavLink({ href, children, className }) {
    const isCurrent = useRouter().pathname === href;
    const activeClassName = isCurrent ? 'active' : '';

    return (
        <Link href={href} className={`${activeClassName}`}>
            {children}
        </Link>
    );
}
export default NavLink;