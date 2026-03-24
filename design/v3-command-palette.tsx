/**
 * from Paper — v3 Command Palette
 * Artboard ID: 5KV-0
 */
export default function V3CommandPalette() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip justify-center pt-45 relative bg-[#F6F5F1] antialiased text-xs/4">
      <div className="absolute top-0 left-0 w-360 h-225 bg-[#2E2E2C73]" />
      <div className="w-160 flex flex-col rounded-[14px] overflow-clip h-fit relative bg-white border border-solid border-[#2E2E2C14] [box-shadow:#2E2E2C33_0px_24px_64px,#2E2E2C0F_0px_2px_8px] shrink-0">
        <div className="flex items-center py-4 px-5 gap-3.5 border-b border-b-solid border-b-[#2E2E2C0F]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: '0', opacity: '0.3' }}>
            <circle cx="8" cy="8" r="5.5" stroke="#2E2E2C" strokeWidth="1.5" />
            <path d="M12 12L16 16" stroke="#2E2E2C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="opacity-[0.3] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[15px]/5">
            Search issues, projects, actions...
          </div>
        </div>
        <div className="flex flex-col p-2">
          <div className="tracking-[0.08em] opacity-[0.5] pt-2 pb-1.5 inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3 px-3">
            RECENT
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3 bg-[#F6F5F1]">
            <div className="flex items-center gap-3">
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-139
              </div>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Migrate user settings to new API schema
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="rounded-[100px] bg-[#9C9B90] shrink-0 size-1.5" />
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                API Platform
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3">
            <div className="flex items-center gap-3">
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-142
              </div>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Fix auth token refresh on expired sessions
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="rounded-[100px] bg-[#6B6B60] shrink-0 size-1.5" />
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                Frontend v2.4
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3">
            <div className="flex items-center gap-3">
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[11px]/3.5">
                FLO-141
              </div>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Implement drag-and-drop reordering for tasks
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="rounded-[100px] bg-[#6B6B60] shrink-0 size-1.5" />
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                Frontend v2.4
              </div>
            </div>
          </div>
          <div className="w-full h-px shrink-0 bg-[#2E2E2C0F]" />
          <div className="tracking-[0.08em] opacity-[0.5] pt-2.5 pb-1.5 inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3 px-3">
            ACTIONS
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: '0.35' }}>
                <circle cx="7" cy="7" r="6" stroke="#2E2E2C" strokeWidth="1.2" />
                <path d="M7 4.5V9.5M4.5 7H9.5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Create new issue
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  ⌘
                </div>
              </div>
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  N
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: '0.35' }}>
                <circle cx="7" cy="7" r="2" stroke="#2E2E2C" strokeWidth="1.2" />
                <path d="M7 1V3M7 11V13M1 7H3M11 7H13M2.75 2.75L4.17 4.17M9.83 9.83L11.25 11.25M11.25 2.75L9.83 4.17M4.17 9.83L2.75 11.25" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Go to settings
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  ⌘
                </div>
              </div>
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  ,
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg py-2.5 px-3">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: '0.35' }}>
                <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="#2E2E2C" strokeWidth="1.2" />
                <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" stroke="#2E2E2C" strokeWidth="1.2" />
                <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" stroke="#2E2E2C" strokeWidth="1.2" />
                <rect x="8" y="8" width="4.5" height="4.5" rx="1" stroke="#2E2E2C" strokeWidth="1.2" />
              </svg>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Switch project
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  ⌘
                </div>
              </div>
              <div className="flex items-center justify-center rounded-sm py-0.5 px-1.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3.5">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2.5 px-5 border-t border-t-solid border-t-[#2E2E2C0F]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-[3px] py-px px-1.25 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[9px]/3.5">
                  ↑↓
                </div>
              </div>
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                Navigate
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-[3px] py-px px-1.25 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[9px]/3.5">
                  ↵
                </div>
              </div>
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                Open
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center rounded-[3px] py-px px-1.25 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
                <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[9px]/3.5">
                  esc
                </div>
              </div>
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
                Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
