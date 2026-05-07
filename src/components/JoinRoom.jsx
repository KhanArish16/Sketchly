import { useState } from "react";
import { supabase } from "../lib/supabse";

export default function JoinRoom({ roomId }) {
  const [requested, setRequested] = useState(false);

  const requestAccess = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data: existing } = await supabase
      .from("room_requests")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setRequested(true);
      return;
    }

    const { error } = await supabase.from("room_requests").insert([
      {
        room_id: roomId,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setRequested(true);
  };

  return (
    <div className="h-screen bg-[#080a0f] flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl mb-3">Access Required</h2>

      {!requested ? (
        <button
          onClick={requestAccess}
          className="bg-blue-500 px-5 py-2 rounded-lg"
        >
          Request Access
        </button>
      ) : (
        <p className="text-gray-400">Waiting for owner approval...</p>
      )}
    </div>
  );
}
