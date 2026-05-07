import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";
import JoinRoom from "../components/JoinRoom";

export default function Editor() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [room, setRoom] = useState(null);

  useEffect(() => {
    checkAccess();

    const interval = setInterval(() => {
      checkAccess();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const checkAccess = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setStatus("no_auth");
      return;
    }

    const { data } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", user.id)
      .single();

    if (data) {
      fetchRoom();
      setStatus("allowed");
    } else {
      setStatus("not_allowed");
    }
  };

  const fetchRoom = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    setRoom(data);
  };

  if (status === "loading") {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (status === "no_auth") {
    return <div className="p-6 text-white">Please login first</div>;
  }

  if (status === "not_allowed") {
    return <JoinRoom roomId={roomId} />;
  }

  return (
    <div className="h-screen bg-[#080a0f] text-white">
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6">
        <div>
          <h1 className="font-semibold">{room?.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
          >
            Manage Access
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Room link copied!");
            }}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Share Room
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <p className="text-gray-400">Canvas coming next...</p>
      </div>
    </div>
  );
}
