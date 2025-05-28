import Survey from "./components/Survey";

export default function Home() {
  return (
    // Removed font-[family-name:var(--font-geist-sans)] to inherit from body
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Survey />
      </main>
    </div>
  );
}
