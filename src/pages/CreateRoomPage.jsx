import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";

export default function CreateRoomPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#080a0f]">
      <CreateRoomModal
        onClose={() => navigate("/dashboard")}
        onCreated={(room) => {
          navigate(`/editor/${room.id}`);
        }}
      />
    </div>
  );
}
