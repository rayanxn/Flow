/**
 * from Paper — v3 Board Redesign
 * Artboard ID: 6QW-0
 */
export default function V3BoardRedesign() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip w-360 h-225 bg-[#F5F2ED] antialiased text-xs/4">
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
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#2E403659" strokeWidth="1.2" />
              <path d="M5.5 8l2 2 3-4" stroke="#2E403659" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="opacity-[0.45] inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
              My Issues
            </div>
          </div>
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5 opacity-[0.45]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="#2E4036" strokeWidth="1.2" />
            </svg>
            <div className="inline-block [white-space-collapse:preserve] [text-wrap:initial] opacity-[1] text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
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
          <div className="opacity-[0.25] tracking-widest pl-3 inline-block [white-space-collapse:preserve] text-wrap text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
            PROJECTS
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center py-1.5 px-3 gap-2.5 border-l-2 border-l-solid border-l-[#B5654A] rounded-l-lg">
              <div className="shrink-0 rounded-[100px] bg-[#6B6B60] size-1.5" />
              <div className="opacity-[1] inline-block [white-space-collapse:preserve] [text-wrap:initial] text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
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
      <div className="flex flex-col grow shrink basis-[0%] bg-[#F5F2ED]">
        <div className="flex items-center justify-between shrink-0 py-4 px-10">
          <div className="flex items-center gap-2">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              Acme Inc
            </div>
            <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              /
            </div>
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Frontend v2.4
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
                  ⌘K
                </div>
              </div>
            </div>
            <div className="rounded-[50%] bg-[#9C9B90] shrink-0 size-8" />
          </div>
        </div>
        <div className="flex items-center justify-between shrink-0 pb-4 px-10">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[26px]/8">
                Sprint 24
              </div>
              <div className="inline-block rounded-xl py-0.75 px-2.5 bg-[#4A7A5C1F]">
                <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#4A7A5C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
                  Active
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="inline-block pb-0.5 border-b-2 border-b-solid border-b-[#2D2A26]">
                <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
                  Board
                </div>
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5 px-3">
                List
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5 px-3">
                Timeline
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5 px-3">
                Filter
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5 px-3">
                Group
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
              Mar 4 - Mar 18
            </div>
            <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#8B4049] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              68%
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
        </div>
        <div className="flex grow shrink basis-[0%] w-295 px-10 gap-4">
          <div className="flex flex-col grow shrink basis-[0%] gap-2.5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-[50%] bg-[#B5B2AB] shrink-0 size-2" />
                <div className="tracking-[0.06em] inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  TODO
                </div>
                <div className="inline-block rounded-lg py-px px-1.5 bg-[#EDEAE4]">
                  <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    4
                  </div>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8B3AB" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-142
                </div>
                <div className="rounded-[50%] bg-[#C4443A] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Fix auth token refresh on expired sessions
              </div>
              <div className="w-full h-0.75 rounded-xs overflow-clip bg-[#EDEAE4] shrink-0">
                <div className="w-[33%] h-full rounded-xs bg-[#C4923A]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Bug
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#C4443A] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[11px]/3.5">
                    Today
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#C4C0B8] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-145
                </div>
                <div className="rounded-[50%] bg-[#B5B2AB] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Add keyboard shortcuts for board navigation
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Feature
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 22
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#B5B2AB] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-148
                </div>
                <div className="rounded-[50%] bg-[#B5B2AB] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Update onboarding copy for new users
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Design
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 25
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#9C9B90] shrink-0" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] gap-2.5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-[50%] bg-[#C4923A] shrink-0 size-2" />
                <div className="tracking-[0.06em] inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  IN PROGRESS
                </div>
                <div className="inline-block rounded-lg py-px px-1.5 bg-[#EDEAE4]">
                  <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    2
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-139
                </div>
                <div className="rounded-[50%] bg-[#C4923A] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Migrate user settings to new API schema
              </div>
              <div className="w-full h-0.75 rounded-xs overflow-clip bg-[#EDEAE4] shrink-0">
                <div className="w-[60%] h-full rounded-xs bg-[#C4923A]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#8B4049]">
                    <div className="inline-block text-white font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      P0
                    </div>
                  </div>
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Backend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 16
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#9C9B90] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-141
                </div>
                <div className="rounded-[50%] bg-[#C4923A] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Implement drag-and-drop reordering for tasks
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Feature
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 18
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#B5B2AB] shrink-0" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] gap-2.5">
            <div className="flex items-center pb-2 gap-2">
              <div className="rounded-[50%] bg-[#7B6B96] shrink-0 size-2" />
              <div className="tracking-[0.06em] inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                IN REVIEW
              </div>
              <div className="inline-block rounded-lg py-px px-1.5 bg-[#EDEAE4]">
                <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  2
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-136
                </div>
                <div className="rounded-[50%] bg-[#7B6B96] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Redesign project settings panel
              </div>
              <div className="w-full h-0.75 rounded-xs overflow-clip bg-[#EDEAE4] shrink-0">
                <div className="rounded-xs bg-[#7B6B96] size-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Design
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 20
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#9C9B90] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-138
                </div>
                <div className="rounded-[50%] bg-[#7B6B96] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Add export to CSV for sprint reports
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Feature
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                    Mar 19
                  </div>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#C4C0B8] shrink-0" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] gap-2.5">
            <div className="flex items-center pb-2 gap-2">
              <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-2" />
              <div className="tracking-[0.06em] inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                DONE
              </div>
              <div className="inline-block rounded-lg py-px px-1.5 bg-[#EDEAE4]">
                <div className="inline-block text-[#B8B3AB] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  6
                </div>
              </div>
            </div>
            <div className="flex flex-col opacity-[0.7] rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-130
                </div>
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Set up CI pipeline for staging
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Ops
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#B5B2AB] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col opacity-[0.7] rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-132
                </div>
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Write integration tests for auth flow
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Backend
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#9C9B90] shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-col opacity-[0.7] rounded-[10px] py-3.5 px-4 gap-2.5 bg-white border border-solid border-[#E8E4DE]">
              <div className="flex items-center justify-between">
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                  FLO-134
                </div>
                <div className="rounded-[50%] bg-[#4A7A5C] shrink-0 size-2" />
              </div>
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/5">
                Fix date picker timezone bug
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="inline-block rounded-sm py-0.5 px-2 bg-[#F0EDE7]">
                    <div className="inline-block text-[#7A6E5D] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                      Bug
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div className="w-5.5 h-5.5 rounded-[50%] bg-[#C4C0B8] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
