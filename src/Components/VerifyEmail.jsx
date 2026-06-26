import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { verifyEmail } = useUserStore();

  useEffect(() => {
    const token = searchParams.get("token");

    const verify = async () => {
      const results = await verifyEmail(token);

      if (results.success) {
        toast.success("Email verified successfully",{id:'verify'});
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
      <div className="text-white">Verifying your email...</div>
    </div>
  );
};

export default VerifyEmail;
