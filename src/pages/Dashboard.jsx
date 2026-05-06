import { supabase } from "../lib/supabse";

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
