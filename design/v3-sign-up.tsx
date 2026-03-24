/**
 * from Paper — v3 Sign Up
 * Artboard ID: 5RA-0
 */
export default function V3SignUp() {
  return (
    <div className="[font-synthesis:none] flex overflow-clip items-center justify-center bg-[#F6F5F1] antialiased text-xs/4">
      <div className="w-100 flex flex-col items-center gap-8 shrink-0">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-lg bg-[#2E2E2C] shrink-0 size-8">
              <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-Bold','Space_Grotesk',system-ui,sans-serif] font-bold text-[15px]/4.5">
                F
              </div>
            </div>
            <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[17px]/5">
              Flowboard
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[26px]/8">
              Create your account
            </div>
            <div className="inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/5">
              Start managing projects in minutes
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              FULL NAME
            </div>
            <div className="flex items-center h-12 rounded-[10px] px-4 bg-white border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                Your full name
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              EMAIL
            </div>
            <div className="flex items-center h-12 rounded-[10px] px-4 bg-white border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                you@company.com
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="tracking-[0.08em] opacity-[0.6] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] font-medium text-[10px]/3">
              PASSWORD
            </div>
            <div className="flex items-center h-12 rounded-[10px] px-4 bg-white border border-solid border-[#2E2E2C14] shrink-0">
              <div className="opacity-[0.25] inline-block text-[#2E2E2C] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-sm/4.5">
                8+ characters
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-5">
          <div className="flex items-center justify-center w-full h-12 rounded-[10px] bg-[#2E2E2C] shrink-0">
            <div className="inline-block text-[#F6F5F1] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-sm/4.5">
              Create Account
            </div>
          </div>
          <div className="flex items-center w-full gap-4">
            <div className="grow shrink basis-[0%] h-px bg-[#2E2E2C0F]" />
            <div className="opacity-[0.5] inline-block text-[#A3A39E] font-['JetBrains_Mono',system-ui,sans-serif] text-[10px]/3">
              OR
            </div>
            <div className="grow shrink basis-[0%] h-px bg-[#2E2E2C0F]" />
          </div>
          <div className="flex w-full gap-2.5">
            <div className="flex items-center justify-center grow shrink basis-[0%] h-11 rounded-[10px] gap-2.5 bg-white border border-solid border-[#2E2E2C14]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14.537 8.183c0-.57-.052-1.118-.148-1.644H8.18v3.108h3.565a3.048 3.048 0 01-1.322 2v1.664h2.14c1.253-1.153 1.975-2.852 1.975-5.128z" fill="#4285F4" />
                <path d="M8.18 15.2c1.79 0 3.29-.594 4.387-1.609l-2.14-1.664c-.594.398-1.354.633-2.246.633-1.728 0-3.19-1.167-3.712-2.735H2.258v1.717A6.619 6.619 0 008.18 15.2z" fill="#34A853" />
                <path d="M4.47 9.825a3.98 3.98 0 01-.208-1.26c0-.437.075-.862.207-1.26V5.588H2.258A6.619 6.619 0 001.56 8.565c0 1.069.256 2.08.698 2.977l2.21-1.717z" fill="#FBBC05" />
                <path d="M8.18 3.57c.974 0 1.849.335 2.536.993l1.902-1.901C11.465 1.573 9.965.93 8.18.93a6.619 6.619 0 00-5.923 3.658l2.21 1.717c.523-1.568 1.985-2.735 3.713-2.735z" fill="#EA4335" />
              </svg>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                Google
              </div>
            </div>
            <div className="flex items-center justify-center grow shrink basis-[0%] h-11 rounded-[10px] gap-2.5 bg-white border border-solid border-[#2E2E2C14]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#2E2E2C">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 .5C3.86.5.5 3.86.5 8c0 3.31 2.15 6.12 5.13 7.11.38.07.51-.16.51-.36 0-.18-.01-.78-.01-1.42-2.09.45-2.53-1.01-2.53-1.01-.34-.87-.83-1.1-.83-1.1-.68-.46.05-.45.05-.45.75.05 1.15.77 1.15.77.67 1.14 1.75.81 2.18.62.07-.48.26-.81.47-.99-1.67-.19-3.42-.83-3.42-3.71 0-.82.29-1.49.77-2.01-.08-.19-.33-.95.07-1.98 0 0 .63-.2 2.06.77a7.17 7.17 0 013.76 0c1.43-.97 2.06-.77 2.06-.77.4 1.03.15 1.79.07 1.98.48.53.77 1.2.77 2.01 0 2.89-1.76 3.52-3.43 3.71.27.23.51.69.51 1.39 0 1 0 1.81-.01 2.06 0 .2.14.43.52.36A7.51 7.51 0 0015.5 8C15.5 3.86 12.14.5 8 .5z" />
              </svg>
              <div className="inline-block text-[#2E2E2C] font-['SpaceGrotesk-Medium','Space_Grotesk',system-ui,sans-serif] font-medium text-[13px]/4">
                GitHub
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="inline-block text-[#A3A39E] font-['SpaceGrotesk-Regular','Space_Grotesk',system-ui,sans-serif] text-[13px]/4">
            Already have an account?
          </div>
          <div className="inline-block [white-space-collapse:preserve] text-wrap text-[#2E2E2C] font-['SpaceGrotesk-SemiBold','Space_Grotesk',system-ui,sans-serif] font-semibold text-[13px]/4">
            Sign in
          </div>
        </div>
      </div>
    </div>
  );
}
