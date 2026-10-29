import Image from "next/image";
import { Manchas } from "@/components/Decor";
import LoginForm from "./LoginForm";

export const metadata = { title: "Ingresar | Mirena" };

export default function Login() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-rosa p-6">
      <Manchas />
      <div className="relative flex w-full max-w-md flex-col items-center gap-5">
        <Image src="/logo.png" alt="Mirena, pasión por el arte" width={120} height={120} className="h-28 w-28 rounded-full object-cover shadow-xl" />
        <LoginForm />
      </div>
    </main>
  );
}
