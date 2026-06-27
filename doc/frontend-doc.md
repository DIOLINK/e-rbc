# Documentación del Frontend — e-rbc SPA

> **Última actualización:** 2026-06-27  
> **Stack:** React 19 + TypeScript + React Router + Tailwind CSS 4  
> **Build tool:** Vite 8  
> **Package manager:** pnpm  

---

## 1. ¿Qué es esta aplicación?

Una **SPA (Single Page Application)** para gestionar **productos** (bebidas y comidas) y **pedidos**. Consume la API REST del backend (`/api/productos` y `/api/pedidos`).

Navega entre páginas **sin recargar el navegador** — React Router maneja todas las rutas del lado del cliente.

---

## 2. Stack tecnológico explicado

| Herramienta | ¿Para qué sirve? |
|---|---|
| **React 19** | Librería para construir interfaces de usuario con componentes |
| **TypeScript** | JavaScript con tipos. Evita errores antes de ejecutar el código |
| **React Router DOM** | Maneja la navegación entre páginas dentro de la SPA |
| **Tailwind CSS 4** | Framework CSS. Estilizas con clases utilitarias directamente en el HTML (ej: `bg-blue-600`, `rounded-lg`) |
| **Vite** | Servidor de desarrollo ultrarrápido + empaquetador para producción |
| **pnpm** | Gestor de paquetes (alternativa más rápida a npm/yarn) |
| **fetch (nativo)** | API del navegador para hacer peticiones HTTP. No usamos axios — es una dependencia menos |

---

## 3. ¿Cómo correr el proyecto?

```bash
# Entrar al directorio
cd frontend/

# Instalar dependencias (solo la primera vez)
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Abrir en el navegador
# http://localhost:5173
```

El servidor de desarrollo usa el **proxy de Vite** configurado en `vite.config.ts` para redirigir `/api/*` al backend en `http://localhost:8080`. Así no tienes problemas de CORS.

---

## 4. Estructura del proyecto

```
src/
├── main.tsx                         # Punto de entrada — monta React en el DOM
├── App.tsx                          # Componente raíz: envuelve todo en Providers + Router
├── index.css                        # Importa Tailwind
│
├── types/                           # 📦 MODELOS — Interfaces TypeScript (datos)
│   ├── producto.ts                  #   Tipo de dato "Producto", "ProductoRequest"
│   ├── pedido.ts                    #   Tipo de dato "Pedido", "LineaPedido"
│   └── api.ts                       #   Tipo de dato "ApiError"
│
├── services/                        # 🌐 CONEXIÓN AL BACKEND
│   ├── config/
│   │   ├── api-config.ts            #   URL base, timeout, headers por defecto
│   │   └── api-client.ts            #   CLASE BASE — fetch wrapper con interceptores
│   └── modules/
│       ├── producto.service.ts      #   ProductoService (hereda de ApiClient)
│       └── pedido.service.ts        #   PedidoService (hereda de ApiClient)
│
├── hooks/                           # 🎣 CUSTOM HOOKS — Lógica de negocio
│   ├── useProductos.ts              #   CRUD de productos + filtros
│   ├── usePedidos.ts               #   CRUD de pedidos
│   ├── useProductoForm.ts           #   Estado y validación de formulario producto
│   ├── usePedidoForm.ts            #   Estado y validación de formulario pedido
│   └── useDebounce.ts              #   Retrasa búsquedas (evita llamadas en cada tecla)
│
├── contexts/                        # 🗄️ ESTADO GLOBAL (React Context + useReducer)
│   ├── ProductoContext.tsx          #   Lista de productos compartida entre páginas
│   └── PedidoContext.tsx           #   Lista de pedidos compartida entre páginas
│
├── controllers/                     # 🎮 CONTROLADORES — Lógica de página (MVC)
│   ├── ProductosController.tsx      #   Orquesta: hook + context + modales + navegación
│   ├── ProductoDetalleController.tsx
│   ├── PedidosController.tsx
│   ├── NuevoPedidoController.tsx
│   └── PedidoDetalleController.tsx
│
├── pages/                           # 📄 VISTAS — Componentes por ruta (solo renderizan)
│   ├── ProductosPage.tsx            #   <ProductosController />
│   ├── ProductoDetallePage.tsx
│   ├── PedidosPage.tsx
│   ├── NuevoPedidoPage.tsx
│   ├── PedidoDetallePage.tsx
│   └── NotFoundPage.tsx
│
├── routes/
│   └── AppRouter.tsx               #   Definición de rutas con React Router
│
├── components/                      # 🧩 ATOMIC DESIGN
│   ├── atoms/                       #   Unidad mínima (1 solo propósito)
│   │   ├── Button.tsx               #     Botón reutilizable
│   │   ├── Input.tsx                #     Campo de texto
│   │   ├── Badge.tsx                #     Etiqueta BEBIDA/COMIDA
│   │   ├── Spinner.tsx              #     Indicador de carga
│   │   ├── Alert.tsx                #     Mensaje de error/éxito
│   │   └── Select.tsx               #     Dropdown
│   ├── molecules/                   #   Composición de 2+ atoms
│   │   ├── ProductCard.tsx          #     Tarjeta de producto
│   │   ├── ProductForm.tsx          #     Formulario crear/editar producto
│   │   ├── SearchBar.tsx            #     Búsqueda + filtro por tipo
│   │   ├── ConfirmDialog.tsx        #     Modal "¿Estás seguro?"
│   │   ├── EmptyState.tsx           #     Estado vacío (sin datos)
│   │   ├── LineaPedidoInput.tsx     #     Select producto + cantidad
│   │   └── OrderLineItem.tsx        #     Fila de línea de pedido
│   ├── organisms/                   #   Secciones complejas (múltiples molecules)
│   │   ├── ProductList.tsx          #     Grid de tarjetas + búsqueda
│   │   ├── OrderForm.tsx            #     Formulario completo de pedido
│   │   ├── OrderTable.tsx           #     Tabla de pedidos
│   │   ├── OrderDetail.tsx          #     Detalle de un pedido
│   │   ├── Navbar.tsx               #     Barra de navegación
│   │   └── PageHeader.tsx           #     Encabezado con título
│   └── templates/                   #   Layout de página
│       └── MainLayout.tsx           #     Navbar + contenido
│
└── utils/                           # 🛠️ UTILITARIOS
    ├── format.ts                    #   Formateo de moneda ($1.234)
    └── validators.ts               #   Funciones de validación
```

