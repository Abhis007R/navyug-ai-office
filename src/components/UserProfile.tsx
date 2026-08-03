import { useAuth } from "../auth/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3">

      <img
        src={
          user?.user_metadata?.avatar_url ||
          "https://ui-avatars.com/api/?name=User"
        }
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />

      <div>
        <h3 className="font-semibold">
          {user?.user_metadata?.full_name || "User"}
        </h3>

        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>

    </div>
  );
}