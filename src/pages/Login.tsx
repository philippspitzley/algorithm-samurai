import { LoginForm } from "@/components/LoginForm"
import { Card } from "@/components/ui/card"

function Login() {
  return (
    <>
      <main className="mt-8 flex justify-center px-4">
        <Card className="w-lg px-6">
          <div className="relative z-10"></div>
          <LoginForm />
        </Card>
      </main>
    </>
  )
}

export default Login
