import Header from "../ui/Header";
// import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
