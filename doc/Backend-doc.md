# Documentación del Backend — e-rbc API

> **Última actualización:** 2026-06-26  
> **Versión del proyecto:** 1.0.0  
> **Repositorio:** `backend/`  

---

## 1. Visión General

El backend es una **API REST** construida con **Spring Boot 3.4.5** y **Java 22** para la gestión de productos (bebidas y comidas) y pedidos del sistema e-rbc. Expone endpoints CRUD para productos y endpoints de creación/consulta para pedidos con validación de stock en tiempo real.

**Tecnologías clave:**

| Tecnología | Versión | Propósito |
|---|---|---|
| Java | 22 | Lenguaje de programación |
| Spring Boot | 3.4.5 | Framework principal |
| Spring Data JPA | 3.4.5 | Persistencia y repositorios |
| Spring Web | 3.4.5 | Controladores REST |
| Spring Validation | 3.4.5 | Validación de DTOs |
| Hibernate | 6.x (via Spring Boot) | ORM / JPA provider |
| MySQL | — | Base de datos relacional |
| Lombok | 1.18.38 | Reducción de boilerplate |
| SpringDoc OpenAPI | 2.8.5 | Documentación Swagger/OpenAPI |
| Maven | — | Build y gestión de dependencias |

---

## 2. Estructura del Proyecto

```
backend/
├── pom.xml                                          # Configuración Maven
├── .github/                                         # Templates de GitHub
├── .settings/ y .project                            # Configuración Eclipse
└── src/
    ├── main/
    │   ├── java/com/techlab/api/
    │   │   ├── TechlabApplication.java              # Punto de entrada Spring Boot
    │   │   ├── config/
    │   │   │   ├── DataInitializer.java             # Datos semilla al iniciar
    │   │   │   └── SpringDocConfig.java              # Configuración Swagger/OpenAPI
    │   │   ├── controller/
    │   │   │   ├── ProductoController.java          # Endpoints de productos
    │   │   │   └── PedidoController.java            # Endpoints de pedidos
    │   │   ├── dto/
    │   │   │   ├── ProductoRequest.java             # DTO entrada producto
    │   │   │   ├── ProductoResponse.java            # DTO salida producto
    │   │   │   ├── PedidoRequest.java               # DTO entrada pedido
    │   │   │   └── PedidoResponse.java              # DTO salida pedido
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java      # Manejador global de excepciones
    │   │   │   ├── ResourceNotFoundException.java   # Excepción 404
    │   │   │   └── StockInsuficienteException.java  # Excepción 400 (stock)
    │   │   ├── model/
    │   │   │   ├── Producto.java                    # Entidad abstracta base
    │   │   │   ├── Bebida.java                      # Entidad hija — discriminador BEBIDA
    │   │   │   ├── Comida.java                      # Entidad hija — discriminador COMIDA
    │   │   │   ├── Pedido.java                      # Entidad pedido
    │   │   │   └── LineaPedido.java                 # Entidad línea de pedido
    │   │   ├── repository/
    │   │   │   ├── ProductoRepository.java          # JPA Repository<Producto>
    │   │   │   └── PedidoRepository.java            # JPA Repository<Pedido>
    │   │   └── service/
    │   │       ├── IProductoService.java            # Interfaz servicio productos
    │   │       ├── IProductoServiceImpl.java         # Implementación servicio productos
    │   │       ├── IPedidoService.java              # Interfaz servicio pedidos
    │   │       └── PedidoServiceImpl.java           # Implementación servicio pedidos
    │   └── resources/
    │       └── application.properties               # Configuración de la aplicación
    └── test/
        └── java/com/techlab/api/
            └── TechlabApplicationTests.java         # Test de carga de contexto
```

---

## 3. Arquitectura en Capas

```
 ┌──────────────┐      ┌─────────────────┐      ┌────────────┐
 │  Controller  │ ───→ │  Service (I/F)  │ ───→ │ Repository │ ───→ DB (MySQL)
 │  (REST API)  │      │  ServiceImpl     │      │ (JPA)      │
 └──────────────┘      └─────────────────┘      └────────────┘
        │                                               │
   ProductoRequest                                 Producto (Entity)
   ProductoResponse                                Pedido (Entity)
   PedidoRequest                                   LineaPedido (Entity)
   PedidoResponse
```

