import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, InputField } from "@components";
import { verifyOTP } from "@api/auth";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showSpamHint, setShowSpamHint] = useState(true);

  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;

  const handleVerify = async () => {
    try {
      const res = await verifyOTP({ email, otp });

      if (res?.verified) {
        navigate("/");
      } else {
        setError("Invalid code. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong! Try again.");
    }
  };

  const handleResend = async () => {
    setError("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpamHint(false);
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-[385px] bg-white border border-gray-300 rounded-lg p-8">
        <div className="flex justify-center mb-4">
          <span className="text-4xl">📩</span>
        </div>

        <h2 className="text-lg font-semibold text-center">
          Enter confirmation code
        </h2>

        <p className="text-gray-500 text-sm text-center mt-2">
          We sent a code to <b>{email}</b>
          <button
            onClick={handleResend}
            className="text-blue-600 ml-1 font-semibold hover:underline"
          >
            Resend Code
          </button>
        </p>

        <InputField
          name="otp"
          placeholder="Confirmation code"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/[^0-9]/g, ""));
            setError("");
          }}
          className="mt-5"
        />

        <Button
          disabled={otp.length !== 6}
          onClick={handleVerify}
          className="mt-4"
        >
          Next
        </Button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 font-semibold text-sm hover:underline w-full text-center"
        >
          Go back
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>

      <div className="w-full max-w-[385px] bg-white border border-gray-300 p-4 rounded-lg text-center mt-3">
        <p className="text-sm">
          Have an account?
          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      {showSpamHint && (
        <div className="fixed top-6 right-4 z-50 bg-white border border-gray-300 shadow-lg rounded-lg px-4 py-3 w-[260px]">
          <p className="text-sm text-gray-700">Didn’t receive the code?</p>
          <p className="text-xs text-gray-500 mt-1">
            Please check your spam or junk folder.
          </p>

          <button
            onClick={() => setShowSpamHint(false)}
            className="absolute top-1 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyOTPPage;
