import { Tldraw, createTLStore, getSnapshot, loadSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../lib/supabse";

export default function TldrawCanvas({ roomId }) {
  const [store] = useState(() => createTLStore());
  const [loading, setLoading] = useState(true);

  const editorRef = useRef(null);
  const channelRef = useRef(null);
  const previousSnapshot = useRef("");
  const isRemoteUpdate = useRef(false);
  const saveTimeoutRef = useRef(null);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const loadCanvas = async () => {
    try {
      const { data, error } = await supabase
        .from("room_canvas")
        .select("*")
        .eq("room_id", roomId)
        .maybeSingle();

      if (error) {
        console.error("Load error:", error);
        setLoading(false);
        return;
      }

      if (!data) {
        const emptySnapshot = getSnapshot(store);
        const { error: insertError } = await supabase
          .from("room_canvas")
          .upsert(
            { room_id: roomId, canvas_data: emptySnapshot },
            { onConflict: "room_id" },
          );
        if (insertError) console.error("Insert error:", insertError);
        previousSnapshot.current = JSON.stringify(emptySnapshot);
      } else if (data.canvas_data) {
        isRemoteUpdate.current = true;
        editorRef.current?.store.mergeRemoteChanges(() => {
          loadSnapshot(store, data.canvas_data);
        });
        previousSnapshot.current = JSON.stringify(data.canvas_data);
        isRemoteUpdate.current = false;
      }

      setLoading(false);
    } catch (err) {
      console.error("loadCanvas error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_canvas",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          try {
            const snapshot = payload.new.canvas_data;
            if (!snapshot) return;

            const incoming = JSON.stringify(snapshot);

            if (incoming === previousSnapshot.current) return;

            isRemoteUpdate.current = true;
            editorRef.current?.store.mergeRemoteChanges(() => {
              loadSnapshot(store, snapshot);
            });
            previousSnapshot.current = incoming;
            isRemoteUpdate.current = false;
          } catch (err) {
            console.error("Realtime payload error:", err);
          }
        },
      )
      .subscribe((status) => {
        console.log(`Channel room-${roomId}: ${status}`);
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    };
  }, [roomId, store]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    loadCanvas();

    const unsubscribe = editor.store.listen(
      () => {
        if (isRemoteUpdate.current) return;

        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(async () => {
          if (!editorRef.current) return;
          try {
            const snapshot = getSnapshot(editor.store);
            const snapshotString = JSON.stringify(snapshot);

            if (snapshotString === previousSnapshot.current) return;
            previousSnapshot.current = snapshotString;

            const { error } = await supabase
              .from("room_canvas")
              .upsert(
                { room_id: roomIdRef.current, canvas_data: snapshot },
                { onConflict: "room_id" },
              );

            if (error) console.error("Save error:", error);
          } catch (err) {
            console.error("Save error:", err);
          }
        }, 100);
      },
      { source: "user", scope: "document" },
    );

    return () => {
      unsubscribe();
      clearTimeout(saveTimeoutRef.current);
    };
  };

  return (
    <div className="flex-1 bg-[#0F1117] relative">
      <Tldraw store={store} onMount={handleMount} />

      {loading && (
        <div className="absolute inset-0 bg-[#0F1117] flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.4)]">
              <div className="w-5 h-5 bg-white rounded-md rotate-12 opacity-90" />
            </div>
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
