import Notifications from "@/components/game/Notifications";
import Controls from "../components/game/Controls";
import Events from "../components/game/Events";
import Monitors from "../components/game/Monitors";
import Header from "../components/game/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-4">
      <main className="flex gap-4 flex-col">
        <Header />
        <div className="grid grid-cols-2 gap-4">
          <Events />
          <Monitors />
        </div>
        <Controls />
        <Notifications />
      </main>
    </div>
  );
}
