/**
 * from Paper — v3 My Issues
 * Artboard ID: 4UH-0
 */
export default function V3MyIssues() {
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
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5 border-l-2 border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#2E403659" strokeWidth="1.2" />
              <path d="M5.5 8l2 2 3-4" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="opacity-[1] inline-block [white-space-collapse:preserve] [text-wrap:initial] text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
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
              My Issues
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
        <div className="flex items-center justify-between shrink-0 pb-5 px-10">
          <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[26px]/8">
            My Issues
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-[#EDEAE4] p-0.5">
              <div className="rounded-md py-1.5 px-3.5 bg-white">
                <div className="inline-block text-black font-sans text-base/5">
                  List
                </div>
              </div>
              <div className="text-black font-sans py-1.5 px-3.5 text-base/5">
                Board
              </div>
            </div>
            <div className="flex items-center rounded-lg py-1.5 px-3 gap-1.5 border border-solid border-[#E8E4DE]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="18" x2="8" y2="18" />
              </svg>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Sort: Priority
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col grow shrink basis-[0%] px-10 overflow-clip">
          <div className="flex flex-col">
            <div className="flex items-center py-2.5 gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="rounded-[50%] bg-[#C4923A] shrink-0 size-2" />
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
                In Progress
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                3
              </div>
            </div>
            <div className="flex items-center py-1.5 gap-3 border-b border-b-solid border-b-[#E8E4DE]">
              <div className="w-5 shrink-0" />
              <div className="tracking-[0.06em] w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                ID
              </div>
              <div className="tracking-[0.06em] grow shrink basis-[0%] inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                TITLE
              </div>
              <div className="tracking-[0.06em] w-30 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                PROJECT
              </div>
              <div className="tracking-[0.06em] w-15 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                PRIORITY
              </div>
              <div className="tracking-[0.06em] w-17.5 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                DUE
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-139
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Migrate user settings to new API schema
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  API Platform
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P0
              </div>
              <div className="w-17.5 shrink-0 inline-block [white-space-collapse:preserve] text-wrap text-[#8B4049] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
                Mar 16
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-141
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Implement drag-and-drop reordering for tasks
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Frontend v2.4
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P1
              </div>
              <div className="w-17.5 shrink-0 inline-block [white-space-collapse:preserve] text-wrap text-[#8B4049] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
                Today
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-136
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Redesign project settings panel
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#7B6B96] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Design System
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P1
              </div>
              <div className="w-17.5 shrink-0 inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Mar 20
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center pt-4 pb-2.5 gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <div className="rounded-[50%] bg-[#B5B2AB] shrink-0 size-2" />
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
                Todo
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                4
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-142
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Fix auth token refresh on expired sessions
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Frontend v2.4
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P0
              </div>
              <div className="w-17.5 shrink-0 inline-block [white-space-collapse:preserve] text-wrap text-[#8B4049] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
                Mar 17
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-145
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Add keyboard shortcuts for board navigation
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Frontend v2.4
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P2
              </div>
              <div className="w-17.5 shrink-0 inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Mar 22
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-148
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Update onboarding copy for new users
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Frontend v2.4
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P3
              </div>
              <div className="w-17.5 shrink-0 inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Mar 25
              </div>
            </div>
            <div className="flex items-center py-2.5 gap-3 border-b border-b-solid border-b-[#F0EDE7]">
              <div className="w-5 h-4 shrink-0 rounded-sm [border-width:1.5px] border-solid border-[#D5D0C8]" />
              <div className="w-16 shrink-0 inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-xs/4">
                FLO-130
              </div>
              <div className="grow shrink basis-[0%] inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Set up CI pipeline for staging
              </div>
              <div className="flex items-center w-30 shrink-0 gap-1.5">
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-1.5" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Frontend v2.4
                </div>
              </div>
              <div className="w-15 shrink-0 text-black font-sans text-base/5">
                P2
              </div>
              <div className="w-17.5 shrink-0 inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Done
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center py-2.5 gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <polyline points="4,2 8,6 4,10" stroke="#B8B3AB" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="shrink-0 rounded-[50%] bg-[#4A7A5C] size-2" />
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
                Done
              </div>
              <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
