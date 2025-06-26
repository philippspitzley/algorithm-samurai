import { Ban, SquareTerminal } from "lucide-react"

import ButtonWithTooltip from "../ButtonWithTooltip"
import LoadingSpinner from "../LoadingSpinner"
import { Card } from "../ui/card"

interface Props {
  output: string[] | null
  isLoading: boolean
  hasRuntimeError: boolean
  isError: boolean
  testPassed: boolean

  onClearOutput: () => void
}

function Terminal(props: Props) {
  const { output, isLoading, isError, hasRuntimeError, onClearOutput, testPassed } = props

  const testPassedStyles = testPassed
    ? "border-8 border-green animate-[border-pulse_2s_ease-in-out_infinite]"
    : ""

  return (
    <Card className="ml-6 rounded-lg px-4 py-4 text-left shadow-none">
      <div className="flex justify-between">
        <h3 className="text-md mb-4 flex gap-2 opacity-70">
          <SquareTerminal size={24} /> Console Output:
        </h3>
        <ButtonWithTooltip
          size="icon"
          variant="ghost"
          onClick={onClearOutput}
          tooltip="Clear Console"
        >
          <Ban size={16} />
        </ButtonWithTooltip>
      </div>
      <div>
        <div
          className={`bg-background/60 min-h-16 rounded border p-3 font-mono text-sm ${testPassedStyles}`}
        >
          {isLoading && (
            <div className="text-muted-foreground flex items-center gap-2">
              <LoadingSpinner />
              <span>Executing code...</span>
            </div>
          )}
          {output && output.length > 0 && (
            <pre
              className={`whitespace-pre-wrap ${hasRuntimeError ? "text-[#F38BA8]" : "text-foreground"}`}
            >
              {output.join("\n")}
            </pre>
          )}
          {!isLoading && !isError && (!output || output.length === 0) && (
            <div className="text-muted-foreground italic">
              No output yet. Run your code to see results here.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
export default Terminal