---

## 5. ¿Cómo fluyen los datos?

### Ejemplo concreto: **Crear un producto**

```
1. Usuario escribe datos en el formulario (ProductForm molecule)
         │
         ▼
2. ProductForm usa useProductoForm hook → maneja el estado local del formulario
         │  (nombre, precio, stock, tipo)
         │  (validación: ¿nombre vacío? ¿precio > 0?)
         ▼
3. Usuario hace clic en "Crear" → ProductosController.handleCreate()
         │
         ▼
4. Controller llama a crearProducto(data) del hook useProductos
         │
         ▼
5. Hook llama a productoService.create(data)
         │
         ▼
6. ProductoService (herencia de ApiClient) ejecuta:
      this.post('/productos', data)
         │
         ▼
7. ApiClient (clase base) ejecuta:
      fetch('/api/productos', { method: 'POST', body: JSON.stringify(data) })
         │  ┌─ Request interceptor: agrega headers (Content-Type: application/json)
         │  └─ AbortController: timeout de 10 segundos
         ▼
8. El proxy de Vite reenvía la petición a → http://localhost:8080/api/productos
         │
         ▼
9. Backend (Spring Boot) procesa → INSERT en MySQL → responde 201 + JSON
         │
         ▼
10. ApiClient recibe la respuesta:
      ┌─ Response interceptor: ¿response.ok?
      │   ├─ SÍ → response.json() → devuelve el Producto
      │   └─ NO  → extrae el error del body, lanza ApiError { status, message }
      └─ Si hay error de red (TypeError) → lanza error amigable
         │
         ▼
11. Hook useProductos recibe el Producto → dispatch({ type: 'CREATE_SUCCESS', payload })
         │
         ▼
12. ProductoContext (useReducer) actualiza el estado global:
      productos: [...prev, nuevoProducto]
         │
         ▼
13. React re-renderiza ProductList → el nuevo ProductCard aparece en pantalla
```

### ¿Qué pasa si falla?

```
fetch falla (red, timeout, error 400/404/500)
    │
    ▼
ApiClient.applyErrorInterceptor(error)
    │  Normaliza el error a { status, error, message, details, timestamp }
    │  Ej: { status: 400, message: "Stock insuficiente para Coca-Cola. Disponible: 5, Solicitado: 10" }
    ▼
Hook captura el error → NO hace dispatch → retorna el error al Controller
    │
    ▼
Controller muestra un Alert (atom) con el mensaje de error
```

---

## 6. Navegación (rutas)

