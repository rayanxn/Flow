/**
 * from Paper — v3 Create Sprint Modal
 * Artboard ID: 5NS-0
 */
export default function V3CreateSprintModal() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip items-center justify-center relative bg-[#F6F5F1] antialiased text-xs/4">
      <div className="absolute top-0 left-0 w-360 h-225 bg-[#2E2E2C73]" />
      <div className="w-130 flex flex-col rounded-2xl relative bg-white border border-solid border-[#2E2E2C14] [box-shadow:#2E2E2C2E_0px_24px_64px,#2E2E2C0F_0px_2px_8px] shrink-0">
        <div className="flex items-center justify-between pt-5 pb-4 border-b border-b-solid border-b-[#2E2E2C0F] px-6">
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[17px]/5.5">
            New Sprint
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: '0.35', flexShrink: '0' }}>
            <path d="M12 4L4 12M4 4l8 8" stroke="#2E2E2C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col py-5 px-6 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              SPRINT NAME
            </div>
            <div className="flex items-center h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Sprint 25
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                START DATE
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  Mar 24, 2026
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: '0.25' }}>
                  <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="#2E2E2C" strokeWidth="1.2" />
                  <path d="M1.5 5.5H12.5M4.5 1V3.5M9.5 1V3.5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                END DATE
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  Apr 7, 2026
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: '0.25' }}>
                  <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="#2E2E2C" strokeWidth="1.2" />
                  <path d="M1.5 5.5H12.5M4.5 1V3.5M9.5 1V3.5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              SPRINT GOAL
            </div>
            <div className="flex items-start h-18 rounded-[10px] py-3 px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4.5">
                What does this sprint aim to accomplish?
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end pt-4 pb-5 gap-2.5 border-t border-t-solid border-t-[#2E2E2C0F] px-6">
          <div className="flex items-center justify-center rounded-lg py-2.5 px-5 border border-solid border-[#2E2E2C14]">
            <div className="opacity-[0.5] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Cancel
            </div>
          </div>
          <div className="flex items-center justify-center rounded-lg py-2.5 px-6 bg-[#2E2E2C]">
            <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
              Create Sprint
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
