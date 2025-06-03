import { LoaderCircle } from "lucide-react"

interface Props {
  size?: number
}

function LoadingSpinner({ size = 48 }: Props) {
  return (
    <div className="flex w-full items-center justify-center backdrop-blur-2xl">
      <LoaderCircle size={size} className="animate-spin" />
    </div>
  )
}

export default LoadingSpinner
