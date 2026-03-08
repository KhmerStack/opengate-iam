package io.opengate.iam.notification.controller;

import io.opengate.iam.notification.dto.SendEmailRequest;
import io.opengate.iam.notification.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/email")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void sendEmail(@RequestBody @Valid SendEmailRequest request) {
        emailService.send(request);
    }
}
