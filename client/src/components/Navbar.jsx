import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../utils/userSlice";
import logo from "../images/logo.png"

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white/90 text-gray-800 px-3 sm:px-6 py-4 shadow-md backdrop-blur-sm sm:h-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5">
        <h1 className="text-2xl font-bold tracking-wide ">Solo Sparks</h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium items-center">
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

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
