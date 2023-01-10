import Link from "next/link";
import AuthShowcase from "./AuthShowcase";

const Navbar = () => {
  return (
    <div className="flex items-center justify-center bg-gray-900 py-4">
      <div className="flex w-full items-center justify-between px-4 sm:w-[640px]">
        <Link href={"/"} className="text-lg font-bold">
          Home
        </Link>
        <AuthShowcase />
      </div>
    </div>
  );
};

export default Navbar;
