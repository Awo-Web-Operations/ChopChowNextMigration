import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { userSignOut } from "../actions";

const useInactivityLogout = (timeout = 120000) => {
  const dispatch = useDispatch();

  const handleActivity = useCallback(() => {
    clearTimeout(window.inactivityTimeout);
    window.inactivityTimeout = setTimeout(() => {
      dispatch(userSignOut());
    }, timeout);
  }, [dispatch, timeout]);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(window.inactivityTimeout);
      handleActivity();
    };

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    document.addEventListener("click", resetTimer);

    handleActivity(); // initialize the timeout

    return () => {
      clearTimeout(window.inactivityTimeout);
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keypress", resetTimer);
      document.removeEventListener("click", resetTimer);
    };
  }, [handleActivity]);

  return null;
};

export default useInactivityLogout;
