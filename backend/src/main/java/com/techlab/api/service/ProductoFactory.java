package com.techlab.api.service;

import com.techlab.api.model.Bebida;
import com.techlab.api.model.Comida;
import com.techlab.api.model.Producto;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ProductoFactory {

    @FunctionalInterface
    public interface ProductoCreador {
        Producto crear(String nombre, double precio, int cantidadEnStock);
    }

    private final Map<String, ProductoCreador> creadores = new HashMap<>();

    public ProductoFactory() {
        creadores.put("BEBIDA", Bebida::new);
        creadores.put("COMIDA", Comida::new);
    }

    public Producto crear(String tipo, String nombre, double precio, int cantidadEnStock) {
        ProductoCreador creador = creadores.get(tipo.toUpperCase());
        if (creador == null) {
            throw new IllegalArgumentException("Tipo inválido. Use BEBIDA o COMIDA.");
        }
        return creador.crear(nombre, precio, cantidadEnStock);
    }
}
