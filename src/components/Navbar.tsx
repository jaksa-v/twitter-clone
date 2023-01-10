import Link from "next/link";
import AuthShowcase from "./AuthShowcase";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-gray-900 p-4">
      <Link href={"/"} className="font-bold">
        Home
      </Link>
      <AuthShowcase />
    </div>
  );
};

export default Navbar;