- **Controller** — Recibe peticiones HTTP, valida con `@Valid`, delega al servicio.
- **Service** — Contiene la lógica de negocio (validación de stock, creación de entidades).
- **Repository** — Acceso a datos mediante Spring Data JPA (`JpaRepository`).
- **DTOs** — Separan el modelo de datos de la API. Los requests tienen validación Bean Validation.
- **Entities** — Mapean directamente a tablas de MySQL mediante JPA/Hibernate.

### 3.1. Flujo de una Petición (Ejemplo Concreto)

Para entender cómo viajan los datos desde que el cliente hace una llamada HTTP hasta que se persiste en MySQL, acá se traza el caso más completo: **crear un pedido**.

#### Request del cliente

```http
POST /api/pedidos
Content-Type: application/json

{
  "lineas": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 3, "cantidad": 1 }
  ]
}
```

#### Paso a paso

```
 ┌──────────────────────────────────────────────────────────────────┐
 │ 1. CONTROLLER — PedidoController.create()                      │
 │    @PostMapping → recibe el JSON como PedidoRequest             │
 │    @Valid activa Bean Validation:                              │
 │      • lineas no vacía                                          │
 │      • productoId no nulo                                       │
 │      • cantidad ≥ 1                                              │
 │    Delega a service.create(request)                             │
 └────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ 2. SERVICE — PedidoServiceImpl.create()   @Transactional        │
 │    (Todo dentro de una misma transacción; si algo falla,        │
 │     se revierte todo — rollback)                                │
 │                                                                  │
 │    Por cada línea del request:                                  │
 │    ┌──────────────────────────────────────────────────────────┐ │
 │    │ 2a. productoService.validarYReducirStock(id, cantidad)  │ │
 │    │     • Busca Producto por ID en el repository             │ │
 │    │     • ¿Existe? ─NO→ lanza ResourceNotFoundException     │ │
 │    │     • ¿cantidad ≤ stock? ─NO→ lanza StockInsuficiente   │ │
 │    │     • Descuenta stock: stock -= cantidad                 │ │
 │    │     • Guarda producto actualizado en BD                  │ │
 │    └──────────────────────────────────────────────────────────┘ │
 │    ┌──────────────────────────────────────────────────────────┐ │
 │    │ 2b. Crea LineaPedido                                     │ │
 │    │     • Asocia el Producto (ya con stock reducido)         │ │
 │    │     • Asocia al Pedido (bidireccional)                   │ │
 │    │     • Setea cantidadSolicitada                            │ │
 │    └──────────────────────────────────────────────────────────┘ │
 │                                                                  │
 │    pedidoRepository.save(pedido) → Hibernate INSERT en cascada  │
 │      • INSERT INTO pedidos ...                                   │
 │      • INSERT INTO lineas_pedido (pedido_id=1, producto_id=1)    │
 │      • INSERT INTO lineas_pedido (pedido_id=1, producto_id=3)    │
 │      • UPDATE producto SET cantidad_en_stock=...                 │
 └────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ 3. REPOSITORY — PedidoRepository                                │
 │    JpaRepository<Pedido, Long> → Spring Data genera el proxy    │
 │    automáticamente con todos los métodos CRUD.                  │
 │    Hibernate traduce las operaciones a SQL y las ejecuta        │
 │    contra MySQL usando una conexión del pool.                   │
 └────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ 4. MAPPER — PedidoMapper.toResponse(pedidoGuardado)             │
 │    Convierte la entidad JPA a un DTO de respuesta:              │
 │      • Calcula subtotal por línea (precio × cantidad)           │
 │      • Calcula total (suma de subtotales)                       │
 │      • Devuelve PedidoResponse listo para serializar a JSON     │
 └────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ 5. RESPONSE — Controller retorna 201 Created                    │
 │    {                                                            │
 │      "id": 1,                                                   │
 │      "lineas": [                                                │
 │        { "productoId": 1, "productoNombre": "Coca-Cola",        │
 │          "precioUnitario": 1000, "cantidad": 2, "subtotal": 2000 },│
 │        { "productoId": 3, "productoNombre": "Hamburguesa",      │
 │          "precioUnitario": 2000, "cantidad": 1, "subtotal": 2000 }│
 │      ],                                                         │
 │      "total": 4000                                              │
 │    }                                                            │
 └──────────────────────────────────────────────────────────────────┘
```

