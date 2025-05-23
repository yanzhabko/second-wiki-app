import type { FC } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
// import UpdateUserForm from "./UpdateUserForm";

const UpdateSection: FC = () => {
  return (
    <section className=" lg:flex-1 flex flex-col items-center gap-[50px]">
      {/* <UpdateUserForm /> */}
      <ChangePasswordForm />
    </section>
  );
};

export default UpdateSection;
