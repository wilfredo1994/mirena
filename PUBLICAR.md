# Cómo publicar Mirena en Cloudflare

Mirena se ejecuta en **Cloudflare Workers** (con la red de Cloudflare delante) y guarda sus datos en tu proyecto de **Supabase**.
La cuenta gratis alcanza: la aplicación pesa 1,6 MiB comprimida (el límite gratis es 3 MiB) y se permiten 100.000 visitas por día.

## 1. Antes de publicar (una sola vez)

En Supabase > *SQL Editor*, ejecuta estos archivos de la carpeta `supabase/` **si aún no lo hiciste**:

1. `migracion-reservas.sql` (reserva de stock al pedir). Solo una vez.
2. `migracion-producto.sql` (fotos extra, medidas y materiales).

## 2. Subir el código a GitHub

1. Crea una cuenta en github.com y un repositorio **privado** llamado `mirena` (sin README).
2. En la terminal, dentro de la carpeta del proyecto:

```
git init
git add .
git commit -m "Mirena"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mirena.git
git push -u origin main
```

> Tus claves (`.env.local`, `.env.production.local`) **no se suben**: ya están excluidas.

## 3. Conectar GitHub con Cloudflare

1. En dash.cloudflare.com entra a **Workers & Pages > Create application**.
2. Elige **Import a repository** (o "Connect to Git"), autoriza GitHub y selecciona `mirena`.
3. Completa así:
   - **Project name**: `mirena` (debe llamarse igual que el `name` de `wrangler.jsonc`).
   - **Build command**: `npx opennextjs-cloudflare build`
   - **Deploy command**: `npx wrangler deploy`
4. Antes de guardar, abre **Variables and secrets** (de la compilación) y agrega:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | la de Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | la clave publishable de Supabase |
| `NEXT_PUBLIC_WHATSAPP` | número con código de país, sin `+` |
| `NEXT_PUBLIC_SITE_URL` | la dirección final (ej. `https://mirena.pe`, o la de workers.dev una vez creada) |
| `NODE_VERSION` | `22` |

5. Pulsa **Save and Deploy**. En unos minutos tendrás una dirección como `https://mirena.TU-USUARIO.workers.dev`.

> Las variables `NEXT_PUBLIC_…` se necesitan **al compilar**, por eso van en la sección de compilación.

Los secretos del correo de avisos (opcionales) van en *Workers & Pages > mirena > Settings > Variables and secrets*: `RESEND_API_KEY` y `NOTIFY_EMAIL`.

Desde ahora, **cada `git push` publica la nueva versión automáticamente**.

### Alternativa: publicar con un comando, sin GitHub

1. `npx wrangler login` (una sola vez).
2. Crea `.env.production.local` con `NEXT_PUBLIC_SITE_URL=https://TU-DIRECCION`.
3. `npx wrangler secret put RESEND_API_KEY` y `npx wrangler secret put NOTIFY_EMAIL` (opcionales).
4. `npm run deploy`.

Para probarlo antes en el entorno de Cloudflare sin publicar: `npm run preview`.

## 4. Permitir el ingreso al panel

En Supabase > *Authentication > URL Configuration*:

- **Site URL**: la dirección de tu tienda.
- **Redirect URLs**: agrega la misma dirección.

## 5. Dominio propio (opcional, recomendado)

1. Agrega tu dominio a Cloudflare (*Add a domain*) y cambia los nameservers en donde lo compraste.
2. En *Workers & Pages > mirena > Settings > Domains & Routes* pulsa **Add > Custom domain** y escribe tu dominio.
3. Cambia la variable `NEXT_PUBLIC_SITE_URL` (en las variables de compilación de Cloudflare) por el dominio final y vuelve a desplegar (*Deployments > Retry*, o un nuevo `git push`).

## 6. Aviso de pedidos nuevos por correo (opcional)

1. Crea una cuenta gratis en resend.com y genera una **API Key**.
2. En Cloudflare, *Settings > Variables and secrets*, agrega `RESEND_API_KEY` (tu clave) y `NOTIFY_EMAIL` (tu correo; varios separados por coma).
3. Con la cuenta gratis de Resend, solo envía al correo con el que te registraste. Para otros destinatarios, verifica tu dominio en Resend y agrega la variable `NOTIFY_FROM`.

Además, dentro del panel el menú **Pedidos** muestra un contador con los pendientes y se actualiza solo cada 30 segundos.

## 7. Revisión final

- [ ] Abre la tienda desde el celular y haz un pedido de prueba (luego cancélalo en el panel).
- [ ] Entra a `/admin` e inicia sesión.
- [ ] Sube la foto de un producto desde el panel.
- [ ] Reemplaza el producto "Prueba" y la campaña "Prueba" por los reales.
- [ ] Revisa `https://TU-DOMINIO/sitemap.xml` (debe listar tus productos).
- [ ] Registra la tienda en Google Search Console para que te encuentren.

## Cambios posteriores

Haz `git add .`, `git commit -m "descripción"` y `git push`. Cloudflare publica la nueva versión solo.
