// client/pages/auth/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthCallback component mounted");
    console.log("Current URL:", window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    
    console.log("Token:", token ? "Present" : "Missing");
    console.log("UserId:", userId);
    
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");
      // Optionally fetch user info here
      navigate("/dashboard"); // Redirect to dashboard instead of home
    } else {
      console.log("No token found, redirecting to login");
      navigate("/login?error=oauth");
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default AuthCallback;
