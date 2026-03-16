import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#ff3366] rounded-xl flex items-center justify-center font-bold text-lg">C</div>
          <span className="font-bold text-2xl tracking-tight text-white">CreatorFlow</span>
        </div>
        <SignUp routing="hash" />
      </div>
    </div>
  );
}
