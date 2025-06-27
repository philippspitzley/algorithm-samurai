import { ArrowRight, BookOpen, Code, Target } from "lucide-react"
import { Link } from "react-router-dom"

import LoginButton from "@/components/LoginButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth/useAuth"
import useStats from "@/hooks/useStats"

function Index() {
  const { isAuthenticated } = useAuth()

  const { stats } = useStats()

  return (
    <div className="flex flex-col items-center gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8 text-center">
        <h1 className="font-samurai text-[8vw] leading-tight uppercase sm:text-6xl md:text-8xl">
          Algorithm Samurai
        </h1>

        <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed">
          Master the art of algorithms through interactive coding challenges. Learn, practice, and
          sharpen your programming skills with our AI-powered learning platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Button asChild size="lg">
              <Link to="/courses">
                Continue Learning <ArrowRight />
              </Link>
            </Button>
          ) : (
            <>
              <LoginButton size="lg" className="px-8" returnToCurrentPage={false}>
                Start Learning <ArrowRight />
              </LoginButton>
              <Button asChild size="lg" className="px-8">
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Code className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Interactive Coding</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Practice algorithms with our built-in code editor. Get instant feedback and test
                your solutions in real-time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 rounded-lg p-2">
                  <Target className="text-accent h-6 w-6" />
                </div>
                <CardTitle className="text-xl">AI-Powered Hints</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Stuck on a problem? Our AI tutor provides personalized hints and guidance to help
                you learn effectively.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green/10 rounded-lg p-2">
                  <BookOpen className="text-green h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Structured Learning</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Follow carefully crafted courses that build your skills progressively from basic to
                advanced concepts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full max-w-4xl">
        <div className="grid grid-cols-1 place-items-center gap-8 text-center sm:grid-cols-2">
          <Card className="bg-background w-full max-w-xs p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="text-yellow text-4xl font-bold">{stats?.total_courses}</div>
              <div className="text-muted-foreground">Courses</div>
            </div>
          </Card>

          <Card className="bg-background w-full max-w-xs p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="text-green text-4xl font-bold">{stats?.total_users}</div>
              <div className="text-muted-foreground">Students Learning</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Index
