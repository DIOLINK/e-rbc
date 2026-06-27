package com.techlab.api.config;

import com.techlab.api.repository.ProductoRepository;
import com.techlab.api.service.ProductoFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductoRepository repository;
    private final ProductoFactory productoFactory;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.save(productoFactory.crear("BEBIDA", "Coca-Cola", 1000, 10));
        repository.save(productoFactory.crear("BEBIDA", "Sprite", 900, 15));
        repository.save(productoFactory.crear("COMIDA", "Hamburguesa", 2000, 5));
        repository.save(productoFactory.crear("COMIDA", "Papas Fritas", 800, 20));
        repository.save(productoFactory.crear("BEBIDA", "Agua Mineral", 500, 30));
    }
}