| Ruta | Página | ¿Qué hace? |
|---|---|---|
| `/` | → redirige a `/productos` | Página inicial |
| `/productos` | `ProductosPage` | Lista, busca, filtra, crea, edita, elimina productos |
| `/productos/:id` | `ProductoDetallePage` | Ver detalle y editar un producto específico |
| `/pedidos` | `PedidosPage` | Historial de pedidos |
| `/pedidos/nuevo` | `NuevoPedidoPage` | Formulario para crear un nuevo pedido |
| `/pedidos/:id` | `PedidoDetallePage` | Ver detalle de un pedido específico |
| `*` | `NotFoundPage` | Página 404 |

---

## 7. Atomic Design explicado

Este proyecto organiza los componentes visuales en 4 niveles:

```
TEMPLATES  ──── Layouts de página (Navbar + contenido)
    │
    └── ORGANISMS ──── Secciones complejas (ProductList, OrderTable)
            │
            └── MOLECULES ──── Combinación de atoms (ProductCard, ProductForm)
                    │
                    └── ATOMS ──── Unidad mínima (Button, Input, Badge)
```

**Regla de oro:** Un componente de nivel superior solo puede usar componentes de su mismo nivel o inferiores. Nunca al revés.

- Un **atom** NUNCA importa un molecule u organism.
- Un **molecule** puede importar atoms (y otros molecules si es necesario).
- Un **organism** puede importar molecules y atoms.
- Un **template** puede importar organisms, molecules y atoms.

---

## 8. Cómo agregar una nueva funcionalidad

Ejemplo: quieres agregar una página de "Categorías".

### Paso 1: Definir el tipo de dato

```typescript
// src/types/categoria.ts
export interface Categoria {
  id: number;
  nombre: string;
}
```

### Paso 2: Crear el servicio

```typescript
// src/services/modules/categoria.service.ts
import { ApiClient } from '../config/api-client.ts';

class CategoriaService extends ApiClient {
  async getAll() { return this.get<Categoria[]>('/categorias'); }
  async create(data: CategoriaRequest) { return this.post<Categoria>('/categorias', data); }
}

export const categoriaService = new CategoriaService();
```

### Paso 3: Crear el Context (estado global)

```typescript
// src/contexts/CategoriaContext.tsx
// (mismo patrón que ProductoContext — createContext + useReducer)
```

### Paso 4: Crear el custom hook

```typescript
// src/hooks/useCategorias.ts
export function useCategorias() {
  const { state, fetchAll, create } = useCategoriaContext();
  return { categorias: state.categorias, loading: state.loading, fetchAll, create };
}
```

### Paso 5: Crear componentes visuales (atoms → molecules → organisms)

Ya tienes Button, Input, etc. Solo necesitas molecules/organisms específicos.

### Paso 6: Crear Controller + Page

```typescript
// src/controllers/CategoriasController.tsx
// (usa useCategorias hook, maneja modales, errores, navegación)

// src/pages/CategoriasPage.tsx
export function CategoriasPage() { return <CategoriasController />; }
```

### Paso 7: Agregar la ruta

```typescript
// En src/routes/AppRouter.tsx
{
  path: 'categorias',
  element: <CategoriasPage />,
},
```

### Paso 8: Agregar link en el Navbar

```typescript
// En src/components/organisms/Navbar.tsx
{ to: '/categorias', label: 'Categorías' },
```

---

## 9. Servicios — Capa de conexión al backend

### ¿Qué es `ApiClient`?

Es una **clase base** que encapsula toda la lógica HTTP:

- **Crea la petición** con `fetch()` nativo del navegador
- **Agrega headers** por defecto (`Content-Type: application/json`)
- **Timeout**: si el backend no responde en 10 segundos, aborta la petición
- **Maneja errores**: normaliza cualquier error a un formato uniforme `{ status, message, details }`

### ¿Cómo heredan los servicios?

```typescript
class ProductoService extends ApiClient {
  async getAll(): Promise<Producto[]> {
    return this.get<Producto[]>('/productos');
    //     ^^^^^^ método heredado de ApiClient
  }
}
```

`this.get()`, `this.post()`, `this.put()`, `this.httpDelete()` son métodos **protegidos** de ApiClient. No necesitas preocuparte por:
- Armar la URL completa (ApiClient concatena baseUrl + path)
- Poner headers
- Parsear JSON
- Manejar errores HTTP

### ¿Qué pasa cuando hay un error?

El interceptor de respuesta en `ApiClient` detecta si `response.ok === false`:

| Status | ¿Qué devuelve al hook? |
|---|---|
| 400 | `{ status: 400, message: "Stock insuficiente..." }` |
| 404 | `{ status: 404, message: "Producto no encontrado con id: 99" }` |
| 500 | `{ status: 500, message: "Error interno del servidor" }` |
| Red caída | `{ status: 0, message: "No se pudo conectar con el servidor..." }` |

