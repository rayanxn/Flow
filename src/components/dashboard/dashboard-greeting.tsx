import { format } from "date-fns";
import { formatGreeting } from "@/lib/utils/dates";

interface DashboardGreetingProps {
  firstName: string;
}

export function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  const now = new Date();
  const dayAndDate = format(now, "EEEE, MMM d").toUpperCase();
  const greeting = formatGreeting();

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[13px] tracking-[0.04em] text-text-secondary">
        {dayAndDate}
      </p>
      <h1 className="text-2xl font-semibold text-text">
        {greeting}, {firstName}
      </h1>
    </div>
  );
}