#### ¿Qué pasa si falla?

Si en el paso 2a algún producto no tiene stock suficiente, se lanza `StockInsuficienteException`. Como el método está anotado con `@Transactional`, **toda la operación se revierte** — no se descuenta el stock de los productos que sí tenían, no se crea el pedido, la base de datos queda exactamente como estaba antes de la llamada.

El `GlobalExceptionHandler` captura la excepción y devuelve:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Stock insuficiente para Coca-Cola. Disponible: 5, Solicitado: 10",
  "timestamp": "2026-06-27T10:30:00"
}
```

#### Para endpoints más simples (ej. GET /api/productos)

El flujo es más corto:

```
Controller → Service → Repository.findAll() → Hibernate: SELECT * FROM producto
                                                        │
           ProductoMapper.toResponse() ← Entity ←───────┘
                 │
                 ▼
           Response 200 + JSON
```

---

## 4. Base de Datos

### 4.1. Configuración

Archivo: `src/main/resources/application.properties`

```properties
spring.application.name=e-rbc-api
server.port=8080

spring.datasource.url=jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/${MYSQL_DATABASE:java_dev}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${MYSQL_USER:java_user}
spring.datasource.password=${MYSQL_PASSWORD:java_pass_456}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
```

**Variables de entorno disponibles:**

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `MYSQL_HOST` | `localhost` | Host de MySQL |
| `MYSQL_PORT` | `3306` | Puerto de MySQL |
| `MYSQL_DATABASE` | `java_dev` | Nombre de la base de datos |
| `MYSQL_USER` | `java_user` | Usuario de MySQL |
| `MYSQL_PASSWORD` | `java_pass_456` | Contraseña de MySQL |

> ⚠️ **Importante:** `ddl-auto=update` hace que Hibernate cree/actualice las tablas automáticamente. **No usar en producción** — usar `validate` o `none`.

### 4.2. Modelo Entidad-Relación

```
┌───────────────────────┐         ┌─────────────────────────────┐
│       producto        │         │          pedidos            │
├───────────────────────┤         ├─────────────────────────────┤
│ id (PK, BIGINT)       │         │ id (PK, BIGINT)             │
│ nombre (VARCHAR)      │         └─────────────────────────────┘
│ precio (DOUBLE)       │                      │
│ cantidad_en_stock (INT)│                      │ 1:N
│ tipo (VARCHAR)         │                      │
│   discriminador:       │         ┌─────────────────────────────┐
│   "BEBIDA" o "COMIDA"  │         │      lineas_pedido          │
└───────────────────────┘         ├─────────────────────────────┤
              │                    │ id (PK, BIGINT)             │
              │ N:1                │ pedido_id (FK, BIGINT)      │
              │                    │ producto_id (FK, BIGINT)    │
              └────────────────────│ cantidad_solicitada (INT)   │
                                  └─────────────────────────────┘
