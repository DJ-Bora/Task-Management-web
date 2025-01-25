import React, { useState } from "react";
import "./signup.css";
import HeadingComp from "./HeadingComp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

const Signin = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");  
  const [loading, setLoading] = useState(false);  

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true); 

    try {
      const response = await axios.post(
        `https://task-management-web-three.vercel.app/api/v1/signin`,
        inputs
      );

      // Check if user data exists in the response
      if (response.data && response.data.user) {
        sessionStorage.setItem("id", response.data.user._id);
        dispatch(authActions.login());
        history("/task");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Sign-In Error:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <div className="signup">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 column col-left d-none d-lg-flex justify-content-center align-items-center">
              <HeadingComp first="Sign" second="In" />
            </div>
            <div className="col-lg-8 column d-flex justify-content-center align-items-center">
              <div className="d-flex flex-column w-100 p-3">
                <input
                  className="p-2 my-3 input-signup"
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={inputs.email}
                  onChange={change}
                  disabled={loading} 
                />

                <input
                  className="p-2 my-3 input-signup"
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={inputs.password}
                  onChange={change}
                  disabled={loading}  
                />

                {error && <div className="error-message">{error}</div>}

                <button
                  className="btn-signup p-2"
                  onClick={submit}
                  disabled={loading}  
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
