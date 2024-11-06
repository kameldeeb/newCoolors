import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="">
      <Suspense>
        {  <Outlet />}
      </Suspense>
    </div>
  );
};

export default Root;