```

**Herencia SINGLE_TABLE:**
La tabla `producto` almacena tanto `Bebida` como `Comida` con una columna discriminadora `tipo`. Ambas subclases no agregan campos adicionales más allá de los definidos en `Producto`.

### 4.3. Datos Semilla

La clase `DataInitializer` inserta automáticamente estos productos si la tabla está vacía:

| ID | Nombre | Tipo | Precio | Stock |
|----|--------|------|--------|-------|
| 1 | Coca-Cola | BEBIDA | 1000 | 10 |
| 2 | Sprite | BEBIDA | 900 | 15 |
| 3 | Hamburguesa | COMIDA | 2000 | 5 |
| 4 | Papas Fritas | COMIDA | 800 | 20 |
| 5 | Agua Mineral | BEBIDA | 500 | 30 |

### 4.4. Pool de Conexiones (HikariCP)

#### ¿Se crea una conexión nueva por cada request?

**No.** Spring Boot usa **HikariCP** como connection pool por defecto (incluido en `spring-boot-starter-data-jpa`). El pool mantiene un conjunto de conexiones ya abiertas que se reutilizan entre requests. Crear una conexión MySQL nueva por cada llamada sería extremadamente ineficiente.

#### ¿Cómo funciona?

```
                 ┌─────────────────────────────────┐
  Request 1 ───→ │  ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
                 │  │ C │ │ C │ │ C │ │ C │ ... │  │  ← Pool (10 conexiones)
  Request 2 ───→ │  └─┬─┘ └───┘ └─┬─┘ └───┘      │
                 │    │           │                 │
  Request 3 ───→ │    │           │                 │
                 │    ▼           ▼                 │
                 │  ┌──────────────┐               │
                 │  │    MySQL     │               │
                 │  └──────────────┘               │
                 └─────────────────────────────────┘

  1. Al iniciar la app → HikariCP abre 10 conexiones y las mantiene vivas.
  2. Request 1 llega → toma una conexión libre del pool, la usa, la devuelve.
  3. Request 2 llega → toma otra conexión libre.
  4. Si las 10 están ocupadas → el request espera hasta que se libere una
     (timeout: 30 segundos, luego lanza excepción).
  5. Conexiones inactivas por más de 10 min → se cierran y se reemplazan.
