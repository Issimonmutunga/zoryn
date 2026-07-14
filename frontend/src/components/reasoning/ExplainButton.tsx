import { Button } from "@/components/ui/button";

type ExplainButtonProps = {
  onClick?: () => void;
};

export default function ExplainButton({
  onClick,
}: ExplainButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full"
    >
      Explain this discovery
    </Button>
  );
}