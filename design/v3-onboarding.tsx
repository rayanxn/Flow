/**
 * from Paper — v3 Onboarding
 * Artboard ID: 5RB-0
 */
export default function V3Onboarding() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip w-360 h-225 flex-col items-center pt-15 bg-[#F6F5F1] antialiased text-xs/4">
      <div className="flex items-center justify-between w-full px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-[#2E2E2C] shrink-0">
            <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-sm/4.5">
              F
            </div>
          </div>
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[15px]/4.5">
            Flowboard
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-1 rounded-[100px] bg-[#2E2E2C] shrink-0" />
          <div className="w-7 h-1 rounded-[100px] bg-[#2E2E2C14] shrink-0" />
          <div className="w-7 h-1 rounded-[100px] bg-[#2E2E2C14] shrink-0" />
        </div>
        <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[11px]/3.5">
          STEP 1 OF 3
        </div>
      </div>
      <div className="flex flex-col items-center w-120 pt-10 gap-10">
        <div className="flex flex-col items-center gap-2">
          <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[28px]/8.5">
            Set up your workspace
          </div>
          <div className="inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/5">
            This is where your team will plan, track, and ship.
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              WORKSPACE NAME
            </div>
            <div className="flex items-center h-12 rounded-[10px] px-4 bg-white border border-solid border-[#2E2E2C14] shrink-0">
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-sm/4.5">
                Acme Inc
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              WORKSPACE URL
            </div>
            <div className="flex items-center h-12 rounded-[10px] px-4 bg-white border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.4] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[13px]/4">
                flowboard.app/
              </div>
              <div className="inline-block text-[#2E2E2C] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[13px]/4">
                acme-inc
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              TEAM SIZE
            </div>
            <div className="flex gap-2">
              <div className="flex items-center justify-center grow shrink basis-[0%] h-11 rounded-[10px] bg-white border border-solid border-[#2E2E2C14]">
                <div className="opacity-[0.4] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  1 – 5
                </div>
              </div>
              <div className="flex items-center justify-center grow shrink basis-[0%] h-11 rounded-[10px] bg-[#B5654A0A] border-2 border-solid border-[#B5654A]">
                <div className="inline-block text-[#B5654A] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
                  6 – 20
                </div>
              </div>
              <div className="flex items-center justify-center grow shrink basis-[0%] h-11 rounded-[10px] bg-white border border-solid border-[#2E2E2C14]">
                <div className="opacity-[0.4] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                  20+
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-4">
          <div className="flex items-center justify-center w-full h-12 rounded-[10px] bg-[#2E2E2C] shrink-0">
            <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              Continue
            </div>
          </div>
          <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
            Skip for now
          </div>
        </div>
      </div>
    </div>
  );
}