```

#### Parámetros por defecto de HikariCP

Al no haber configuración explícita en `application.properties`, se aplican estos valores:

| Parámetro | Valor | Descripción |
|---|---|---|
| `maximumPoolSize` | 10 | Máximo de conexiones simultáneas en el pool |
| `minimumIdle` | 10 | Conexiones mínimas mantenidas inactivas (igual al máximo por defecto) |
| `connectionTimeout` | 30 s | Tiempo máximo de espera para obtener una conexión del pool |
| `idleTimeout` | 10 min | Tiempo máximo que una conexión puede estar inactiva antes de cerrarse |
| `maxLifetime` | 30 min | Tiempo máximo de vida de una conexión en el pool |
| `keepaliveTime` | 0 (desactivado) | Frecuencia de heartbeat para mantener vivas las conexiones |

#### ¿Cómo se personaliza?

Agregando propiedades con prefijo `spring.datasource.hikari.*` en `application.properties`:

```properties
# Ejemplo: pool más grande para alta concurrencia
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=60000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=600000
```

#### ¿Qué pasa si MySQL se cae?

- Las conexiones existentes en el pool quedan inválidas.
- HikariCP las descarta y, en el próximo request, intenta abrir nuevas conexiones.
- Si MySQL sigue caído, el request falla con `SQLException` después del `connectionTimeout` (30 s).
- Si MySQL vuelve, HikariCP restablece el pool automáticamente en el siguiente intento.

---

## 5. API Endpoints

### 5.1. Productos

**Prefijo base:** `/api/productos`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| `POST` | `/api/productos` | Crear un producto | 201 Created |
| `GET` | `/api/productos` | Listar todos los productos | 200 OK |
| `GET` | `/api/productos/{id}` | Obtener producto por ID | 200 OK |
| `PUT` | `/api/productos/{id}` | Actualizar un producto | 200 OK |
| `DELETE` | `/api/productos/{id}` | Eliminar un producto | 204 No Content |

#### POST /api/productos — Request Body

```json
{
  "nombre": "Coca-Cola",
  "precio": 1000,
  "cantidadEnStock": 10,
  "tipo": "BEBIDA"
}
```

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `nombre` | String | Sí | `@NotBlank` | Nombre del producto |
| `precio` | double | Sí | `@Min(0)` | Precio unitario >= 0 |
| `cantidadEnStock` | int | Sí | `@Min(0)` | Stock inicial >= 0 |
| `tipo` | String | Sí | `@NotBlank` | `"BEBIDA"` o `"COMIDA"` (case-insensitive) |

#### GET /api/productos/{id} — Response

```json
{
  "id": 1,
  "tipo": "BEBIDA",
  "nombre": "Coca-Cola",
  "precio": 1000,
  "cantidadEnStock": 10
}
```

#### Errores posibles en Productos

| Código | Causa | Ejemplo |
|--------|-------|---------|
| 400 | Tipo inválido (no es ni BEBIDA ni COMIDA) | `"tipo": "ELECTRONICO"` |
| 400 | Campos requeridos vacíos o negativos | `"nombre": ""` |
| 404 | Producto no encontrado | `GET /api/productos/999` |

---

### 5.2. Pedidos

**Prefijo base:** `/api/pedidos`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| `POST` | `/api/pedidos` | Crear un pedido | 201 Created |
| `GET` | `/api/pedidos` | Listar todos los pedidos | 200 OK |
| `GET` | `/api/pedidos/{id}` | Obtener pedido por ID | 200 OK |

#### POST /api/pedidos — Request Body

```json
{
  "lineas": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 3,
      "cantidad": 1
    }
  ]
}
```

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `lineas` | List | Sí | `@NotEmpty`, `@Valid` | Al menos 1 línea |
| `lineas[].productoId` | Long | Sí | `@NotNull` | ID del producto |
| `lineas[].cantidad` | int | Sí | `@Min(1)` | Cantidad >= 1 |

#### POST /api/pedidos — Response (201)

```json
{
  "id": 1,
  "lineas": [
    {
      "id": 1,
      "productoId": 1,
      "productoNombre": "Coca-Cola",
      "precioUnitario": 1000,
      "cantidad": 2,
      "subtotal": 2000
    },
    {
      "id": 2,
      "productoId": 3,
      "productoNombre": "Hamburguesa",
      "precioUnitario": 2000,
      "cantidad": 1,
      "subtotal": 2000
    }
  ],
  "total": 4000
}
```

#### GET /api/pedidos — Response (200)

Devuelve un array igual que el response de un solo pedido.

#### Lógica de negocio al crear un pedido

1. Recorre cada línea del request.
2. **Valida** que el producto exista → si no, lanza `ResourceNotFoundException` (404).
3. **Valida** stock suficiente (`cantidad ≤ cantidadEnStock`) → si no, lanza `StockInsuficienteException` (400).
4. **Descuenta** el stock del producto en la BD.
5. Crea la entidad `LineaPedido` y la asocia al `Pedido`.
6. Guarda el pedido completo con `CascadeType.ALL`.
7. Todo ocurre dentro de una **transacción** (`@Transactional`). Si cualquier paso falla, se revierte todo (rollback).

#### Errores posibles en Pedidos

| Código | Causa | Respuesta |
|--------|-------|-----------|
| 400 | Stock insuficiente | `"Stock insuficiente para Coca-Cola. Disponible: 5, Solicitado: 10"` |
| 400 | Campos inválidos (vacío, negativo) | `{"status":400, "error":"Validation failed", "details":{...}}` |
| 404 | Producto del pedido no existe | `"Producto no encontrado con id: 999"` |
| 404 | Pedido no encontrado (GET) | `"Pedido no encontrado con id: 999"` |

---

## 6. Manejo de Errores

El `GlobalExceptionHandler` (`@RestControllerAdvice`) captura todas las excepciones y devuelve respuestas JSON uniformes.

### Formato de error estándar

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Producto no encontrado con id: 999",
  "timestamp": "2026-06-26T14:30:00"
}
```

### Excepciones manejadas

| Excepción | HTTP Status |
|---|---|
| `ResourceNotFoundException` | 404 Not Found |
| `StockInsuficienteException` | 400 Bad Request |
| `IllegalArgumentException` | 400 Bad Request |
| `MethodArgumentNotValidException` | 400 Bad Request (con detalle por campo) |

### Error de validación (detalle por campo)

