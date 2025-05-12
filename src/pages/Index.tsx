import CodeEditor from "@/components/CodeElements/CodeEditor"
import { useAuth } from "@/context/auth/useAuth"

function Index() {
  const { user } = useAuth()

  return (
    <>
      <div className="min-h-screen bg-[url('/images/waves.svg')] bg-cover bg-center py-20 text-center">
        <h1 className="font-samurai text-9xl uppercase">Algorithm Samurai</h1>
        <p className="text-primary/70 text-3xl font-semibold">
          Welcome {user?.user_name ? user.user_name : "Kenshi"}-san.
        </p>
        <p className="text-primary/70 text-2xl">
          🥷 Learn the way of the Ronin: sharpen your blades, master coding and
          conquer algorithms.
        </p>
        <div className="bg-background mx-auto w-3xl rounded-2xl p-4">
          <CodeEditor />
        </div>
      </div>
    </>
  )
}

export default Index
