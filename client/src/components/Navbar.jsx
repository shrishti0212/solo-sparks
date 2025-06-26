import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../utils/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 text-gray-800 px-9 py-5 rounded-b-xl shadow-md backdrop-blur-sm">
      <div className="flex justify-between items-center mx-auto">
        <h1 className="text-2xl font-bold tracking-wide">Solo Sparks</h1>

        <div className="flex gap-6 text-sm font-medium items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                : "text-gray-700 hover:text-purple-700"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                : "text-gray-700 hover:text-purple-700"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                : "text-gray-700 hover:text-purple-700"
            }
          >
            Rewards
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-purple-700 border-b-2 border-purple-700 pb-1"
                : "text-gray-700 hover:text-purple-700"
            }
          >
            Profile
          </NavLink>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
