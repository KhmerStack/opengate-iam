package io.opengate.iam.notification.service;

import io.opengate.iam.notification.domain.entity.NotificationRecord;
import io.opengate.iam.notification.dto.SendEmailRequest;
import io.opengate.iam.notification.repository.NotificationRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final NotificationRepository notificationRepository;

    public void send(SendEmailRequest request) {
        try {
            Context ctx = new Context();
            if (request.variables() != null) {
                request.variables().forEach(ctx::setVariable);
            }
            String html = templateEngine.process("email/" + request.template(), ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(request.to());
            helper.setSubject(request.subject());
            helper.setText(html, true);
            mailSender.send(message);

            save(request, "SENT");
            log.info("Email sent to {} template={}", request.to(), request.template());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", request.to(), e.getMessage());
            save(request, "FAILED");
        }
    }

    private void save(SendEmailRequest r, String status) {
        notificationRepository.save(NotificationRecord.builder()
            .type("EMAIL").recipient(r.to()).subject(r.subject())
            .template(r.template()).status(status).build());
    }
}
