interface BreadcrumbProps {
  workspaceName: string;
  pageName: string;
}

export function Breadcrumb({ workspaceName, pageName }: BreadcrumbProps) {
  return (
    <div className="text-[13px] py-3 flex items-center gap-2">
      <span className="text-text-secondary">{workspaceName}</span>
      <span className="text-text-muted">/</span>
      <span className="text-text font-medium">{pageName}</span>
    </div>
  );
}
