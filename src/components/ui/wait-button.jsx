import { Button } from "@/components/ui/button";
import { useWait } from "@/hooks/useWait";

export function WaitButton({ time = 5, children, ...props }) {
  const [count, countIsFinished] = useWait(time);

  return (
    <Button {...props} disabled={!countIsFinished || props.disabled}>
      {countIsFinished ? (
        children
      ) : (
        <>
          {children} ( {count} )
        </>
      )}
    </Button>
  );
}
