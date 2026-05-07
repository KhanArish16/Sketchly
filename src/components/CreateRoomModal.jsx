import { useState } from "react";
import { supabase } from "../lib/supabse";

export default function CreateRoomModal({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");

  const createRoom = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabase
      .from("rooms")
      .insert([{ name, owner_id: user.id }])
      .select();

    if (error) return alert(error.message);

    const room = data[0];

    await supabase.from("room_members").insert([
      {
        room_id: room.id,
        user_id: user.id,
      },
    ]);

    if (emails.trim() !== "") {
      const emailList = emails.split(",").map((e) => e.trim());

      const { data: users } = await supabase
        .from("profiles")
        .select("id, email")
        .in("email", emailList);

      if (users && users.length > 0) {
        const members = users.map((u) => ({
          room_id: room.id,
          user_id: u.id,
        }));

        await supabase.from("room_members").insert(members);
      }
    }

    onCreated(room);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#11131a] p-6 rounded-xl w-96 text-white">
        <h2 className="mb-4 text-lg">Create Room</h2>

        <input
          placeholder="Room name"
          className="w-full p-2 mb-3 rounded bg-gray-800"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Add members (comma separated emails)"
          className="w-full p-2 mb-4 rounded bg-gray-800"
          onChange={(e) => setEmails(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={createRoom}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
