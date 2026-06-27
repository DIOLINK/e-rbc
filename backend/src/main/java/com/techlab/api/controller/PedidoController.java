package com.techlab.api.controller;

import com.techlab.api.dto.PedidoRequest;
import com.techlab.api.dto.PedidoResponse;
import com.techlab.api.service.IPedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Operaciones para gestionar pedidos con validación de stock")
public class PedidoController {

    private final IPedidoService service;

    @Operation(
            summary = "Crear un nuevo pedido",
            description = "Crea un pedido con una o más líneas de productos. "
                        + "Por cada línea se valida que el producto exista y que haya stock suficiente. "
                        + "El stock se descuenta automáticamente dentro de una transacción. "
                        + "Si algún producto no tiene stock suficiente, se lanza un error y no se crea el pedido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Pedido creado exitosamente, stock descontado",
                    content = @Content(schema = @Schema(implementation = PedidoResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos, producto no encontrado o stock insuficiente"),
            @ApiResponse(responseCode = "404", description = "Producto del pedido no encontrado")
    })
    @PostMapping
    public ResponseEntity<PedidoResponse> create(@Valid @RequestBody PedidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @Operation(
            summary = "Listar todos los pedidos",
            description = "Obtiene la lista completa de pedidos registrados con el detalle de cada línea y total calculado."
    )
    @ApiResponse(responseCode = "200", description = "Lista de pedidos obtenida exitosamente")
    @GetMapping
    public ResponseEntity<List<PedidoResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @Operation(
            summary = "Buscar pedido por ID",
            description = "Obtiene los detalles de un pedido específico incluyendo sus líneas, subtotales y total."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> findById(
            @Parameter(description = "ID del pedido a buscar", required = true, example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
}
