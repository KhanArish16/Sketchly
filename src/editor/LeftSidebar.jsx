import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabse";
import {
  Trash2,
  UserMinus,
  Share2,
  Pencil,
  Crown,
  Check,
  X,
  Users,
  Bell,
  Loader2,
} from "lucide-react";

export default function LeftSidebar({ room: initialRoom, roomId }) {
  const [room, setRoom] = useState(initialRoom);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [owner, setOwner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    init();
  }, [roomId]);

  useEffect(() => {
    if (renameOpen) {
      setNewName(room?.name || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [renameOpen]);

  const init = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    setCurrentUser(user);
    await Promise.all([fetchOwner(), fetchMembers(user), fetchRequests()]);
    setLoading(false);
  };

  const fetchOwner = async () => {
    if (!initialRoom?.owner_id) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .eq("id", initialRoom.owner_id)
      .maybeSingle();

    if (error) {
      console.error("fetchOwner error:", error.message);
      return;
    }
    setOwner(data);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("room_requests")
      .select(
        `
      id,
      user_id,
      profiles!room_requests_user_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `,
      )
      .eq("room_id", roomId);

    if (error) {
      console.error("fetchRequests error:", error.message);
      return;
    }
    setRequests(data || []);
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("room_members")
      .select(
        `
      user_id,
      profiles!room_members_user_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `,
      )
      .eq("room_id", roomId);

    if (error) {
      console.error("fetchMembers error:", error.message);
      return;
    }

    const filtered = (data || []).filter(
      (m) => m.user_id !== initialRoom?.owner_id,
    );
    setMembers(filtered);
  };

  const isOwner = currentUser?.id === initialRoom?.owner_id;

  const approveRequest = async (req) => {
    if (!isOwner) return;
    const { data: existing } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", req.user_id)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase
        .from("room_members")
        .insert([{ room_id: roomId, user_id: req.user_id }]);
      if (error) {
        console.error(error.message);
        return;
      }
    }
    await supabase.from("room_requests").delete().eq("id", req.id);
    fetchMembers();
    fetchRequests();
  };

  const rejectRequest = async (req) => {
    if (!isOwner) return;
    await supabase.from("room_requests").delete().eq("id", req.id);
    fetchRequests();
  };

  const removeMember = async (member) => {
    if (!isOwner) return;
    if (!confirm("Remove this member from the room?")) return;
    await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", member.user_id);
    fetchMembers();
  };

  const submitRename = async () => {
    if (!newName.trim()) return;
    setRenaming(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Not logged in. Please refresh.");
      setRenaming(false);
      return;
    }

    if (session.user.id !== initialRoom?.owner_id) {
      alert("Only the owner can rename this room.");
      setRenaming(false);
      return;
    }

    const { data, error } = await supabase
      .from("rooms")
      .upsert({
        id: roomId,
        name: newName.trim(),
        owner_id: initialRoom.owner_id,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("rename error:", error);
      alert("Failed: " + error.message);
      setRenaming(false);
      return;
    }

    setRoom((prev) => ({ ...prev, name: data.name }));
    setRenaming(false);
    setRenameOpen(false);
  };

  const shareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room link copied!");
  };

  const deleteRoom = async () => {
    if (!isOwner) return;
    if (!confirm("Permanently delete this room? This cannot be undone."))
      return;
    await supabase.from("rooms").delete().eq("id", roomId);
    window.location.href = "/dashboard";
  };

  const displayName = (profile) => {
    if (!profile) return "Unknown";
    const full =
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    return full || profile.email || "Unknown";
  };

  const initials = (profile) => {
    if (!profile) return "?";
    if (profile.first_name)
      return (
        profile.first_name[0] + (profile.last_name?.[0] || "")
      ).toUpperCase();
    return (profile.email?.[0] || "?").toUpperCase();
  };

  const avatarColors = [
    "bg-indigo-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-rose-500",
  ];
  const getColor = (id) =>
    avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <>
      {renameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setRenameOpen(false)}
        >
          <div className="bg-[#0f1117] border border-white/[0.08] rounded-2xl p-5 w-[320px] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-white">
                Rename room
              </h2>
              <button
                onClick={() => setRenameOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.07] text-white/40 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
              placeholder="Room name"
              className="w-full bg-[#1a1d27] border border-white/[0.09] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/25 outline-none focus:border-indigo-500/60 transition mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRenameOpen(false)}
                className="flex-1 py-2 rounded-lg text-[12px] text-white/50 border border-white/[0.07] hover:bg-white/[0.05] transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRename}
                disabled={renaming || !newName.trim()}
                className="flex-1 py-2 rounded-lg text-[12px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {renaming ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : null}
                {renaming ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-[240px] h-screen bg-[#09090f] border-r border-white/[0.06] text-white flex flex-col select-none">
        <div className="px-3.5 pt-3.5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-[13px] font-semibold truncate text-white leading-tight">
                {room?.name || "Untitled Room"}
              </h1>
              <p className="text-[10px] text-white/30 mt-0.5">
                Collaborative workspace
              </p>
            </div>
            {isOwner && (
              <button
                onClick={() => setRenameOpen(true)}
                className="p-1 rounded-md hover:bg-white/[0.07] text-white/30 hover:text-white/70 transition flex-shrink-0"
                title="Rename room"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/80">
              Live · {members.length + 1} in room
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="px-3.5 pt-3 pb-2.5 border-b border-white/[0.05]">
            <div className="flex items-center gap-1.5 mb-2">
              <Crown size={10} className="text-amber-400" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Owner
              </span>
            </div>
            {loading ? (
              <div className="h-8 bg-white/[0.04] rounded-lg animate-pulse" />
            ) : owner ? (
              <div className="flex items-center gap-2.5 py-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${getColor(owner.id)} text-white`}
                >
                  {initials(owner)}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-white truncate leading-tight">
                    {displayName(owner)}
                    {currentUser?.id === owner.id && (
                      <span className="ml-1.5 text-[9px] text-indigo-400">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-white/30 truncate">
                    {owner.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-white/30 py-1">
                Owner data unavailable
              </p>
            )}
          </div>

          <div className="px-3.5 pt-3 pb-2.5 border-b border-white/[0.05]">
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={10} className="text-white/30" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Members
              </span>
              <span className="ml-auto text-[10px] text-white/20 bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                {members.length}
              </span>
            </div>
            <div className="space-y-0.5 max-h-[170px] overflow-y-auto">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-8 bg-white/[0.04] rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : members.length === 0 ? (
                <p className="text-[11px] text-white/20 py-1.5">
                  No members yet
                </p>
              ) : (
                members.map((member, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition"
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getColor(member.user_id)} text-white`}
                    >
                      {initials(member.profiles)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-white/80 truncate leading-tight">
                        {displayName(member.profiles)}
                        {currentUser?.id === member.user_id && (
                          <span className="ml-1 text-[9px] text-indigo-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] text-white/25 truncate">
                        {member.profiles?.email}
                      </p>
                    </div>

                    {isOwner && member.user_id !== currentUser?.id && (
                      <button
                        onClick={() => removeMember(member)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition flex-shrink-0"
                        title="Remove member"
                      >
                        <UserMinus size={11} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {isOwner && (
            <div className="px-3.5 pt-3 pb-2.5 border-b border-white/[0.05]">
              <div className="flex items-center gap-1.5 mb-2">
                <Bell size={10} className="text-white/30" />
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                  Requests
                </span>
                {requests.length > 0 && (
                  <span className="ml-auto text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
                    {requests.length}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {requests.length === 0 ? (
                  <p className="text-[11px] text-white/20 py-1.5">
                    No pending requests
                  </p>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getColor(req.user_id)} text-white`}
                        >
                          {initials(req.profiles)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-white/80 truncate">
                            {displayName(req.profiles)}
                          </p>
                          <p className="text-[9px] text-white/25 truncate">
                            {req.profiles?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approveRequest(req)}
                          className="flex-1 flex items-center justify-center gap-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] py-1 rounded-md transition border border-emerald-500/20"
                        >
                          <Check size={10} /> Accept
                        </button>
                        <button
                          onClick={() => rejectRequest(req)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] py-1 rounded-md transition border border-red-500/15"
                        >
                          <X size={10} /> Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06] space-y-1.5">
          <button
            onClick={shareRoom}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-[12px] font-medium py-2 rounded-lg transition"
          >
            <Share2 size={12} /> Copy invite link
          </button>
          {isOwner && (
            <button
              onClick={deleteRoom}
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/10 text-red-400/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/25 text-[12px] py-2 rounded-lg transition"
            >
              <Trash2 size={12} /> Delete room
            </button>
          )}
        </div>
      </div>
    </>
  );
}
