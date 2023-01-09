import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-gray-900 p-4">
      <Link href={"/"} className="font-bold">
        Home
      </Link>
    </div>
  );
};

export default Navbar;
