import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import UserLayout from "./components/layouts/user-layout";
import Layout from "./components/layouts/layout";
import Home from "./pages/home";
import Transport from "./pages/transport";
import Clothes from "./pages/clothes";
import Accessories from "./pages/accessories";
import Jobs from "./pages/jobs";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import UpdateProfile from "./pages/update-profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/jobs" element={<Jobs />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