```json
{
  "status": 400,
  "error": "Validation failed",
  "timestamp": "2026-06-26T14:30:00",
  "details": {
    "nombre": "no debe estar vacío",
    "precio": "debe ser mayor o igual a 0"
  }
}
```

---

## 7. Swagger / OpenAPI

La documentación interactiva de la API está disponible en:

- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Configuración

Archivo: `src/main/java/com/techlab/api/config/SpringDocConfig.java`

```java
@Configuration
public class SpringDocConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("e-rbc API - Gestión de Productos y Pedidos")
                .version("1.0.0")
                .description("REST API para la gestión de productos y pedidos")
            );
    }
}
```

Cada endpoint y DTO está documentado con anotaciones de SpringDoc:
- `@Tag` — Agrupa endpoints por recurso (Productos, Pedidos)
- `@Operation` — Describe cada endpoint (summary, description)
- `@ApiResponses` — Documenta posibles códigos de respuesta
- `@Schema` — Describe campos de DTOs con ejemplos

---

## 8. Cómo Ejecutar el Proyecto

### Requisitos previos

1. **Java 22** instalado (`java --version`)
2. **Maven** instalado (`mvn --version`) o usar `./mvnw`
3. **MySQL** corriendo con una base de datos llamada `java_dev`

### Paso a paso

```bash
# 1. Clonar el repositorio y entrar al directorio
cd backend/

# 2. Configurar variables de entorno (opcional, si los defaults no sirven)
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=java_dev
export MYSQL_USER=java_user
export MYSQL_PASSWORD=java_pass_456

# 3. Compilar el proyecto
mvn clean compile

# 4. Ejecutar la aplicación
mvn spring-boot:run

# Alternativa: compilar JAR y ejecutar
mvn clean package -DskipTests
java -jar target/e-rbc-api-1.0.0.jar
```

La aplicación estará disponible en `http://localhost:8080`.

### Verificar que funciona

```bash
# Listar productos (deberían aparecer los 5 datos semilla)
curl http://localhost:8080/api/productos

# Crear un pedido
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"lineas":[{"productoId":1,"cantidad":2}]}'
```

---

## 9. Guía para Desarrolladores Junior

### 9.1. Patrones usados en el código

| Patrón | Dónde se usa | Por qué |
|--------|-------------|---------|
| **Inyección de dependencias** | `@RequiredArgsConstructor` + `private final` | Lombok genera el constructor, Spring inyecta automáticamente |
| **DTO Pattern** | Request/Response separados de entities | Evita exponer la entidad JPA directamente y validaciones independientes |
| **Repository Pattern** | `JpaRepository<Entity, Long>` | Abstrae el acceso a datos sin escribir SQL |
| **Global Exception Handler** | `@RestControllerAdvice` | Centraliza el manejo de errores en un solo lugar |
| **Interface-Implementation** | `IProductoService` / `ProductoServiceImpl` | Permite cambiar la implementación sin afectar los controllers |
| **Inheritance SINGLE_TABLE** | `Producto` → `Bebida`, `Comida` | Todos los productos en una sola tabla, discriminados por `tipo` |
| **Transactional** | `@Transactional` en `PedidoServiceImpl.create()` | Garantiza atomicidad: si falla un descuento de stock, se revierte todo |

### 9.2. Cómo agregar un nuevo endpoint

1. **Si necesitas una nueva entidad:** Crea la clase en `model/`, el repositorio en `repository/`.
2. **DTOs:** Crea `XxxRequest.java` y `XxxResponse.java` en `dto/`.
3. **Servicio:** Crea `IXxxService.java` (interfaz) y `XxxServiceImpl.java` (implementación) en `service/`.
4. **Controller:** Crea `XxxController.java` en `controller/` con las anotaciones REST y Swagger.
5. **Swagger:** Agrega `@Tag`, `@Operation`, `@ApiResponses` al controller y `@Schema` a los DTOs.

### 9.3. Cómo agregar un nuevo campo a una entidad

