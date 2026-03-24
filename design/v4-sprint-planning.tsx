/**
 * from Paper — v4 Sprint Planning
 * Artboard ID: 862-0
 */
export default function V4SprintPlanning() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip w-360 h-225 bg-[#F6F5F1] antialiased text-xs/4">
      <div className="[font-synthesis:none] flex flex-col w-65 h-full shrink-0 py-6 px-5 border-r border-r-solid border-r-[#2E2E2C0F] antialiased text-xs/4">
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
          <div className="flex items-center justify-between rounded-lg py-2 px-3">
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4l6 4 6-4" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="#2E403659" strokeWidth="1.2" />
              </svg>
              <div className="opacity-[0.45] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
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
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5 border-l-2 border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
            </svg>
            <div className="inline-block [white-space-collapse:preserve] [text-wrap:initial] text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
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
              <div className="shrink-0 rounded-[100px] bg-[#9C9B90] size-1.5" />
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
      <div className="flex flex-col grow shrink basis-[0%] min-w-0 h-225">
        <div className="[font-synthesis:none] flex items-center justify-between shrink-0 py-4 px-10 antialiased text-xs/4">
          <div className="flex items-center gap-1.5">
            <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              Acme Inc
            </div>
            <div className="inline-block text-[#D1CDC6] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              /
            </div>
            <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              Frontend v2.4
            </div>
            <div className="inline-block text-[#D1CDC6] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              /
            </div>
            <div className="inline-block text-[#3C3A36] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Sprint Planning
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg py-2 px-3.5 gap-2 bg-white border border-solid border-[#E8E4DE]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#9C9790" strokeWidth="1.5" />
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#9C9790" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
                Search...
              </div>
              <div className="inline-block rounded-sm py-px px-1.25 border border-solid border-[#E8E4DE]">
                <div className="inline-block text-[#C4C0BA] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[10px]/3">
                  ⌘K
                </div>
              </div>
            </div>
            <div className="rounded-lg py-2.25 px-5 bg-[#3C3A36]">
              <div className="text-white font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Start Sprint
              </div>
            </div>
            <div className="rounded-[50%] bg-[#D1CDC6] shrink-0 size-8" />
          </div>
        </div>
        <div className="flex grow shrink basis-[0%] min-h-0 pb-6 gap-4 px-10">
          <div className="[font-synthesis:none] flex flex-col grow shrink basis-[0%] rounded-xl overflow-clip bg-white border border-solid border-[#E8E4DE] antialiased text-xs/4">
            <div className="flex flex-col shrink-0 pt-4 pb-3 gap-2.5 border-b border-b-solid border-b-[#E8E4DE] px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="inline-block text-[#3C3A36] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[15px]/4.5">
                    Backlog
                  </div>
                  <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                    12 issues
                  </div>
                </div>
                <div className="inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-xs/4">
                  38 pts
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center grow shrink basis-[0%] rounded-md py-1.5 px-2.5 gap-1.5 bg-[#F6F5F1] border border-solid border-[#E8E4DE]">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#B5B0A8" strokeWidth="1.5" />
                    <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#B5B0A8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div className="inline-block text-[#B5B0A8] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                    Search issues...
                  </div>
                </div>
                <div className="flex items-center rounded-md py-1.5 px-2.5 gap-1 bg-white border border-solid border-[#E8E4DE]">
                  <div className="inline-block text-[#78716C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                    Priority
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2.5 4L5 6.5L7.5 4" stroke="#9C9790" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                <div className="flex items-center rounded-[5px] py-0.75 px-2 gap-1 bg-[#FEF2F2] border border-solid border-[#FECACA]">
                  <div className="inline-block text-[#DC2626] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[11px]/3.5">
                    P0 Critical
                  </div>
                </div>
                <div className="flex items-center rounded-[5px] py-0.75 px-2 gap-1 bg-[#F6F5F1] border border-solid border-[#E8E4DE]">
                  <div className="inline-block text-[#78716C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Unassigned
                  </div>
                </div>
                <div className="flex items-center rounded-[5px] py-0.75 px-2 gap-1 bg-[#F6F5F1] border border-solid border-[#E8E4DE]">
                  <div className="inline-block text-[#78716C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Bugs
                  </div>
                </div>
                <div className="flex items-center rounded-[5px] py-0.75 px-2 gap-1 bg-[#F6F5F1] border border-solid border-[#E8E4DE]">
                  <div className="inline-block text-[#78716C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    My Issues
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-150
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Add dark mode support
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FFFBEB]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P1
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  MC
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  5
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-151
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Refactor notification service
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#F0FDF4]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P2
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  EK
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  3
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-152
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Write API documentation
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#F5F0EB]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P3
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  SC
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  2
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-153
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Implement SSO login
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FEF2F2]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P0
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  AW
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  8
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-154
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Add export to CSV
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#F0FDF4]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P2
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  MC
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  2
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-155
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Improve search performance
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FFFBEB]">
                <div className="inline-block text-[#D97706] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P1
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  EK
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F6F5F1]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  3
                </div>
              </div>
            </div>
          </div>
          <div className="[font-synthesis:none] flex flex-col grow shrink basis-[0%] overflow-clip bg-[#FDFBF8] border-t border-t-solid border-t-[#E8E4DE] border-l-2 border-l-solid border-l-[#C17B5A] border-b border-b-solid border-b-[#E8E4DE] border-r border-r-solid border-r-[#E8E4DE] antialiased text-xs/4 rounded-r-xl">
            <div className="flex flex-col shrink-0 pt-4 pb-3.5 gap-2.5 border-b border-b-solid border-b-[#E8E4DE] px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-md pr-2.5 pl-1 gap-1.25 bg-white border border-solid border-[#E8E4DE] py-1">
                    <div className="rounded-sm py-0.5 px-1.75 bg-[#16A34A]">
                      <div className="text-black font-sans text-base/5">
                        Active
                      </div>
                    </div>
                    <div className="inline-block text-[#3C3A36] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
                      Sprint 25
                    </div>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#9C9790" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                    4 issues
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <div className="inline-block text-[#3C3A36] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-sm/4.5">
                    18
                  </div>
                  <div className="inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                    / 24 pts
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  Mar 10 – Mar 24
                </div>
                <div className="w-0.75 h-0.75 rounded-[50%] bg-[#D1CDC6] shrink-0" />
                <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  Goal: Ship auth v2 and dashboard redesign
                </div>
              </div>
              <div className="w-full h-1.5 rounded-[3px] overflow-clip bg-[#F0EDE7] shrink-0">
                <div className="w-[75%] h-full rounded-[3px] bg-[#C17B5A]" />
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-160
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Build onboarding wizard
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FEF2F2]">
                <div className="inline-block text-[#DC2626] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P0
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  MC
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F0EDE7]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  5
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-161
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Fix timezone offset in reports
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FFFBEB]">
                <div className="inline-block text-[#DC2626] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P1
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  EK
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F0EDE7]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  3
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-162
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Migrate email templates
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#F0FDF4]">
                <div className="inline-block text-[#DC2626] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P2
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  SC
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F0EDE7]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  5
                </div>
              </div>
            </div>
            <div className="flex items-center py-2.25 px-5 gap-2.5 border-b border-b-solid border-b-[#F0EDE7]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="2" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="2" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="5" r="1.2" fill="#C4C0BA" />
                <circle cx="2" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="5" cy="8" r="1.2" fill="#C4C0BA" />
                <circle cx="8" cy="8" r="1.2" fill="#C4C0BA" />
              </svg>
              <div className="w-13 shrink-0 inline-block text-[#9C9790] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-163
              </div>
              <div className="grow shrink basis-[0%] [white-space-collapse:collapse] inline-block overflow-clip">
                <div className="h-fit text-[#3C3A36] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4 line-clamp-1">
                  Add team activity dashboard
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.5 bg-[#FFFBEB]">
                <div className="inline-block text-[#DC2626] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[10px]/3">
                  P1
                </div>
              </div>
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                  AW
                </div>
              </div>
              <div className="shrink-0 inline-block rounded-sm py-0.5 px-1.75 bg-[#F0EDE7]">
                <div className="inline-block text-[#78716C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  5
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center grow shrink basis-[0%] rounded-lg border-2 border-dashed border-[#E8E4DE] my-3 mx-5">
              <div className="inline-block text-[#C4C0BA] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Drag issues here from backlog
              </div>
            </div>
            <div className="flex flex-col shrink-0 py-3.5 px-5 gap-2.5 border-t border-t-solid border-t-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="[letter-spacing:0.05em] uppercase inline-block text-[#9C9790] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  Team Load
                </div>
                <div className="inline-block text-[#9C9790] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  6 pts / person avg
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                    <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                      MC
                    </div>
                  </div>
                  <div className="grow shrink basis-[0%] h-1.5 rounded-[3px] overflow-clip bg-[#F0EDE7]">
                    <div className="w-[83%] h-full rounded-[3px] bg-[#C17B5A]" />
                  </div>
                  <div className="w-fit text-right shrink-0 inline-block [white-space-collapse:collapse] text-[#3C3A36] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                    5 pts
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                    <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                      EK
                    </div>
                  </div>
                  <div className="grow shrink basis-[0%] h-1.5 rounded-[3px] overflow-clip bg-[#F0EDE7]">
                    <div className="w-[50%] h-full rounded-[3px] bg-[#C17B5A]" />
                  </div>
                  <div className="w-fit text-right shrink-0 inline-block [white-space-collapse:collapse] text-[#3C3A36] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                    3 pts
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                    <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                      SC
                    </div>
                  </div>
                  <div className="grow shrink basis-[0%] h-1.5 rounded-[3px] overflow-clip bg-[#F0EDE7]">
                    <div className="w-[83%] h-full rounded-[3px] bg-[#C17B5A]" />
                  </div>
                  <div className="w-fit text-right shrink-0 inline-block [white-space-collapse:collapse] text-[#3C3A36] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                    5 pts
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0 rounded-[50%] bg-[#E8E4DE]">
                    <div className="inline-block text-[#78716C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[9px]/3">
                      AW
                    </div>
                  </div>
                  <div className="grow shrink basis-[0%] h-1.5 rounded-[3px] overflow-clip bg-[#F0EDE7]">
                    <div className="w-[83%] h-full rounded-[3px] bg-[#C17B5A]" />
                  </div>
                  <div className="w-fit text-right shrink-0 inline-block [white-space-collapse:collapse] text-[#3C3A36] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                    5 pts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
