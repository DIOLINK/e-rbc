package com.techlab.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Representación de un producto en las respuestas de la API")
public class ProductoResponse {

    @Schema(description = "Identificador único del producto", example = "1")
    private Long id;

    @Schema(description = "Tipo de producto (BEBIDA o COMIDA)", example = "BEBIDA")
    private String tipo;

    @Schema(description = "Nombre del producto", example = "Coca-Cola")
    private String nombre;

    @Schema(description = "Precio unitario", example = "1000")
    private double precio;

    @Schema(description = "Cantidad disponible en stock", example = "10")
    private int cantidadEnStock;
}
