import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
  const { login } = useAuth();

  return (
      <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                {
                  token: credentialResponse.credential,
                }
              );

              login(res.data.token); 
              navigate("/home");
            } catch (err) {
              console.error("Google login failed", err);
            }
          }}
          onError={() => {
            console.log("Google Login Failed");
          }}
        />
  )
}

export default GoogleLoginButton

