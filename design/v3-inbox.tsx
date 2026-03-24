/**
 * from Paper — v3 Inbox
 * Artboard ID: 4QS-0
 */
export default function V3Inbox() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip w-360 h-225 bg-[#F6F5F1] antialiased text-xs/4">
      <div className="flex flex-col w-65 h-full shrink-0 py-6 px-5 border-r border-r-solid border-r-[#2E2E2C0F]">
        <div className="flex items-center pb-7 gap-2.5">
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-[#2E2E2C] shrink-0">
            <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#F6F5F1] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
              F
            </div>
          </div>
          <div className="flex flex-col gap-px">
            <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[15px]/4.5">
              Flowboard
            </div>
            <div className="opacity-[0.3] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
              Acme Inc
            </div>
          </div>
        </div>
        <div className="flex flex-col pb-6 gap-0.5">
          <div className="flex items-center justify-between rounded-lg py-2 px-3 border-l-2 border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4l6 4 6-4" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="#2E403659" strokeWidth="1.2" />
              </svg>
              <div className="opacity-[1] inline-block [white-space-collapse:preserve] [text-wrap:initial] text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
                Inbox
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[100px] py-0.5 px-1.75 bg-[#8B4049]">
              <div className="inline-block [white-space-collapse:preserve] text-wrap text-white font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                3
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#2E403659" strokeWidth="1.2" />
              <path d="M5.5 8l2 2 3-4" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="opacity-[0.45] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              My Issues
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
            </svg>
            <div className="inline-block [white-space-collapse:preserve] opacity-[0.45] [text-wrap:initial] text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              Projects
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="2" rx="1" stroke="#2E403659" strokeWidth="1.2" />
              <rect x="2" y="7" width="12" height="2" rx="1" stroke="#2E403659" strokeWidth="1.2" />
              <rect x="2" y="11" width="8" height="2" rx="1" stroke="#2E403659" strokeWidth="1.2" />
            </svg>
            <div className="opacity-[0.45] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              Views
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="6" r="2.5" stroke="#2E403659" strokeWidth="1.2" />
              <circle cx="11" cy="6" r="2" stroke="#2E403659" strokeWidth="1.2" />
              <path d="M1 14c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <div className="opacity-[0.45] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              Teams
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A39E" strokeWidth="2">
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
            <div className="opacity-[0.45] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              Analytics
            </div>
          </div>
          <div className="flex items-center -order-10 opacity-[0.45] rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A3A39E" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="4" rx="1" />
              <rect x="3" y="14" width="7" height="4" rx="1" />
              <rect x="14" y="11" width="7" height="7" rx="1" />
            </svg>
            <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              Dashboard
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-[#2E2E2C0F] shrink-0" />
        <div className="flex flex-col pt-5 gap-3">
          <div className="opacity-[0.5] tracking-widest pl-3 inline-block [white-space-collapse:preserve] [text-wrap:initial] text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
            PROJECTS
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center py-1.5 px-3 gap-2.5">
              <div className="shrink-0 rounded-[100px] bg-[#6B6B60] size-1.5" />
              <div className="opacity-[0.5] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
                Frontend v2.4
              </div>
            </div>
            <div className="flex items-center py-1.5 px-3 gap-2.5">
              <div className="shrink-0 rounded-[100px] bg-[#B5B2AB] size-1.5" />
              <div className="opacity-[0.5] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
                API Platform
              </div>
            </div>
            <div className="flex items-center py-1.5 px-3 gap-2.5">
              <div className="shrink-0 rounded-[100px] bg-[#2E2E2C] size-1.5" />
              <div className="opacity-[0.5] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
                Design System
              </div>
            </div>
            <div className="flex items-center py-1.5 px-3 gap-2.5">
              <div className="shrink-0 rounded-[100px] bg-[#8B4049] size-1.5" />
              <div className="opacity-[0.5] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
                Mobile App
              </div>
            </div>
          </div>
        </div>
        <div className="grow h-81.5 shrink-0" />
        <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.86 1.33h2.28l.32 1.93.76.32 1.64-1.06 1.62 1.62-1.06 1.64.32.76 1.93.32v2.28l-1.93.32-.32.76 1.06 1.64-1.62 1.62-1.64-1.06-.76.32-.32 1.93H6.86l-.32-1.93-.76-.32-1.64 1.06-1.62-1.62 1.06-1.64-.32-.76-1.93-.32V6.86l1.93-.32.32-.76-1.06-1.64 1.62-1.62 1.64 1.06.76-.32.32-1.93z" stroke="#A3A39E" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="2" stroke="#A3A39E" strokeWidth="1.2" />
          </svg>
          <div className="opacity-[0.45] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
            Settings
          </div>
        </div>
      </div>
      <div className="flex flex-col grow shrink basis-[0%] h-full">
        <div className="flex items-center justify-between shrink-0 py-4 px-10">
          <div className="flex items-center gap-2">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              Acme Inc
            </div>
            <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              /
            </div>
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Inbox
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg py-2 px-4 gap-2 bg-[#EDEAE4]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
                Search...
              </div>
              <div className="inline-block rounded-sm py-0.5 px-1.5 bg-[#DFDBCF]">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  {"\u2318"}K
                </div>
              </div>
            </div>
            <div className="rounded-[50%] bg-[#9C9B90] shrink-0 size-8" />
          </div>
        </div>
        <div className="flex flex-col grow shrink basis-[0%] px-10 overflow-clip">
          <div className="flex items-center justify-between shrink-0 pb-4">
            <div className="flex items-center gap-5">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[26px]/8">
                Inbox
              </div>
              <div className="flex items-center rounded-lg gap-1 bg-[#EDEAE4] p-0.5">
                <div className="rounded-md py-1.25 px-3.5 bg-white">
                  <div className="inline-block text-black font-sans text-base/5">
                    All
                  </div>
                </div>
                <div className="text-black font-sans py-1.25 px-3.5 text-base/5">
                  Mentions
                </div>
                <div className="text-black font-sans py-1.25 px-3.5 text-base/5">
                  Assigned
                </div>
                <div className="text-black font-sans py-1.25 px-3.5 text-base/5">
                  Comments
                </div>
              </div>
            </div>
            <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Mark all as read
            </div>
          </div>
          <div className="pt-2 pb-1.5 shrink-0 text-black font-sans text-base/5">
            TODAY
          </div>
          <div className="flex items-start mb-0.5 py-3.5 px-4 gap-3 bg-[#2E2E2C0A] [border-left-width:3px] border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <div className="shrink-0 rounded-[50%] bg-[#C4C0B8] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
                Elena moved Auth flow to In Review
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              2h ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 py-3.5 px-4 gap-3 bg-[#2E2E2C0A] [border-left-width:3px] border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
                Marcus commented on API migration
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                API Platform
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              5h ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 py-3.5 px-4 gap-3 bg-[#2E2E2C0A] [border-left-width:3px] border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <div className="shrink-0 rounded-[50%] bg-[#B5B2AB] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
                Sarah assigned you Redesign onboarding flow
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              6h ago
            </div>
          </div>
          <div className="pt-4 pb-1.5 shrink-0 text-black font-sans text-base/5">
            YESTERDAY
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#C4C0B8] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                James completed CI pipeline setup
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              18h ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#B5B2AB] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Lina created sprint Sprint 25
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              1d ago
            </div>
          </div>
          <div className="pt-4 pb-1.5 shrink-0 text-black font-sans text-base/5">
            THIS WEEK
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Alex changed priority of Dashboard redesign to P1
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Design System
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              3d ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                James added you to the API Platform project
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                API Platform
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              1w ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Sarah created milestone v2.4 Release
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              1w ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Tom reviewed your PR on settings redesign
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Design System
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              4d ago
            </div>
          </div>
          <div className="flex items-start mb-0.5 rounded-lg py-3.5 px-4 gap-3">
            <div className="shrink-0 rounded-[50%] bg-[#9C9B90] size-8" />
            <div className="flex flex-col grow shrink basis-[0%] gap-0.5">
              <div className="inline-block text-[#7A756C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Elena completed Fix date picker timezone bug
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Frontend v2.4
              </div>
            </div>
            <div className="shrink-0 inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
              5d ago
            </div>
          </div>
          <div className="pt-4 pb-1.5 shrink-0 tracking-[0.08em] text-[#00000066] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/5">
            EARLIER
          </div>
        </div>
      </div>
    </div>
  );
}
