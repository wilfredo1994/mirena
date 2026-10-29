import CartView from "./CartView";

export const metadata = { title: "Tu carrito | Mirena" };

export default function Carrito() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-4xl">Tu carrito</h1>
      <CartView />
    </div>
  );
}
