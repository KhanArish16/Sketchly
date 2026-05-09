import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabse";
import {
  Trash2,
  Pencil,
  LogOut,
  Plus,
  Crown,
  Users,
  Bell,
  Check,
  X,
  Loader2,
  FolderOpen,
  UserCheck,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [myRooms, setMyRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [renameTarget, setRenameTarget] = useState(null);
  const [renameName, setRenameName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const renameRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (renameTarget) {
      setRenameName(renameTarget.name);
      setTimeout(() => renameRef.current?.focus(), 50);
    }
  }, [renameTarget]);

  const fetchDashboard = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    setCurrentUser(user);

    const { data: ownedRooms } = await supabase
      .from("rooms")
      .select("*")
      .eq("owner_id", user.id);
    setMyRooms(ownedRooms || []);

    const { data: memberships } = await supabase
      .from("room_members")
      .select("room_id, rooms (*)")
      .eq("user_id", user.id);

    const uniqueRooms = [
      ...new Map(
        (memberships || []).map((m) => [m.rooms?.id, m.rooms]),
      ).values(),
    ].filter(Boolean);

    const joined = uniqueRooms.filter((r) => r.owner_id !== user.id);
    const ownerIds = [...new Set(joined.map((r) => r.owner_id))];

    let ownersMap = {};
    if (ownerIds.length > 0) {
      const { data: owners } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", ownerIds);
      ownersMap = Object.fromEntries((owners || []).map((o) => [o.id, o]));
    }

    setJoinedRooms(
      joined.map((r) => ({ ...r, ownerProfile: ownersMap[r.owner_id] })),
    );

    const ownedRoomIds = (ownedRooms || []).map((r) => r.id);
    if (ownedRoomIds.length > 0) {
      const { data: requestData } = await supabase
        .from("room_requests")
        .select(
          `id, room_id, user_id,
          profiles!room_requests_user_id_fkey (first_name, last_name, email),
          rooms (name)`,
        )
        .in("room_id", ownedRoomIds);
      setRequests(requestData || []);
    }
    setLoading(false);
  };

  const approveRequest = async (req) => {
    const { data: existing } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", req.room_id)
      .eq("user_id", req.user_id)
      .maybeSingle();
    if (!existing) {
      await supabase
        .from("room_members")
        .insert([{ room_id: req.room_id, user_id: req.user_id }]);
    }
    await supabase.from("room_requests").delete().eq("id", req.id);
    setRequests((p) => p.filter((r) => r.id !== req.id));
  };

  const rejectRequest = async (req) => {
    await supabase.from("room_requests").delete().eq("id", req.id);
    setRequests((p) => p.filter((r) => r.id !== req.id));
  };

  const deleteRoom = async (roomId) => {
    if (!confirm("Delete this room permanently?")) return;
    await supabase.from("rooms").delete().eq("id", roomId);
    setMyRooms((p) => p.filter((r) => r.id !== roomId));
  };

  const submitRename = async () => {
    if (!renameName.trim() || !renameTarget) return;
    setRenaming(true);
    const { error } = await supabase
      .from("rooms")
      .update({ name: renameName.trim() })
      .eq("id", renameTarget.id);
    if (!error) {
      setMyRooms((p) =>
        p.map((r) =>
          r.id === renameTarget.id ? { ...r, name: renameName.trim() } : r,
        ),
      );
      setRenameTarget(null);
    } else {
      alert("Failed: " + error.message);
    }
    setRenaming(false);
  };

  const leaveRoom = async (roomId) => {
    if (!confirm("Leave this room?")) return;
    const { data: ud } = await supabase.auth.getUser();
    await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", ud.user.id);
    setJoinedRooms((p) => p.filter((r) => r.id !== roomId));
  };

  const avatarColors = [
    "bg-indigo-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-rose-500",
  ];
  const getColor = (str) =>
    avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];
  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const roomInitials = (name) => name?.slice(0, 2).toUpperCase() || "??";

  return (
    <>
      {renameTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setRenameTarget(null)}
        >
          <div className="bg-[#0f1117] border border-white/[0.08] rounded-2xl p-5 w-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-white">
                Rename room
              </h2>
              <button
                onClick={() => setRenameTarget(null)}
                className="p-1 rounded-lg hover:bg-white/[0.07] text-white/40 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
            <input
              ref={renameRef}
              type="text"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
              className="w-full bg-[#1a1d27] border border-white/[0.09] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/25 outline-none focus:border-indigo-500/60 transition mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="flex-1 py-2 rounded-lg text-[12px] text-white/50 border border-white/[0.07] hover:bg-white/[0.05] transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRename}
                disabled={renaming || !renameName.trim()}
                className="flex-1 py-2 rounded-lg text-[12px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {renaming && <Loader2 size={12} className="animate-spin" />}
                {renaming ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#07090e] text-white flex mt-[60px]">
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 mr-[300px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-[13px] text-white/35 mt-1">
                {myRooms.length} owned · {joinedRooms.length} joined
              </p>
            </div>
            <button
              onClick={() => navigate("/create-room")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-[13px] font-medium transition"
            >
              <Plus size={15} /> Create room
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={24} className="animate-spin text-white/30" />
            </div>
          ) : (
            <>
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={14} className="text-amber-400" />
                  <h2 className="text-[13px] font-medium text-white/60 uppercase tracking-widest">
                    My rooms
                  </h2>
                  <span className="text-[11px] text-white/20 bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {myRooms.length}
                  </span>
                </div>

                {myRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/[0.08] rounded-2xl">
                    <FolderOpen size={28} className="text-white/15 mb-3" />
                    <p className="text-[13px] text-white/25">
                      No rooms created yet
                    </p>
                    <button
                      onClick={() => navigate("/create-room")}
                      className="mt-3 text-[12px] text-indigo-400 hover:text-indigo-300 transition"
                    >
                      + Create your first room
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {myRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => navigate(`/editor/${room.id}`)}
                        className="group relative bg-[#0f1117] border border-white/[0.07] hover:border-indigo-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:bg-[#121520]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-[14px] font-bold text-indigo-300 mb-4">
                          {roomInitials(room.name)}
                        </div>

                        <h3 className="text-[14px] font-semibold text-white truncate mb-1 pr-14">
                          {room.name}
                        </h3>
                        <p className="text-[11px] text-white/30">
                          Created by you
                        </p>

                        <div className="absolute bottom-4 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] text-emerald-400/70">
                            Open room
                          </span>
                        </div>

                        <div
                          className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setRenameTarget(room)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-white transition"
                            title="Rename"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={14} className="text-white/30" />
                  <h2 className="text-[13px] font-medium text-white/60 uppercase tracking-widest">
                    Joined rooms
                  </h2>
                  <span className="text-[11px] text-white/20 bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {joinedRooms.length}
                  </span>
                </div>

                {joinedRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/[0.08] rounded-2xl">
                    <Users size={28} className="text-white/15 mb-3" />
                    <p className="text-[13px] text-white/25">
                      No joined rooms yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {joinedRooms.map((room) => {
                      const ownerName = room.ownerProfile
                        ? `${room.ownerProfile.first_name || ""} ${room.ownerProfile.last_name || ""}`.trim()
                        : "Unknown";
                      return (
                        <div
                          key={room.id}
                          onClick={() => navigate(`/editor/${room.id}`)}
                          className="group relative bg-[#0f1117] border border-white/[0.07] hover:border-teal-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:bg-[#121520]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-teal-600/15 border border-teal-500/20 flex items-center justify-center text-[14px] font-bold text-teal-300 mb-4">
                            {roomInitials(room.name)}
                          </div>

                          <h3 className="text-[14px] font-semibold text-white truncate mb-1 pr-10">
                            {room.name}
                          </h3>

                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 ${getColor(ownerName)}`}
                            >
                              {ownerName[0]?.toUpperCase()}
                            </div>
                            <p className="text-[11px] text-white/30 truncate">
                              {ownerName}
                            </p>
                          </div>

                          <div className="absolute bottom-4 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            <span className="text-[10px] text-teal-400/70">
                              Open room
                            </span>
                          </div>

                          <div
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => leaveRoom(room.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                              title="Leave room"
                            >
                              <LogOut size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <div className="fixed top-[60px] right-0 w-[300px] h-[calc(100vh-60px)] bg-[#09090f] border-l border-white/[0.06] flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell size={13} className="text-amber-400" />
              <h2 className="text-[12px] font-medium text-white/60 uppercase tracking-widest">
                Access requests
              </h2>
              <span className="ml-auto text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-medium">
                {requests.length}
              </span>
            </div>
            <p className="text-[11px] text-white/25 mt-1.5">
              People waiting to join your rooms
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                  <Bell size={16} className="text-white/15" />
                </div>
                <p className="text-[12px] text-white/25 font-medium">
                  No pending requests
                </p>
                <p className="text-[11px] text-white/15 mt-1">
                  People who request access
                  <br />
                  to your rooms appear here
                </p>
              </div>
            ) : (
              requests.map((req) => {
                const name = req.profiles
                  ? `${req.profiles.first_name || ""} ${req.profiles.last_name || ""}`.trim() ||
                    req.profiles.email
                  : "Unknown";
                return (
                  <div
                    key={req.id}
                    className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-4 h-4 rounded-md bg-indigo-600/25 flex items-center justify-center text-[8px] font-bold text-indigo-300">
                        {roomInitials(req.rooms?.name)}
                      </div>
                      <span className="text-[10px] text-white/30 truncate">
                        Request to Access {req.rooms?.name} By:
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${getColor(req.user_id)}`}
                      >
                        {initials(name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-white truncate">
                          {name}
                        </p>
                        <p className="text-[10px] text-white/30 truncate">
                          {req.profiles?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => approveRequest(req)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium py-1.5 rounded-lg transition"
                      >
                        <Check size={11} /> Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(req)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 text-red-400 text-[11px] font-medium py-1.5 rounded-lg transition"
                      >
                        <X size={11} /> Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <UserCheck size={12} className="text-white/20" />
              <p className="text-[11px] text-white/20">
                Only you see this as room owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
