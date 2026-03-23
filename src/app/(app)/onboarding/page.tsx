import { redirect } from "next/navigation";
import { getUserWorkspace } from "@/lib/queries/workspaces";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function OnboardingPage() {
  const workspace = await getUserWorkspace();

  if (workspace) {
    redirect(`/${workspace.slug}/dashboard`);
  }

  return <OnboardingWizard />;
}
