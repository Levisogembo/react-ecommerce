import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../Components/loadingSpinner";

const GuestRoute = () => {
	const { user, checkingAuth } = useUserStore();

	if (checkingAuth) return <LoadingSpinner />;

	if (user) {
		return <Navigate to="/" replace />;
	}

	return <><Outlet/></>;
};

export default GuestRoute