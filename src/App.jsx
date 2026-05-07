import { useEffect, useState } from "react";
import { supabase } from "./lib/supabse";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./route/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateRoomPage from "./pages/CreateRoomPage";
import Editor from "./pages/Editor";

function AppRoutes({ session }) {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/editor");

  return (
    <div className="min-h-screen bg-[#080A0F] font-sans">
      {!hideNavbar && <Navbar session={session} />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-room"
          element={
            <ProtectedRoute session={session}>
              <CreateRoomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:roomId"
          element={
            <ProtectedRoute session={session}>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.4)]">
            <div className="w-5 h-5 bg-white rounded-md rotate-12 opacity-90" />
          </div>

          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes session={session} />
    </BrowserRouter>
  );
}