1. Agrega el campo en la clase entity (`model/`).
2. Agrega el campo en los DTOs correspondientes (`ProductoRequest`, `ProductoResponse`).
3. Actualiza el método `toResponse()` en el service para mapear el nuevo campo.
4. Si el campo debe validarse, agrega anotaciones `@NotNull`, `@NotBlank`, etc.
5. Agrega `@Schema` al campo en los DTOs.

### 9.4. Cómo se manejan las validaciones

- **Request:** Anotaciones Bean Validation (`@NotBlank`, `@Min`, `@NotNull`, `@NotEmpty`) en los DTOs de entrada.
- **Controller:** `@Valid` en el parámetro `@RequestBody` activa la validación.
- **Errores:** `MethodArgumentNotValidException` es capturado por `GlobalExceptionHandler` y devuelve un 400 con detalle por campo.
- **Lógica de negocio:** Validaciones manuales en el service (tipo de producto, stock) lanzan excepciones custom.

### 9.5. Convenciones del código

- **Idioma:** Nombres de clases, variables y mensajes en **español** (Producto, Pedido, Bebida, Comida).
- **Lombok:** Se usa `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@RequiredArgsConstructor` en lugar de escribir getters/setters/constructores manualmente.
- **Formato:** 4 espacios de indentación, llaves en la misma línea.
- **Nombres de paquetes:** `com.techlab.api` como base, organizados por capa (controller, service, model, dto, etc.).
- **Rutas API:** Prefijo `/api/` seguido del recurso en plural en español (`/api/productos`, `/api/pedidos`).
- **DTOs:** Sufijos `Request` para entrada y `Response` para salida.
- **Servicios:** Interfaz con prefijo `I` (`IProductoService`), implementación con sufijo `Impl` (`ProductoServiceImpl`).

---

## 10. Dependencias (pom.xml)

```xml
<!-- Spring Boot Starters -->
<dependency>spring-boot-starter-web</dependency>
<dependency>spring-boot-starter-data-jpa</dependency>
<dependency>spring-boot-starter-validation</dependency>

<!-- Database -->
<dependency>mysql-connector-j</dependency>          <!-- runtime -->

<!-- Utilidades -->
<dependency>lombok</dependency>                     <!-- optional -->
<dependency>springdoc-openapi-starter-webmvc-ui</dependency>  <!-- 2.8.5 -->

<!-- Testing -->
<dependency>spring-boot-starter-test</dependency>   <!-- test -->
```

---

## 11. Preguntas Frecuentes

### ¿Qué pasa si el producto se queda sin stock después de varios pedidos?

Se lanzará `StockInsuficienteException` con un mensaje indicando cuánto stock hay y cuánto se solicitó. El pedido **no** se crea y la transacción se revierte.

### ¿Se puede cambiar el tipo de un producto (de BEBIDA a COMIDA)?

No. El método `update()` del servicio solo modifica `nombre`, `precio` y `cantidadEnStock`. El tipo se determina al crear el producto y no se puede cambiar después.

### ¿Por qué se usa SINGLE_TABLE en lugar de JOINED o TABLE_PER_CLASS?

Es la estrategia más simple y eficiente cuando las subclases no tienen campos adicionales. Evita JOINs y mantiene buena performance.

### ¿Dónde veo la base de datos?

No hay consola H2 incluida. Debes conectarte directamente a MySQL:
```bash
mysql -u java_user -p java_dev
SELECT * FROM producto;
SELECT * FROM pedidos;
SELECT * FROM lineas_pedido;
```

### ¿Qué endpoint usan los tests?

Actualmente solo existe un test básico de carga de contexto (`TechlabApplicationTests`). No hay tests de integración de endpoints. Para probar la API, usa Swagger UI o curl.

---

## 12. Referencia Rápida

```bash
# Compilar
mvn clean compile

# Ejecutar
mvn spring-boot:run

# Empaquetar JAR
mvn clean package -DskipTests

# Swagger UI
open http://localhost:8080/swagger-ui/index.html

# Listar productos
curl http://localhost:8080/api/productos

# Crear pedido
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"lineas":[{"productoId":1,"cantidad":2}]}'

# Ver un pedido
curl http://localhost:8080/api/pedidos/1
```
