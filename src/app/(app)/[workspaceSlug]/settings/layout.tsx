import { SettingsNav } from "@/components/settings/settings-nav";

const settingsItems = [
  { label: "General", href: "/general" },
  { label: "Members", href: "/members" },
  { label: "Profile", href: "/profile" },
];

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const basePath = `/${workspaceSlug}/settings`;

  return (
    <div className="flex h-full min-h-0">
      <SettingsNav
        items={settingsItems}
        sectionLabel="Settings"
        basePath={basePath}
      />
      <div className="flex-1 overflow-y-auto py-8 px-12">
        {children}
      </div>
    </div>
  );
}
