/**
 * from Paper — v3 Create Project Modal
 * Artboard ID: 5NR-0
 */
export default function V3CreateProjectModal() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip items-center justify-center relative bg-[#F6F5F1] antialiased text-xs/4">
      <div className="absolute top-0 left-0 w-360 h-225 bg-[#2E2E2C73]" />
      <div className="w-130 flex flex-col rounded-2xl relative bg-white border border-solid border-[#2E2E2C14] [box-shadow:#2E2E2C2E_0px_24px_64px,#2E2E2C0F_0px_2px_8px] shrink-0">
        <div className="flex items-center justify-between pt-5 pb-4 border-b border-b-solid border-b-[#2E2E2C0F] px-6">
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[17px]/5.5">
            New Project
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: '0.35', flexShrink: '0' }}>
            <path d="M12 4L4 12M4 4l8 8" stroke="#2E2E2C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col py-5 px-6 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              PROJECT NAME
            </div>
            <div className="flex items-center h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Mobile App
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              DESCRIPTION
            </div>
            <div className="flex items-start h-18 rounded-[10px] py-3 px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4.5">
                What is this project about?
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                COLOR
              </div>
              <div className="flex items-center h-11 rounded-[10px] px-3.5 gap-2.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="rounded-[100px] bg-[#8B4049] border-2 border-solid border-[#2E2E2C30] shrink-0 size-2.5" />
                <div className="opacity-[0.4] rounded-[100px] bg-[#6B6B60] shrink-0 size-2.5" />
                <div className="opacity-[0.4] rounded-[100px] bg-[#9C9B90] shrink-0 size-2.5" />
                <div className="opacity-[0.4] rounded-[100px] bg-[#B5B2AB] shrink-0 size-2.5" />
                <div className="opacity-[0.4] rounded-[100px] bg-[#2E2E2C] shrink-0 size-2.5" />
                <div className="opacity-[0.4] rounded-[100px] bg-[#A3A39E] shrink-0 size-2.5" />
              </div>
            </div>
            <div className="flex flex-col grow shrink basis-[0%] gap-1.5">
              <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
                TEAM
              </div>
              <div className="flex items-center justify-between h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-solid border-[#2E2E2C14] shrink-0">
                <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  Engineering
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: '0.3' }}>
                  <path d="M3 5L6 8L9 5" stroke="#2E2E2C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col gap-0.5">
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Private project
              </div>
              <div className="inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-xs/4">
                Only visible to team members
              </div>
            </div>
            <div className="w-9 h-5 flex items-center justify-end rounded-[100px] bg-[#2E2E2C] shrink-0 p-0.5">
              <div className="rounded-[100px] bg-white shrink-0 size-4" />
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
              Create Project
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
