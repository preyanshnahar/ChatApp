import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullname,
    username,
    password,
    confirmpassword,
    gender,
  }) => {
    const success = handleInputErrors({
      fullname,
      username,
      password,
      confirmpassword,
      gender,
    });

    if (!success) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          username,
          password,
          confirmpassword,
          gender,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data);
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignUp;

function handleInputErrors({
  fullname,
  username,
  password,
  confirmpassword,
  gender,
}) {
  if (!fullname || !username || !password || !confirmpassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmpassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
