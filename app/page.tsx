import Controls from "./components/Controls";
import Events from "./components/Events";
import Monitors from "./components/Monitors";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans p-4">
      <main className="flex gap-4 flex-col">
        <div className="flex gap-4">
          <Events />
          <Monitors />
        </div>
        <Controls />
      </main>
    </div>
  );
}
