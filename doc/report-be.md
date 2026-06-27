# Reporte del Backend — `e-rbc-api`

## 1. Identidad del Proyecto

| Campo | Valor |
|---|---|
| **Nombre** | `e-rbc-api` |
| **Descripción** | API REST para gestión de productos y pedidos de e-rbc |
| **Group ID** | `com.techlab` |
| **Artifact ID** | `e-rbc-api` |
| **Versión** | `1.0.0` |
| **Build Tool** | Apache Maven 4.0.0 |
| **Parent POM** | `spring-boot-starter-parent` 3.4.5 |
| **Java** | 22 (source y target) |
| **Puerto** | 8080 |
| **IDE** | Eclipse (STS, con m2e) |

---

## 2. Estructura del Proyecto

```
backend/
├── .classpath                          # Configuración classpath Eclipse (JavaSE-22)
├── .factorypath                        # Lombok 1.18.38 annotation processor
├── .gitkeep
├── .project                            # Eclipse project name: e-rbc-api
├── pom.xml
├── .github/                            # Vacío — sin workflows
├── .settings/                          # Configuración Eclipse (Java 22, UTF-8, APT)
├── src/
│   ├── main/java/com/techlab/api/
│   │   ├── TechlabApplication.java                 # Clase principal @SpringBootApplication
│   │   ├── config/
│   │   │   └── DataInitializer.java                # Datos semilla al iniciar
│   │   ├── controller/
│   │   │   ├── PedidoController.java               # API REST de pedidos
│   │   │   └── ProductoController.java             # API REST de productos
│   │   ├── dto/
│   │   │   ├── PedidoRequest.java
│   │   │   ├── PedidoResponse.java
│   │   │   ├── ProductoRequest.java
│   │   │   └── ProductoResponse.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java         # @RestControllerAdvice
│   │   │   ├── ResourceNotFoundException.java      # 404
│   │   │   └── StockInsuficienteException.java     # 400
│   │   ├── model/
│   │   │   ├── Bebida.java
│   │   │   ├── Comida.java
│   │   │   ├── LineaPedido.java
│   │   │   ├── Pedido.java
│   │   │   └── Producto.java                       # Abstracta, SINGLE_TABLE
│   │   ├── repository/
│   │   │   ├── PedidoRepository.java
│   │   │   └── ProductoRepository.java
│   │   └── service/
│   │       ├── IPedidoService.java
│   │       ├── IProductoService.java
│   │       ├── PedidoServiceImpl.java
│   │       └── ProductoServiceImpl.java
│   ├── main/resources/
│   │   └── application.properties
│   └── test/java/com/techlab/api/
│       └── TechlabApplicationTests.java
└── target/                                          # Build output
```

**Total**: 16 archivos Java en `main` + 1 en `test` + 9 archivos de configuración.

---

## 3. Dependencias Maven

| Dependencia | GroupId | ArtifactId | Versión | Scope | Propósito |
|---|---|---|---|---|---|
| Spring Web | `org.springframework.boot` | `spring-boot-starter-web` | 3.4.5 | compile | REST controllers, Tomcat embebido, Jackson JSON |
| Spring Data JPA | `org.springframework.boot` | `spring-boot-starter-data-jpa` | 3.4.5 | compile | JPA/Hibernate ORM, Spring Data repositories |
| Bean Validation | `org.springframework.boot` | `spring-boot-starter-validation` | 3.4.5 | compile | Validación Jakarta (`@Valid`, `@NotBlank`, etc.) |
| MySQL Driver | `com.mysql` | `mysql-connector-j` | heredada | runtime | Driver JDBC para MySQL |
| Lombok | `org.projectlombok` | `lombok` | 1.18.38 | optional | Reducción de boilerplate |
| Spring Test | `org.springframework.boot` | `spring-boot-starter-test` | 3.4.5 | test | JUnit 5, Mockito, Spring TestContext |
| SpringDoc OpenAPI | `org.springdoc` | `springdoc-openapi-starter-webmvc-ui` | 2.8.5 | compile | OpenAPI 3 / Swagger UI automático |

---

## 4. Plugins Maven

| Plugin | Propósito |
|---|---|
| `maven-compiler-plugin` | Compilación Java 22 + annotation processor de Lombok 1.18.38 |
| `spring-boot-maven-plugin` | Fat JAR ejecutable; excluye Lombok del artefacto final |

---

## 5. Configuración de Base de Datos

### MySQL — `application.properties`

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

spring.jackson.serialization.write-dates-as-timestamps=false
```

**Variables de entorno soportadas**: `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.

### Valores por defecto

| Variable | Valor por defecto |
|---|---|
| `MYSQL_HOST` | `localhost` |
| `MYSQL_PORT` | `3306` |
| `MYSQL_DATABASE` | `java_dev` |
| `MYSQL_USER` | `java_user` |
| `MYSQL_PASSWORD` | `java_pass_456` |

---

## 6. Modelo de Datos (JPA Entities)

### 6.1 `Producto` — Entidad abstracta base
- **Tabla**: `producto`
- **Estrategia de herencia**: `SINGLE_TABLE` con columna discriminadora `tipo`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | `BIGINT` | PK, auto-increment |
| `nombre` | `VARCHAR` | NOT NULL, `@NotBlank` |
| `precio` | `DOUBLE` | NOT NULL, `@Min(0)` |
| `cantidadEnStock` | `INT` | NOT NULL, `@Min(0)` |
| `tipo` | `VARCHAR` | Discriminador: `"COMIDA"` o `"BEBIDA"` |

**Subclases**:
- `Comida` → `@DiscriminatorValue("COMIDA")`
- `Bebida` → `@DiscriminatorValue("BEBIDA")`

