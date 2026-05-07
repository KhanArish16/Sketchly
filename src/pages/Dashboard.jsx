import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabse";

import { Trash2, Pencil, LogOut } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [myRooms, setMyRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;

    if (!user) return;

    const { data: ownedRooms } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", user.id);

    setMyRooms(ownedRooms || []);

    const { data: memberships } = await supabase
      .from("room_members")
      .select(
        `
        room_id,
        rooms (*)
      `,
      )
      .eq("user_id", user.id);

    const uniqueRooms = [
      ...new Map(memberships?.map((m) => [m.rooms.id, m.rooms])).values(),
    ];

    const joined =
      uniqueRooms.filter((room) => room.owner_id !== user.id) || [];

    const ownerIds = [...new Set(joined.map((room) => room.owner_id))];

    let ownersMap = {};

    if (ownerIds.length > 0) {
      const { data: owners } = await supabase
        .from("profiles")
        .select(
          `
          id,
          first_name,
          last_name
        `,
        )
        .in("id", ownerIds);

      ownersMap = Object.fromEntries(owners.map((o) => [o.id, o]));
    }

    const joinedWithOwners = joined.map((room) => ({
      ...room,
      ownerProfile: ownersMap[room.owner_id],
    }));

    setJoinedRooms(joinedWithOwners);

    const ownedRoomIds = ownedRooms?.map((room) => room.id) || [];

    if (ownedRoomIds.length > 0) {
      const { data: requestData } = await supabase
        .from("room_requests")
        .select(
          `
          id,
          room_id,
          user_id,

          profiles (
            first_name,
            last_name
          ),

          rooms (
            name
          )
        `,
        )
        .in("room_id", ownedRoomIds);

      setRequests(requestData || []);
    }
  };

  const approveRequest = async (req) => {
    const { data: existingMember } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", req.room_id)
      .eq("user_id", req.user_id)
      .maybeSingle();

    if (!existingMember) {
      const { error } = await supabase.from("room_members").insert([
        {
          room_id: req.room_id,
          user_id: req.user_id,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    await supabase.from("room_requests").delete().eq("id", req.id);

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const rejectRequest = async (req) => {
    await supabase.from("room_requests").delete().eq("id", req.id);

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const deleteRoom = async (roomId) => {
    const confirmDelete = confirm("Delete this room?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("rooms").delete().eq("id", roomId);

    if (error) {
      alert(error.message);
      return;
    }

    setMyRooms((prev) => prev.filter((room) => room.id !== roomId));
  };

  const renameRoom = async (room) => {
    const newName = prompt("Enter new room name", room.name);

    if (!newName) return;

    const { error } = await supabase
      .from("rooms")
      .update({
        name: newName,
      })
      .eq("id", room.id);

    if (error) {
      alert(error.message);
      return;
    }

    setMyRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, name: newName } : r)),
    );
  };

  const leaveRoom = async (roomId) => {
    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;

    const confirmLeave = confirm("Leave this room?");

    if (!confirmLeave) return;

    const { error } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setJoinedRooms((prev) => prev.filter((room) => room.id !== roomId));
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>

          <p className="text-gray-400 mt-1">Manage collaborative rooms</p>
        </div>

        <button
          onClick={() => navigate("/create-room")}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
        >
          + Create Room
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl mb-5">My Rooms</h2>

        {myRooms.length === 0 && (
          <p className="text-gray-400">No rooms created yet</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/editor/${room.id}`)}
              className="bg-[#11131a] border border-gray-800 p-5 rounded-xl cursor-pointer hover:border-blue-500 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{room.name}</h3>

                  <p className="text-sm text-gray-400 mt-2">Created by you</p>
                </div>

                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => renameRoom(room)}
                    className="p-2 hover:bg-gray-800 rounded"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteRoom(room.id)}
                    className="p-2 hover:bg-red-500/20 rounded text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-5">Joined Rooms</h2>

        {joinedRooms.length === 0 && (
          <p className="text-gray-400">No joined rooms</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {joinedRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/editor/${room.id}`)}
              className="bg-[#11131a] border border-gray-800 p-5 rounded-xl cursor-pointer hover:border-green-500 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{room.name}</h3>

                  <p className="text-sm text-gray-400 mt-2">
                    Shared with you by{" "}
                    {room.ownerProfile
                      ? `${room.ownerProfile.first_name} ${room.ownerProfile.last_name}`
                      : "Unknown User"}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => leaveRoom(room.id)}
                    className="p-2 hover:bg-red-500/20 rounded text-red-400"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl mb-5">Access Requests</h2>

        {requests.length === 0 && (
          <p className="text-gray-400">No pending requests</p>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-[#11131a] border border-gray-800 p-4 rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {req.profiles?.first_name} {req.profiles?.last_name}
                </p>

                <p className="text-sm text-gray-400">
                  wants access to{" "}
                  <span className="text-white">{req.rooms?.name}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveRequest(req)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectRequest(req)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
