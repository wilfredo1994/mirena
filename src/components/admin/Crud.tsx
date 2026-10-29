import { eliminar, guardar } from "@/app/admin/actions";
import { NEGOCIO } from "@/lib/config";
import ConfirmButton from "./ConfirmButton";
import ImagenInput from "./ImagenInput";

export type Campo = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "datetime" | "color" | "file" | "galeria";
  opciones?: { value: string; label: string }[];
  step?: string;
  requerido?: boolean;
};

type Fila = { id: string } & Record<string, unknown>;

function valor(f: Campo, fila?: Fila) {
  const v = fila?.[f.name];
  if (v == null) return f.type === "color" ? "#f8c8d4" : "";
  if (f.type === "datetime") return new Date(String(v)).toLocaleString("sv-SE", { timeZone: NEGOCIO.zona }).replace(" ", "T").slice(0, 16);
  return String(v);
}

function Formulario({ tabla, campos, fila }: { tabla: string; campos: Campo[]; fila?: Fila }) {
  return (
    <form action={guardar} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="tabla" value={tabla} />
      {fila && <input type="hidden" name="id" value={fila.id} />}
      {campos.map((f) => (
        <label key={f.name} className={`flex flex-col gap-1 font-bold ${f.type === "textarea" || f.type === "galeria" ? "sm:col-span-2" : ""} ${f.type === "checkbox" ? "flex-row items-center" : ""}`}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea name={f.name} className="input" rows={2} defaultValue={valor(f, fila)} />
          ) : f.type === "select" ? (
            <select name={f.name} className="input" defaultValue={valor(f, fila)}>
              <option value="">— Ninguna —</option>
              {f.opciones?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : f.type === "checkbox" ? (
            <input type="checkbox" name={f.name} className="h-6 w-6 accent-fucsia" defaultChecked={fila ? Boolean(fila[f.name]) : true} />
          ) : f.type === "file" ? (
            <ImagenInput name={f.name} />
          ) : f.type === "galeria" ? (
            <>
              {Array.isArray(fila?.[f.name]) && (fila![f.name] as string[]).length > 0 && (
                <ul className="flex flex-wrap gap-3 font-normal">
                  {(fila![f.name] as string[]).map((url) => (
                    <li key={url} className="flex flex-col items-center gap-1 text-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <span className="flex items-center gap-1">
                        <input type="checkbox" name="quitar" value={url} className="h-4 w-4 accent-fucsia" /> Quitar
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <ImagenInput name={f.name} multiple />
            </>
          ) : (
            <input
              name={f.name}
              className="input"
              type={f.type === "datetime" ? "datetime-local" : f.type === "number" ? "number" : f.type}
              step={f.step ?? (f.type === "number" ? "1" : undefined)}
              min={f.type === "number" ? 0 : undefined}
              required={f.requerido}
              defaultValue={valor(f, fila)}
            />
          )}
        </label>
      ))}
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button className="btn">{fila ? "Guardar cambios" : "Agregar"}</button>
        {fila && (
          <ConfirmButton action={eliminar} mensaje="¿Eliminar este elemento? No se puede deshacer.">
            🗑 Eliminar
          </ConfirmButton>
        )}
      </div>
    </form>
  );
}

export default function Crud({
  tabla,
  campos,
  filas,
  titulo,
  resumen,
}: {
  tabla: string;
  campos: Campo[];
  filas: Fila[];
  titulo: string;
  resumen: (f: Fila) => React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <details className="card" open={filas.length === 0}>
        <summary className="cursor-pointer font-display text-xl font-semibold">+ Agregar {titulo}</summary>
        <div className="mt-4">
          <Formulario tabla={tabla} campos={campos} />
        </div>
      </details>
      {filas.map((f) => (
        <details key={f.id} className="card">
          <summary className="cursor-pointer text-lg font-bold">{resumen(f)}</summary>
          <div className="mt-4">
            <Formulario tabla={tabla} campos={campos} fila={f} />
          </div>
        </details>
      ))}
    </div>
  );
}
