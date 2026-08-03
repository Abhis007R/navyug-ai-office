import { FcGoogle } from "react-icons/fc";
import { supabase } from "../lib/supabase";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      console.error("Google Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium shadow-sm transition hover:bg-gray-50"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
}