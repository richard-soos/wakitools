import type { ReactNode } from "react";

type ToolPageLayoutProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

const ToolPageLayout = ({
  title,
  description,
  action,
  children,
}: ToolPageLayoutProps) => {
  return (
    <main className="min-w-0 flex-1 bg-background px-3 py-6 text-foreground sm:px-4 sm:py-8">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>

          {action}
        </header>

        {children}
      </div>
    </main>
  );
};

export default ToolPageLayout;
