import { useAuth } from "../../providers/AuthProvider";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Error from "../error";

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
      <Footer />
    </>
  );
};

export default UserLayout;
