import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email Request, 2: Code & New Password, 3: Success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCodeNotice, setResetCodeNotice] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      if (res.data.resetCode) {
        setResetCodeNotice(res.data.resetCode);
        setCode(res.data.resetCode); // Auto-fill for user convenience
      }
      setSuccessMsg(res.data.message || "Reset code generated!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request. Check your email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        email,
        code,
        newPassword
      });
      setSuccessMsg(res.data.message || "Password reset successfully!");
      setStep(3); // Success step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Verify your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {step === 3 ? "Password Reset!" : "Forgot Password?"}
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 1 && "Enter your email address to receive a 6-digit verification code."}
            {step === 2 && "Enter the 6-digit verification code and set a new password."}
            {step === 3 && "Your password has been successfully updated."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {successMsg && step !== 3 && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl border border-green-100 text-center">
            {successMsg}
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* STEP 2: Enter Code & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {resetCodeNotice && (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-center">
                <span className="text-xs text-purple-600 font-semibold uppercase tracking-wider block">Your Reset Verification Code</span>
                <span className="text-2xl font-mono font-bold text-purple-800 tracking-widest">{resetCodeNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Verification Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center font-mono text-lg font-semibold tracking-widest focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-gray-500 hover:text-pink-600 transition"
            >
              Change Email Address
            </button>
          </form>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <p className="text-gray-600 text-sm">
              Your password has been changed successfully. You can now log in using your new credentials.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-95 transition"
            >
              Proceed to Login
            </button>
          </div>
        )}

        <p className="text-center text-sm pt-2">
          Remembered your password?{" "}
          <Link to="/login" className="text-pink-500 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
