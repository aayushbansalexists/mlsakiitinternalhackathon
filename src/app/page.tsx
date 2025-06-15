import Image from "next/image";

export default function Home() {
  return (
    <main className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">BiteAdvisor 🍳</h1>
      <p className="text-sm text-gray-600 mt-2">
        Upload a photo of your fridge and get recipes instantly!
      </p>
    </main>
  )

}
