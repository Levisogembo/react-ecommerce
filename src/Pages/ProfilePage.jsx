import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  KeyRound,
  LogOut,
  Phone,
  Edit,
  VerifiedIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useState } from "react";
import EditProfileModal from "../Modals/EditProfileModal";

const ProfilePage = () => {
  const { userProfile, logout } = useUserStore();
  const [editingProfile, setEditingProfile] = useState(null);
  const user = userProfile;

  const getInitials = (user) => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (
      (first + last).toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {/* header */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 px-7 py-8 flex items-center gap-5">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-emerald-400 border-opacity-30 flex-shrink-0">
              {getInitials(user)}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <span className="text-xs bg-emerald-900 bg-opacity-60 text-emerald-300 border border-emerald-700 px-3 py-0.5 rounded-full mt-1 inline-block">
                {user.role}
              </span>
            </div>
          </div>

          {/* details */}
          <div className="px-7 py-2">
            {[
              {
                icon: User,
                label: "Full name",
                value: `${user.firstName} ${user.lastName}`,
              },
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone number", value: user.phoneNumber },
              {
                icon: Calendar,
                label: "Member since",
                value: formatDate(user.createdAt),
              },
              { icon: Shield, label: "Role", value: user.role },
              {
                icon: VerifiedIcon,
                label: "Verified",
                value: user.isVerified,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-3.5 border-b border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} className="text-gray-500" />
                  <span className="text-sm text-gray-400">{label}</span>
                </div>
                {value ? (
                  <span className="text-sm text-white font-medium">
                    {value}
                  </span>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs text-gray-400">N/A</span>
                  </div>
                )}
                {value && value === true && (
                  <span className="text-xs text-green-400">
                    {" "}
                    <Icon size={15} className="text-green-500" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* actions */}
          <div className="px-7 py-5 border-t border-gray-700 flex gap-3">
            <Link
              to="/change-password"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg transition duration-200"
            >
              <KeyRound size={14} />
              Change password
            </Link>
            <button
              onClick={() => setEditingProfile(userProfile)}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-green-900 hover:bg-green-950 hover:bg-opacity-40 text-green-400 text-sm font-medium py-2.5 rounded-lg transition duration-200"
            >
              <Edit size={14} />
              Edit Profile
            </button>
            <button
              onClick={() => logout(user)}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-red-900 hover:bg-red-950 hover:bg-opacity-40 text-red-400 text-sm font-medium py-2.5 rounded-lg transition duration-200"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
          {editingProfile && (
            <EditProfileModal
              profile={editingProfile}
              onClose={() => setEditingProfile(null)}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
