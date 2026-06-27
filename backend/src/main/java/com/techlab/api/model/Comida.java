package com.techlab.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("COMIDA")
@NoArgsConstructor
public class Comida extends Producto {

    public Comida(String nombre, double precio, int cantidadEnStock) {
        super(nombre, precio, cantidadEnStock);
    }

    @Override
    public String getTipo() {
        return "COMIDA";
    }
}
