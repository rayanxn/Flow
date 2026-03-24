/**
 * from Paper — v3 Delete Confirmation
 * Artboard ID: 5NB-0
 */
export default function V3DeleteConfirmation() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip items-center justify-center relative bg-[#F6F5F1] antialiased text-xs/4">
      <div className="absolute top-0 left-0 w-360 h-225 bg-[#2E2E2C73]" />
      <div className="w-105 flex flex-col items-center rounded-2xl pt-8 pb-6 gap-5 relative bg-white border border-solid border-[#2E2E2C14] [box-shadow:#2E2E2C2E_0px_24px_64px,#2E2E2C0F_0px_2px_8px] shrink-0 px-8">
        <div className="flex items-center justify-center rounded-[100px] bg-[#8B404918] shrink-0 size-10">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 5V10M9 12.5V13" stroke="#C45A3C" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="9" r="7.5" stroke="#C45A3C" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[17px]/5.5">
            Delete Issue?
          </div>
          <div className="text-center inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/5">
            This will permanently delete FLO-139 and all its activity. This action cannot be undone.
          </div>
        </div>
        <div className="flex items-center w-full pt-1 gap-2.5">
          <div className="flex items-center justify-center grow shrink basis-[0%] rounded-lg py-2.75 px-5 border border-solid border-[#2E2E2C14]">
            <div className="opacity-[0.5] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
              Cancel
            </div>
          </div>
          <div className="flex items-center justify-center grow shrink basis-[0%] rounded-lg py-2.75 px-5 bg-[#8B4049]">
            <div className="inline-block text-white font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
              Delete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
