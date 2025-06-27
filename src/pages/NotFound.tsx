import { Home } from "lucide-react"
import { Link } from "react-router-dom"

import AlertDestructive from "@/components/AlertDestructive"
import { Button } from "@/components/ui/button"

interface Props {
  title?: string
  message?: string
}

function NotFound({ title, message }: Props) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <AlertDestructive
        className="justify-items-center"
        titleStyles="text-2xl text-center"
        descriptionStyles="text-lg "
        title={title ? title : "404 - Page Not Found"}
        message={message ? message : "😢 Sorry the page you are looking for seems not to exist"}
      />

      <Button asChild className="mt-6">
        <Link to={"/"}>
          <Home />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}

export default NotFound
