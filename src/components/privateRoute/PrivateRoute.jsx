import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  initializeSession,
  setupAuthListeners,
} from "../../redux/user/userSlice";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(initializeSession());
    const cleanup = dispatch(setupAuthListeners());

    return cleanup;
  }, [dispatch]);

  if (!currentUser) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
  return <Outlet />;
}
