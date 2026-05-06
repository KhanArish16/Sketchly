import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function CreateRoomModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const createRoom = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          name,
          owner_id: user.id,
        },
      ])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    onCreated(data[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#11131a] p-6 rounded-xl w-96">
        <h2 className="text-lg mb-4">Create Room</h2>

        <input
          placeholder="Room name"
          className="w-full p-2 mb-3 rounded bg-gray-800"
          onChange={(e) => setName(e.target.value)}
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
