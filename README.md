# epayco_app_frontend

Este repositorio contiene el frontend (client) de la prueba técnica de ePayco. Esta aplicación está hecha con Vite + React + TypeScript y se comunica con un backend REST (Node/Express) que debes ejecutar primero para que el frontend funcione correctamente.

IMPORTANTE: el backend está en https://github.com/juancodev/epayco_app_backend — clona y levanta el backend antes de correr este frontend.

**Contenido rápido**
- **Stack:** Vite, React, TypeScript, Axios
- **Backend requerido:** [epayco_app_backend](https://github.com/juancodev/epayco_app_backend)

**Requisitos**
- Node.js >= 18 (recomendado)
- npm o pnpm/yarn
- Git

**Pasos para ejecutar (desarrolladores)**

1) Clona el backend y levántalo (obligatorio)

```bash
# clona el backend
git clone https://github.com/juancodev/epayco_app_backend.git
cd epayco_app_backend
# sigue las instrucciones del README del backend: instala deps y configura .env
# por ejemplo (ver README del backend):
npm install
# crear .env con las variables necesarias y luego
npm run dev
```

2) Clona este repositorio (frontend)

```bash
git clone <tu-fork-o-repo-del-frontend> epayco_app_frontend
cd epayco_app_frontend
```

3) Configura variables de entorno para el frontend

Este proyecto usa `import.meta.env.VITE_API_URL` para apuntar al backend. Crea un archivo `.env` en la raíz del frontend con la variable `VITE_API_URL`. Ejemplo:

```env
# .env (ejemplo)
VITE_API_URL=http://localhost:3000/api
```

Asegúrate de que la URL coincida con la expuesta por el backend que ejecutaste (puede variar según configuración del backend).

4) Instala dependencias y arranca el frontend

```bash
npm install
npm run dev
```

La app quedará disponible típicamente en `http://localhost:5173` (Vite te mostrará la URL).

**Rutas principales / Endpoints usados**
- `POST /clients/registroCliente` — registrar cliente
- `POST /wallet/recargarBilletera` — recargar saldo
- `POST /wallet/solicitarPago` — crear solicitud de pago (envía token por email)
- `POST /wallet/confirmarPago` — confirmar pago (con `sessionId` + `token`)
- `GET /wallet/consultarSaldo?documento=...&celular=...` — consultar saldo

Estos endpoints provienen del backend; revisa su README para detalles adicionales sobre cuerpos, validaciones y respuestas.

**Mensajes de error y manejo (para QA / reviewers)**
El frontend ahora usa respuestas normalizadas del API con la forma:

```json
{
  "success": false,
  "message": "Mensaje amigable para el usuario",
  "error": "CODIGO_ERROR_OPCIONAL",
  "data": { /* opcional */ }
}
```

Mensajes comunes que verás y que están pensados para mostrar en UI:
- "El documento es requerido." (MISSING_DOCUMENTO)
- "El celular es requerido." (MISSING_CELULAR)
- "Email inválido." (INVALID_EMAIL)
- "El valor a recargar debe ser mayor a cero." (INVALID_AMOUNT)
- "Cliente no encontrado." (mensaje delegable desde backend)
- "Error de red, por favor inténtalo de nuevo." (NETWORK_ERROR)

Revisa `src/api/epayco_backend.ts` para ver la validación y manejo de errores implementado.

**Cómo probar flujos manualmente (sugerido para reviewers)**
1. Registrar cliente: rellenar datos en la UI o usar Postman/Insomnia con `POST /clients/registroCliente`.
2. Recargar saldo: `POST /wallet/recargarBilletera` → comprobar que `saldoActual` cambia.
3. Solicitar pago: `POST /wallet/solicitarPago` → recibir `sessionId` en la respuesta y token por correo (según backend).
4. Confirmar pago: `POST /wallet/confirmarPago` con `sessionId` + `token`.
5. Consultar saldo: `GET /wallet/consultarSaldo?documento=...`.

**Notas para integradores / reviewers**
- Asegúrate primero de que el backend esté corriendo y que `VITE_API_URL` apunte exactamente a la URL del backend.
- Si el backend devuelve mensajes de error personalizados, el frontend mostrará `response.message`; para lógica extra, puedes usar `response.error`.
- Para producción, ajusta la variable `VITE_API_URL` en el entorno de despliegue.

**Contribuir / desarrollo**
- Fork, crea feature branches y PRs. Ser claro en el título y descripción sobre qué cambio aporta la PR.
- Tests: actualmente no hay test automatizados incluidos; se pueden añadir en próximas iteraciones.

**Contacto / Autor**
- Repositorio backend usado: https://github.com/juancodev/epayco_app_backend
- Autor frontend: juancodev (o quien lo envíe como PR)

---

Si quieres, puedo añadir en la raíz un archivo `.env.example`, o actualizar las vistas (`src/components`/`views`) para mostrar ejemplos de manejo de errores en pantalla. ¿Cuál prefieres que haga ahora?: 1) crear `.env.example`, 2) ejemplo en `BalanceView.tsx` para mostrar errores, 3) ambos.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
