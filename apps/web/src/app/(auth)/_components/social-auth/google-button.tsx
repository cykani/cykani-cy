import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { SimpleIcon } from "@/ui/components/simple-icon";
import { siGoogle } from "simple-icons";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="secondary" className={cn(className)} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
