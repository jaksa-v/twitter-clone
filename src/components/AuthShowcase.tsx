import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import AuthModal from "./AuthModal";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className="rounded-full bg-white/10 px-6 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => setShowModal(true)}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <AuthModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default AuthShowcase;
