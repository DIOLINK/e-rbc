package com.techlab.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SpringDocConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("e-rbc API - Gestión de Productos y Pedidos")
                        .description("""
                                REST API para la gestión de productos (bebidas y comidas) y pedidos del sistema e-rbc.

                                ## Recursos disponibles
                                - **Productos** — CRUD de productos con soporte para tipos `BEBIDA` y `COMIDA`
                                - **Pedidos** — Creación y consulta de pedidos con validación de stock

                                ## Swagger UI
                                Accede a la interfaz interactiva en `/swagger-ui/index.html`.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("TechLab")
                                .url("https://techlab.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor local de desarrollo")
                ));
    }
}
