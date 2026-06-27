package com.techlab.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear o actualizar un producto")
public class ProductoRequest {

    @NotBlank
    @Schema(description = "Nombre del producto", example = "Coca-Cola")
    private String nombre;

    @Min(0)
    @Schema(description = "Precio unitario del producto", example = "1000", minimum = "0")
    private double precio;

    @Min(0)
    @Schema(description = "Cantidad disponible en inventario", example = "10", minimum = "0")
    private int cantidadEnStock;

    @NotBlank
    @Schema(description = "Tipo de producto — debe ser BEBIDA o COMIDA", example = "BEBIDA", allowableValues = {"BEBIDA", "COMIDA"})
    private String tipo;
}
