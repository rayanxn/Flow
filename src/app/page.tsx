import Link from "next/link";
import { redirect } from "next/navigation";
import { KanbanSquare, Layers, Zap, Shield } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: KanbanSquare,
    title: "Kanban Boards",
    description: "Organize tasks visually with flexible boards and lists.",
  },
  {
    icon: Layers,
    title: "Drag & Drop",
    description: "Move tasks between lists with intuitive drag and drop.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "See changes instantly as your team collaborates.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Your data is protected with row-level security.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/boards");
  }

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-base font-semibold">Task Orbit</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Organize your work, one board at a time
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Task Orbit is a simple, fast, and beautiful task management app
          inspired by Trello. Create boards, add lists, and track your
          progress with ease.
        </p>
        <div className="mt-10 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-2xl font-semibold">
            Everything you need to stay on track
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-background p-6"
              >
                <feature.icon className="mb-3 size-8 text-primary" />
                <h3 className="font-medium">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Task Orbit. All rights reserved.
      </footer>
    </div>
  );
}
