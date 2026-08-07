import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { usePageTitle } from "@/hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Page Not Found");

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="404 — Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        action={
          <Link to="/">
            <Button>Back to Dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
