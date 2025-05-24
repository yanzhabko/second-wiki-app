import { useAuth } from "../../providers/AuthProvider";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
// import Footer from "../Footer";
import Error from "../ui/error";

const UserLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Error />;
  }

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

export default UserLayout;
