import Notifications from "@/components/game/Notifications";
import Controls from "../components/game/Controls";
import Events from "../components/game/Events";
import Monitors from "../components/game/Monitors";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-4">
      <main className="flex gap-4 flex-col">
        <div className="flex gap-4">
          <Events />
          <Monitors />
          <Notifications />
        </div>
        <Controls />
      </main>
    </div>
  );
}
