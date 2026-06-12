import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b-[3px] border-black bg-background px-4 py-3">
      <SidebarTrigger className="cursor-pointer hover:bg-muted rounded-sm" />
      <Separator orientation="vertical" className="h-5 bg-black/30" />
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold leading-none truncate">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
