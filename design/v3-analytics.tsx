/**
 * from Paper — v3 Analytics
 * Artboard ID: 7EV-0
 */
export default function V3Analytics() {
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
          <div className="flex items-center rounded-lg py-2 px-3 gap-2.5 border-l-2 border-l-solid border-l-[#2E2E2C] rounded-r-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E2E2C" strokeWidth="2">
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
            <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
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
              <div className="shrink-0 rounded-[100px] bg-[#B5B0A8] size-1.5" />
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
              Analytics
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
        <div className="flex items-center justify-between shrink-0 pb-6 px-10">
          <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[26px]/8">
            Analytics
          </div>
          <div className="flex items-center rounded-lg py-2 px-4 gap-2 bg-white border border-solid border-[#E8E4DE]">
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Sprint 24
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9C9689" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="flex shrink-0 px-10 gap-4">
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-1.5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
              Issues Completed
            </div>
            <div className="flex items-baseline gap-2">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[32px]/10">
                14
              </div>
              <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#4A7A5C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                +3 from last
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-1.5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
              Avg Cycle Time
            </div>
            <div className="flex items-baseline gap-2">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[32px]/10">
                2.4d
              </div>
              <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#4A7A5C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                -0.6d
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-1.5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
              Velocity
            </div>
            <div className="flex items-baseline gap-2">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[32px]/10">
                38
              </div>
              <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
                pts/sprint
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-1.5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-xs/4">
              Completion Rate
            </div>
            <div className="flex items-baseline gap-2">
              <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[32px]/10">
                68%
              </div>
              <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#8B4049] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                -4%
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-6 mb-0 shrink-0 rounded-xl gap-4 bg-white border border-solid border-[#E8E4DE] mx-10 p-5">
          <div className="flex items-center justify-between">
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              Sprint Burndown
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded-[1px] bg-[#2E2E2C] shrink-0" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  Actual
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded-[1px] bg-[#D5D0C8] border-t border-t-dashed border-t-[#D5D0C8] shrink-0" />
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[11px]/3.5">
                  Ideal
                </div>
              </div>
            </div>
          </div>
          <svg width="100%" height="160" viewBox="0 0 800 160">
            <line x1="0" y1="0" x2="800" y2="0" stroke="#F0EDE7" />
            <line x1="0" y1="40" x2="800" y2="40" stroke="#F0EDE7" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#F0EDE7" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#F0EDE7" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#F0EDE7" />
            <text x="0" y="12" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              20
            </text>
            <text x="0" y="52" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              15
            </text>
            <text x="0" y="92" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              10
            </text>
            <text x="0" y="132" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              5
            </text>
            <text x="0" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              0
            </text>
            <line x1="40" y1="8" x2="780" y2="152" stroke="#D5D0C8" strokeWidth="1.5" strokeDasharray="6 4" />
            <polyline points="40,8 150,16 260,32 370,48 480,64 540,76 600,88 660,96 720,100" fill="none" stroke="#C17B5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'rgb(46, 46, 44)' }} />
            <circle cx="720" cy="100" r="4" fill="#C17B5A" style={{ fill: 'rgb(46, 46, 44)' }} />
            <text x="40" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              Mar 4
            </text>
            <text x="225" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              Mar 7
            </text>
            <text x="410" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              Mar 11
            </text>
            <text x="595" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              Mar 14
            </text>
            <text x="745" y="160" fontFamily="JetBrains Mono" fontSize="10" fill="#B8B3AB">
              Mar 18
            </text>
          </svg>
        </div>
        <div className="flex grow shrink basis-[0%] pt-6 pb-10 gap-4 px-10">
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              Issues by Label
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-15 shrink-0 inline-block text-[#2D2A26] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Bug
                </div>
                <div className="grow shrink basis-[0%] h-5 rounded-sm overflow-clip bg-[#F0EDE7]">
                  <div className="w-[65%] h-full rounded-sm bg-[#C4443A]" />
                </div>
                <div className="w-5 text-right inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] shrink-0 text-[11px]/3.5">
                  7
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-15 shrink-0 inline-block text-[#2D2A26] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Feature
                </div>
                <div className="grow shrink basis-[0%] h-5 rounded-sm overflow-clip bg-[#F0EDE7]">
                  <div className="w-[85%] h-full rounded-sm bg-[#4A7A5C]" />
                </div>
                <div className="w-5 text-right inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] shrink-0 text-[11px]/3.5">
                  9
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-15 shrink-0 inline-block text-[#2D2A26] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Design
                </div>
                <div className="grow shrink basis-[0%] h-5 rounded-sm overflow-clip bg-[#F0EDE7]">
                  <div className="w-[35%] h-full rounded-sm bg-[#7B6B96]" />
                </div>
                <div className="w-5 text-right inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] shrink-0 text-[11px]/3.5">
                  3
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-15 shrink-0 inline-block text-[#2D2A26] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  Ops
                </div>
                <div className="grow shrink basis-[0%] h-5 rounded-sm overflow-clip bg-[#F0EDE7]">
                  <div className="w-[15%] h-full rounded-sm bg-[#6B6B60]" />
                </div>
                <div className="w-5 text-right inline-block text-[#9C9689] font-['JetBrains_Mono',system-ui,sans-serif] shrink-0 text-[11px]/3.5">
                  1
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow shrink basis-[0%] rounded-xl gap-5 bg-white border border-solid border-[#E8E4DE] p-5">
            <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              Team Velocity
            </div>
            <div className="flex items-end grow shrink basis-[0%] pt-2 gap-6">
              <div className="flex flex-col items-center grow shrink basis-[0%] gap-2">
                <div className="w-full h-20 rounded-md bg-[#E8E4DE] shrink-0" />
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                  S21
                </div>
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  28
                </div>
              </div>
              <div className="flex flex-col items-center grow shrink basis-[0%] gap-2">
                <div className="w-full h-25 rounded-md bg-[#DFD9D2] shrink-0" />
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                  S22
                </div>
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  32
                </div>
              </div>
              <div className="flex flex-col items-center grow shrink basis-[0%] gap-2">
                <div className="w-full h-27.5 rounded-md bg-[#D6CFC6] shrink-0" />
                <div className="inline-block text-[#B8B3AB] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                  S23
                </div>
                <div className="inline-block text-[#9C9689] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                  35
                </div>
              </div>
              <div className="flex flex-col items-center grow shrink basis-[0%] gap-2">
                <div className="w-full h-30 rounded-md bg-[#2E2E2C] shrink-0" />
                <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-[10px]/3">
                  S24
                </div>
                <div className="inline-block text-[#2D2A26] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-xs/4">
                  38
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
