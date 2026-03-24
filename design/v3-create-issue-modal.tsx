/**
 * from Paper — v3 Create Issue Modal
 * Artboard ID: 5IV-0
 */
export default function V3CreateIssueModal() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip items-center justify-center relative bg-[#F6F5F1] antialiased text-xs/4">
      <div className="absolute top-0 left-0 w-360 h-225 bg-[#2E2E2C73]" />
      <div className="relative w-140 flex flex-col rounded-2xl bg-white border border-solid border-[#2E2E2C14] [box-shadow:#2E2E2C2E_0px_24px_64px,#2E2E2C0F_0px_2px_8px] shrink-0">
        <div className="flex items-center justify-between pt-5 pb-4 border-b border-b-solid border-b-[#2E2E2C0F] px-6">
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[17px]/5.5">
            New Issue
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: '0.35', flexShrink: '0' }}>
            <path d="M12 4L4 12M4 4l8 8" stroke="#2E2E2C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col py-5 px-6 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              TITLE
            </div>
            <div className="flex items-center h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.3] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Enter issue title...
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              DESCRIPTION
            </div>
            <div className="flex items-start h-22 rounded-[10px] py-3 px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4.5">
                Add a description...
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                ASSIGNEE
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-5.5 h-5.5 opacity-[0.7] rounded-[100px] bg-[#9C9B90] shrink-0" />
                  <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                    Marcus Chen
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M3 5L6 8L9 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                PRIORITY
              </div>
              <div className="flex items-center h-11 rounded-[10px] px-3.5 gap-2.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="rounded-[100px] bg-[#8B4049] shrink-0 size-2" />
                  <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-semibold text-[11px]/3.5">
                    P0
                  </div>
                </div>
                <div className="flex items-center opacity-[0.25] gap-2">
                  <div className="rounded-[100px] bg-[#6B6B60] shrink-0 size-2" />
                  <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                    P1
                  </div>
                </div>
                <div className="flex items-center opacity-[0.25] gap-2">
                  <div className="rounded-[100px] bg-[#9C9B90] shrink-0 size-2" />
                  <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                    P2
                  </div>
                </div>
                <div className="flex items-center opacity-[0.25] gap-2">
                  <div className="rounded-[100px] bg-[#A3A39E] shrink-0 size-2" />
                  <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                    P3
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                PROJECT
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-[100px] bg-[#6B6B60] shrink-0 size-2" />
                  <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                    Frontend v2.4
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M3 5L6 8L9 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                SPRINT
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  Sprint 24
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M3 5L6 8L9 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              LABELS
            </div>
            <div className="flex items-center flex-wrap min-h-11 rounded-[10px] py-2 px-3.5 gap-2 bg-[#F6F5F1] border border-solid border-[#2E2E2C14]">
              <div className="flex items-center rounded-md py-1.25 px-3 gap-1.5 bg-white border border-solid border-[#2E2E2C14]">
                <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  Backend
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex items-center rounded-md py-1.25 px-3 gap-1.5 bg-white border border-solid border-[#2E2E2C14]">
                <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
                  Migration
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                + Add label
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 pb-5 gap-2.5 border-t border-t-solid border-t-[#2E2E2C0F] px-6">
          <div className="flex items-center justify-center rounded-lg py-2.5 px-5 border border-solid border-[#2E2E2C14]">
            <div className="opacity-[0.5] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Cancel
            </div>
          </div>
          <div className="flex items-center justify-center rounded-lg py-2.5 px-6 bg-[#2E2E2C]">
            <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
              Create Issue
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center rounded-[3px] py-px px-1.25 bg-[#F6F5F1] border border-solid border-[#2E2E2C0F]">
              <div className="inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[9px]/3.5">
                ⌘⏎
              </div>
            </div>
            <div className="opacity-[0.4] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
              to create
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