El hook captura este error y el Controller decide si mostrar un Alert o dejarlo pasar al Context.

---

## 10. Estado global (Context + useReducer)

### ¿Por qué Context en vez de Redux/Zustand?

Para una app de este tamaño, Context + useReducer es suficiente y nativo de React. No necesitas librerías externas.

### ¿Cómo funciona?

```
App.tsx
  └── <ProductoProvider>        ← envuelve toda la app
        └── <PedidoProvider>    ← envuelve toda la app
              └── <RouterProvider>
```

Cada Provider expone:
- **state**: los datos actuales (`productos[]`, `loading`, `error`)
- **dispatch**: función para enviar acciones al reducer
- **métodos**: `fetchAll()`, `create()`, `update()`, `remove()`

El **reducer** es una función pura que recibe el estado actual + una acción, y devuelve el nuevo estado:

```typescript
function productoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':    return { ...state, loading: true };
    case 'FETCH_SUCCESS':  return { productos: action.payload, loading: false };
    case 'CREATE_SUCCESS': return { ...state, productos: [...state.productos, action.payload] };
    // ...
  }
}
```

---

## 11. Convenciones del código

| Regla | Ejemplo |
|---|---|
| **Idioma** | Nombres en español (Producto, Pedido, Bebida) |
| **Archivos** | PascalCase para componentes (`ProductCard.tsx`), camelCase para hooks/utils (`useProductos.ts`) |
| **Imports** | Rutas relativas (`../../types`) |
| **Componentes** | `export function Componente() { ... }` (nombrados, no default exports excepto App) |
| **Interfaces** | PascalCase (`Producto`, `LineaPedido`) |
| **Tipos** | `type` para uniones (`TipoProducto`, `AlertVariant`), `interface` para objetos |
| **Props** | Interfaces con el nombre `ComponenteProps` |
| **Estados** | `useState` para UI local, Context para datos compartidos entre páginas |

---

## 12. Patrones aplicados (SOLID)

| Principio | Dónde se aplica |
|---|---|
| **S** — Single Responsibility | Cada archivo tiene 1 razón para cambiar. Atoms solo renderizan, hooks solo lógica, services solo HTTP |
| **O** — Open/Closed | ApiClient se extiende sin modificar. Componentes aceptan `className` y `children` |
| **L** — Liskov Substitution | Todo componente que extiende React.FC puede usarse donde se espera un componente React |
| **I** — Interface Segregation | Types pequeños: `Producto` ≠ `ProductoRequest`. Cada componente recibe solo las props que necesita |
| **D** — Dependency Inversion | Los hooks dependen del servicio (abstracción), no de `fetch` directamente. Puedes cambiar `fetch` por otra cosa sin tocar los hooks |

---

## 13. Debugging

### React DevTools
Instala la extensión **React Developer Tools** en tu navegador. Te permite:
- Ver el árbol de componentes
- Inspeccionar props y estado de cada componente
- Ver el Context actual

### Network tab
Abre DevTools (F12) → pestaña **Network**:
- Filtra por `Fetch/XHR`
- Ahí ves cada petición a `/api/productos`, `/api/pedidos`
- Puedes ver request payload, response, status codes

### Logs
El `ApiClient` ya tiene logs en desarrollo (cuando ejecutas `pnpm dev`):
```
[API] GET /api/productos
[API] POST /api/productos
```

---

## 14. Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo (http://localhost:5173)
pnpm build        # Compila para producción (carpeta dist/)
pnpm preview      # Previsualiza la build de producción
pnpm lint         # Ejecuta el linter (oxlint)
```

---

## 15. Preguntas frecuentes

### ¿Por qué no usamos axios?
Para reducir dependencias. `fetch` es nativo del navegador y nuestro `ApiClient` implementa todo lo que necesitamos (interceptores, timeout, normalización de errores).

### ¿Cómo cambio la URL del backend?
Edita `src/services/config/api-config.ts`:
```typescript
BASE_URL: 'http://mi-servidor:8080/api'
```
O configura la variable de entorno `VITE_API_BASE_URL` en un archivo `.env`.

### ¿Cómo agrego autenticación?
Agrega un interceptor en `ApiClient.setupInterceptors()` que lea un token de localStorage y lo agregue al header:
```typescript
const token = localStorage.getItem('token');
if (token) {
  reqConfig.headers.Authorization = `Bearer ${token}`;
}
```

### ¿Dónde se guarda el proxy config?
En `vite.config.ts` → `server.proxy`. Solo funciona en desarrollo (`pnpm dev`). En producción necesitas configurar el proxy en tu servidor web (nginx, apache).
