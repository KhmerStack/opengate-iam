package io.opengate.sample.controller;

import io.opengate.sample.dto.ProductDto;
import io.opengate.starter.security.OpenGateUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Protected product API — requires a valid OpenGate JWT.
 *
 * Role mapping:
 *   GET  /api/products          → any authenticated user (ROLE_USER or ROLE_ADMIN)
 *   POST /api/products          → admin only (ROLE_ADMIN)
 *   DELETE /api/products/{id}   → admin only (ROLE_ADMIN)
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    // In-memory store for demo
    private static final List<ProductDto> PRODUCTS = new java.util.ArrayList<>(List.of(
        new ProductDto(UUID.randomUUID().toString(), "Laptop Pro 15",  1299.99, "Electronics"),
        new ProductDto(UUID.randomUUID().toString(), "Wireless Mouse",   29.99, "Accessories"),
        new ProductDto(UUID.randomUUID().toString(), "Standing Desk",   449.00, "Furniture"),
        new ProductDto(UUID.randomUUID().toString(), "USB-C Hub",        59.99, "Accessories")
    ));

    /**
     * Any authenticated user can list products.
     * The JWT is automatically validated by OpenGate starter.
     *
     * curl -H "Authorization: Bearer <token>" http://localhost:8090/api/products
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> listProducts(@org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt) {
        OpenGateUser user = OpenGateUser.from(jwt);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("products", PRODUCTS);
        result.put("total", PRODUCTS.size());
        result.put("requestedBy", user.getEmail() != null ? user.getEmail() : user.getUsername());
        result.put("realm", user.getRealm() != null ? user.getRealm() : "master");
        return result;
    }

    /**
     * Only users with ROLE_ADMIN can create products.
     *
     * curl -X POST http://localhost:8090/api/products \
     *   -H "Authorization: Bearer <admin-token>" \
     *   -H "Content-Type: application/json" \
     *   -d '{"name":"New Product","price":99.99,"category":"Electronics"}'
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@RequestBody Map<String, Object> body,
                                                     @org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt) {
        OpenGateUser user = OpenGateUser.from(jwt);
        ProductDto product = new ProductDto(
            UUID.randomUUID().toString(),
            (String) body.get("name"),
            ((Number) body.getOrDefault("price", 0)).doubleValue(),
            (String) body.getOrDefault("category", "General")
        );
        PRODUCTS.add(product);
        System.out.printf("Product created by %s (roles: %s)%n", user.getEmail(), user.getRoles());
        return ResponseEntity.status(201).body(product);
    }

    /**
     * Only admins can delete products.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id,
                                               @org.springframework.security.core.annotation.AuthenticationPrincipal Jwt jwt) {
        boolean removed = PRODUCTS.removeIf(p -> p.id().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
