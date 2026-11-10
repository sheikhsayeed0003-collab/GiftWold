import { AuthForm } from "@/components/auth/AuthForm";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
      <AmbientBackground />
      <div className="relative w-full max-w-md">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
