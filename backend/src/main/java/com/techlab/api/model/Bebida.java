package com.techlab.api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("BEBIDA")
@NoArgsConstructor
public class Bebida extends Producto {

    public Bebida(String nombre, double precio, int cantidadEnStock) {
        super(nombre, precio, cantidadEnStock);
    }

    @Override
    public String getTipo() {
        return "BEBIDA";
    }
}
