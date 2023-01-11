import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useAuthModal() {
  const [showModal, setShowModal] = useState(false);
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (!sessionData) setShowModal(true);
    else setShowModal(false);
  }, [sessionData]);

  return { showModal, setShowModal };
}
