import { Outlet, Link } from "react-router-dom";
import './assets/scss/app.scss'

const Layout = () => {
  return (
    <>
      <nav>
        <Link className="navbar" to="/">Home</Link>
        <Link className="navbar" to="/Projects">Projects</Link>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;