package io.opengate.iam.user.controller;

import io.opengate.iam.common.dto.PageResponse;
import io.opengate.iam.user.dto.request.CreateUserRequest;
import io.opengate.iam.user.dto.response.UserResponse;
import io.opengate.iam.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@RequestParam String realm, @RequestBody @Valid CreateUserRequest request) {
        return userService.create(realm, request);
    }

    @GetMapping
    public PageResponse<UserResponse> list(
        @RequestParam String realm,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return userService.list(realm, search, page, size);
    }

    @GetMapping("/{id}")
    public UserResponse get(@PathVariable UUID id) {
        return userService.getById(id);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable UUID id, @RequestBody @Valid CreateUserRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }

    @PostMapping("/{id}/reset-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void resetPassword(@PathVariable UUID id) {
        // Trigger password reset email via notification service
    }

    @PostMapping("/{id}/send-verify-email")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void sendVerifyEmail(@PathVariable UUID id) {
        // Trigger email verification via notification service
    }
}
