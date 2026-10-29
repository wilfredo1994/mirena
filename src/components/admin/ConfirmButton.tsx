"use client";

export default function ConfirmButton({
  action,
  children,
  mensaje,
}: {
  action: (form: FormData) => void | Promise<void>;
  children: React.ReactNode;
  mensaje: string;
}) {
  return (
    <button
      type="submit"
      formAction={action}
      formNoValidate
      className="btn-ghost"
      onClick={(e) => {
        if (!confirm(mensaje)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
