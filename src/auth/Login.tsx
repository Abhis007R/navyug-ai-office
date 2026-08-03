import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Chrome, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");

    if (savedEmail) {
      setRemember(true);
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    if (!password) {
      setError("Password is required.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.user) {
        setError("Unable to login.");
        return;
      }

      if (remember) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      setSuccess("Login successful!");

      const redirect =
        (location.state as any)?.from?.pathname ||
        "/dashboard";

      setTimeout(() => {
        navigate(redirect);
      }, 700);
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo:
              window.location.origin + "/dashboard",
          },
        });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <img
            src="/logo.png"
            alt="Navyug AI Office"
            className="w-20 h-20 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-gray-800">
            Navyug AI Office
          </h1>

          <p className="text-gray-500 mt-2">
            AI Powered NGO Management System
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {success}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 text-sm font-semibold">
              Email Address
            </label>

            <div className="relative">

              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold">
              Password
            </label>

            <div className="relative">

              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>
                    {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>

        {/* Divider */}

        <div className="relative my-8">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              OR
            </span>
          </div>

        </div>

        {/* Google Login */}

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full border border-gray-300 hover:border-blue-500 hover:bg-gray-50 transition-all py-3 rounded-xl flex items-center justify-center gap-3 font-medium disabled:opacity-60"
        >
          {googleLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Connecting...
            </>
          ) : (
            <>
              <Chrome size={20} />
              Continue with Google
            </>
          )}
        </button>

        {/* Register */}

        <div className="text-center mt-8">

          <span className="text-gray-600">
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </Link>

        </div>

        {/* Demo Credentials */}

        <div className="mt-8 rounded-xl bg-gray-100 p-4">

          <h3 className="font-semibold text-gray-800 mb-2">
            Demo Login
          </h3>

          <p className="text-sm text-gray-600">
            Email:
            <span className="font-medium ml-1">
              admin@navyug.ai
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Password:
            <span className="font-medium ml-1">
              ********
            </span>
          </p>

        </div>

        {/* Features */}

        <div className="mt-8">

          <h3 className="font-semibold text-gray-700 mb-3">
            Navyug AI Office
          </h3>

          <ul className="space-y-2 text-sm text-gray-600">

            <li>✅ AI Employees</li>

            <li>✅ Donor CRM</li>

            <li>✅ Volunteer Management</li>

            <li>✅ CSR Fundraising</li>

            <li>✅ Grant Management</li>

            <li>✅ Finance Dashboard</li>

            <li>✅ Project Tracking</li>

            <li>✅ HR & Payroll</li>

            <li>✅ AI Reports</li>

          </ul>

        </div>
                {/* Footer */}

        <div className="mt-10 border-t pt-6 text-center">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Navyug AI Office
          </p>

          <p className="text-xs text-gray-400 mt-2">
            AI Powered NGO Management Platform
          </p>

          <div className="flex justify-center gap-4 mt-4 text-sm">

            <Link
              to="/privacy-policy"
              className="text-gray-500 hover:text-blue-600"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-gray-500 hover:text-blue-600"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="text-gray-500 hover:text-blue-600"
            >
              Contact
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;