### 6.2 `Pedido`
- **Tabla**: `pedidos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | `BIGINT` | PK, auto-increment |

- **Relación**: `@OneToMany(mappedBy = "pedido", cascade = ALL, orphanRemoval = true, fetch = LAZY)` → `LineaPedido`

### 6.3 `LineaPedido`
- **Tabla**: `lineas_pedido`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | `BIGINT` | PK, auto-increment |
| `cantidadSolicitada` | `INT` | NOT NULL |
| `pedido_id` | `BIGINT` | FK → `pedidos.id`, NOT NULL, LAZY |
| `producto_id` | `BIGINT` | FK → `producto.id`, NOT NULL, EAGER |

---

## 7. API REST — Endpoints

### 7.1 Productos (`/api/productos`)

| Método | Ruta | Descripción | Request Body | Response | Código |
|---|---|---|---|---|---|
| `POST` | `/api/productos` | Crear producto | `{"nombre", "precio", "cantidadEnStock", "tipo"}` | `ProductoResponse` | 201 |
| `GET` | `/api/productos` | Listar todos | — | `List<ProductoResponse>` | 200 |
| `GET` | `/api/productos/{id}` | Obtener por ID | — | `ProductoResponse` | 200 |
| `PUT` | `/api/productos/{id}` | Actualizar producto | `{"nombre", "precio", "cantidadEnStock", "tipo"}` | `ProductoResponse` | 200 |
| `DELETE` | `/api/productos/{id}` | Eliminar producto | — | — | 204 |

### 7.2 Pedidos (`/api/pedidos`)

| Método | Ruta | Descripción | Request Body | Response | Código |
|---|---|---|---|---|---|
| `POST` | `/api/pedidos` | Crear pedido (reduce stock) | `{"lineas": [{"productoId", "cantidad"}]}` | `PedidoResponse` | 201 |
| `GET` | `/api/pedidos` | Listar todos | — | `List<PedidoResponse>` | 200 |
| `GET` | `/api/pedidos/{id}` | Obtener por ID | — | `PedidoResponse` | 200 |

### 7.3 Formato de Error

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Producto no encontrado con id: 99",
  "timestamp": "2026-06-23T18:30:00"
}
```

Errores de validación incluyen campo `details` con errores por campo.

---

## 8. Capas de la Arquitectura

```
[Cliente REST/JSON]
        |
        v
[Controller Layer]    @RestController, @RequestMapping
  ProductoController  /api/productos     CRUD completo
  PedidoController    /api/pedidos       Crear y consultar
        |
        v
[Service Layer]       @Service, @Transactional
  ProductoServiceImpl   CRUD + factory por tipo
  PedidoServiceImpl     Creación de pedidos con control de stock
        |
        v
[Repository Layer]    JpaRepository
  ProductoRepository
  PedidoRepository
        |
        v
[Model Layer]         JPA @Entity
  Producto (abstract, SINGLE_TABLE)
    ├── Comida  (@DiscriminatorValue("COMIDA"))
    └── Bebida  (@DiscriminatorValue("BEBIDA"))
  Pedido
  LineaPedido
        |
[Cross-cutting]
  GlobalExceptionHandler   @RestControllerAdvice — errores unificados
  DataInitializer          CommandLineRunner — datos semilla
  Bean Validation          Jakarta — validación de requests
  SpringDoc OpenAPI        Swagger UI en /swagger-ui.html
```

---

## 9. Datos Semilla (`DataInitializer`)

Si la tabla de productos está vacía al iniciar, se insertan automáticamente:

| Producto | Tipo | Precio | Stock |
|---|---|---|---|
| Coca-Cola | BEBIDA | 1000 | 10 |
| Sprite | BEBIDA | 900 | 15 |
| Hamburguesa | COMIDA | 2000 | 5 |
| Papas Fritas | COMIDA | 800 | 20 |
| Agua Mineral | BEBIDA | 500 | 30 |

---

## 10. Manejo de Excepciones

| Excepción | HTTP Status | Descripción |
|---|---|---|
| `ResourceNotFoundException` | 404 Not Found | Recurso no encontrado por ID |
| `StockInsuficienteException` | 400 Bad Request | Stock insuficiente al crear pedido |
| `IllegalArgumentException` | 400 Bad Request | Tipo de producto inválido |
| `MethodArgumentNotValidException` | 400 Bad Request | Error de validación de campos |

---

## 11. Pruebas

- **Framework**: JUnit 5 (`spring-boot-starter-test`)
- **Archivo**: `TechlabApplicationTests.java`
- **Prueba única**: `contextLoads()` — verifica que el contexto de Spring carga correctamente (smoke test)
- No hay pruebas unitarias o de integración adicionales.

---

## 12. CI/CD

No hay workflows de GitHub Actions configurados. El directorio `.github/` existe pero está vacío.

---

## 13. Swagger / OpenAPI

- **Librería**: `springdoc-openapi-starter-webmvc-ui` 2.8.5
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI spec**: `http://localhost:8080/v3/api-docs`

---

## 14. Cómo Ejecutar

**Requisitos previos**:
- JDK 22
- Maven 3.8+
- MySQL corriendo con base de datos `java_dev`

```bash
# Compilar
cd backend
mvn clean compile

# Ejecutar
mvn spring-boot:run

# O construir y ejecutar el JAR
mvn clean package -DskipTests
java -jar target/e-rbc-api-1.0.0.jar
```

Con variables de entorno personalizadas:
```bash
MYSQL_HOST=192.168.1.100 MYSQL_PORT=3307 MYSQL_DATABASE=mi_db \
MYSQL_USER=admin MYSQL_PASSWORD=secret \
mvn spring-boot:run
```
