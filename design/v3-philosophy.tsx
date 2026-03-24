/**
 * from Paper — v3 Philosophy
 * Artboard ID: 4GN-0
 */
export default function V3Philosophy() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip w-360 h-160 flex-col items-center justify-center bg-[#1D1D1B] antialiased text-xs/4 p-20">
      <div className="flex flex-col items-center gap-2">
        <div className="tracking-[-0.01em] text-center inline-block text-[#FFFFFF33] font-['Instrument_Serif',system-ui,sans-serif] italic text-[42px]/13">
          Work should not disappear into status meetings.
        </div>
        <div className="tracking-[-0.03em] text-center inline-block text-white font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[52px]/15">
          It should move in plain sight.
        </div>
      </div>
      <div className="flex flex-col items-center pt-10 gap-4">
        <div className="w-8 h-0.5 rounded-[100px] bg-[#2E2E2C] shrink-0" />
        <div className="tracking-[0.12em] inline-block text-[#FFFFFF40] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
          THE FLOWBOARD MANIFESTO
        </div>
      </div>
    </div>
  );
}
