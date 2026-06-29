import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { verifyEmail } = useUserStore();

  useEffect(() => {
    const token = searchParams.get("token");

    const verify = async () => {
      const results = await verifyEmail(token);

      if (results.success) {
        toast.success("Email verified successfully", { id: "verify" });
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (!results.success) {
        setStatus("error");
        setError(results.message);
      }
    };

    if (token) {
      verify();
    }
  }, []);

  return (
    <div
      className="
min-h-screen 
flex 
items-center 
justify-center
bg-gray-900
"
    >
      <div className="text-center text-white">
        {status === "verifying" && <p>Verifying your email...</p>}

        {status === "success" && (
          <p className="text-emerald-400">Email verified successfully</p>
        )}

        {status === "error" && (
          <>
            <p className="text-red-400 mb-4">{error}</p>

            <button
              onClick={() => navigate("/resend-verification")}
              className="
bg-emerald-600
px-4
py-2
rounded-lg
"
            >
              Resend verification email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
