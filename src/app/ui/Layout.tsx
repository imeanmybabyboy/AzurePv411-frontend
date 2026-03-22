import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                <Link to="/">Home</Link>
                <Link to="/no-address">No address</Link>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>footer</footer>
        </>
    );
}
