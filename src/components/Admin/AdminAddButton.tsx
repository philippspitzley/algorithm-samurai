import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  name: string
  onAdd: () => void
  className?: string
}

function AdminAddButton({ name, className: styles, onAdd }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Button onClick={onAdd} variant="ghost" className={styles}>
        {name}
        <Plus />
      </Button>
    </div>
  )
}

export default AdminAddButton
