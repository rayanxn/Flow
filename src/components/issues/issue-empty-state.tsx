import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IssueEmptyStateProps {
  onCreateIssue?: () => void;
}

export function IssueEmptyState({ onCreateIssue }: IssueEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mb-5">
        <ClipboardList className="w-7 h-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text mb-1">No issues yet</h3>
      <p className="text-sm text-text-muted mb-5">
        Create your first issue to get started.
      </p>
      {onCreateIssue && (
        <>
          <Button onClick={onCreateIssue}>New Issue</Button>
          <p className="text-xs text-text-muted mt-3">
            or import from another tool
          </p>
        </>
      )}
    </div>
  );
}
