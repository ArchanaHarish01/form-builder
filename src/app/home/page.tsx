import { Toggle } from "../../components/Toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Dark Mode UI</h1>
      <p className="mb-6 text-lg">Toggle the theme using the button in the bottom right.</p>
      <Toggle />
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <p>This box adjusts based on the theme.</p>
      </div>
    </main>

  );
}
