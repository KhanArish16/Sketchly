import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabse";

import JoinRoom from "../components/JoinRoom";

import LeftSidebar from "../editor/LeftSidebar";
import TldrawCanvas from "../editor/TldrawCanvas";

export default function Editor() {
  const { roomId } = useParams();

  const [status, setStatus] = useState("loading");
  const [room, setRoom] = useState(null);

  useEffect(() => {
    checkAccess();

    const interval = setInterval(() => {
      checkAccess();
    }, 3000);

    return () => clearInterval(interval);
  }, [roomId]);

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
      .maybeSingle();

    if (data) {
      const { data: roomData } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      setRoom(roomData);
      setStatus("allowed");
    } else {
      setStatus("not_allowed");
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen bg-[#080a0f] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (status === "no_auth") {
    return (
      <div className="h-screen bg-[#080a0f] flex items-center justify-center text-white">
        Please login first
      </div>
    );
  }

  if (status === "not_allowed") {
    return <JoinRoom roomId={roomId} />;
  }

  return (
    <div className="h-screen bg-[#080a0f] flex overflow-hidden">
      <LeftSidebar room={room} roomId={roomId} />

      <TldrawCanvas roomId={roomId} />
    </div>
  );
}
