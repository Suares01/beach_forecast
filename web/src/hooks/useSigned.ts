import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/auth";

const useSigned = (): void => {
  const { signed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (signed) navigate("/dashboard");
  }, [signed]);
};

export { useSigned };
