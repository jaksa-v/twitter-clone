import { IoCloseOutline } from "react-icons/io5";
import { FaDiscord, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function AuthModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-[#00000080] outline-none focus:outline-none">
            <div className="relative my-6 mx-4 w-full max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-2xl border-0 bg-gray-800 shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between p-6">
                  <h3 className="text-xl font-semibold">
                    Sign in to Twitter Clone
                  </h3>
                  <IoCloseOutline
                    size="1.5rem"
                    className="cursor-pointer"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                {/*body*/}
                <div className="relative flex flex-col items-center justify-center gap-4 p-6">
                  <button
                    onClick={() => void signIn("google")}
                    className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-gray-600 py-3"
                  >
                    <span className="text-white">Sign in with Google</span>
                    <FaGoogle
                      className="inline-block text-white"
                      size="1.5rem"
                    />
                  </button>
                  <button
                    onClick={() => void signIn("discord")}
                    className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-gray-600 py-3"
                  >
                    <span className="text-white">Sign in with Discord</span>
                    <FaDiscord
                      className="inline-block text-white"
                      size="1.5rem"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}
