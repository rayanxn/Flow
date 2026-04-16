import { redirect } from "next/navigation";
import { getUserWorkspace } from "@/lib/queries/workspaces";
import { OnboardingWizard } from "./onboarding-wizard";
import { getDefaultSignedInPath } from "@/lib/utils/auth-redirect";

export default async function OnboardingPage() {
  const workspace = await getUserWorkspace();

  if (workspace) {
    redirect(await getDefaultSignedInPath());
  }

  return <OnboardingWizard />;
}
