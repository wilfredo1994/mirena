"use client";

import { useActionState } from "react";
import { ingresar } from "../actions";

export default function LoginForm() {
  const [error, accion, pendiente] = useActionState(ingresar, "");
  return (
    <form action={accion} className="flex w-full flex-col gap-4 rounded-3xl bg-white p-8 sombra">
      <div>
        <p className="font-script text-4xl">bienvenida</p>
        <h1 className="text-3xl">Ingreso del administrador</h1>
      </div>
      <label className="flex flex-col gap-1 font-medium">
        Correo
        <input name="email" type="email" required autoComplete="email" className="input" />
      </label>
      <label className="flex flex-col gap-1 font-medium">
        Contraseña
        <input name="password" type="password" required autoComplete="current-password" className="input" />
      </label>
      {error && <p role="alert" className="font-semibold">⚠ {error}</p>}
      <button className="btn" disabled={pendiente}>{pendiente ? "Ingresando…" : "Ingresar"}</button>
    </form>
  );
}
