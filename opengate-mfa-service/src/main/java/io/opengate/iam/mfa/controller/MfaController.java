package io.opengate.iam.mfa.controller;

import io.opengate.iam.mfa.service.OtpService;
import io.opengate.iam.mfa.service.TotpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/mfa")
@RequiredArgsConstructor
public class MfaController {

    private final TotpService totpService;
    private final OtpService otpService;

    @PostMapping("/totp/setup")
    public Map<String, String> totpSetup(
        @RequestParam String userId,
        @RequestParam String account,
        @RequestParam(defaultValue = "OpenGate") String issuer
    ) {
        String secret = totpService.generateSecret();
        String qrUri = totpService.buildQrUri(secret, account, issuer);
        return Map.of("secret", secret, "qrUri", qrUri);
    }

    @PostMapping("/totp/verify")
    public Map<String, Boolean> totpVerify(@RequestParam String secret, @RequestParam String code) {
        return Map.of("valid", totpService.verify(secret, code));
    }

    @PostMapping("/otp/email/send")
    public Map<String, String> sendEmailOtp(@RequestParam String userId) {
        otpService.generateAndStoreEmailOtp(userId);
        return Map.of("message", "OTP sent to registered email");
    }

    @PostMapping("/otp/email/verify")
    public Map<String, Boolean> verifyEmailOtp(@RequestParam String userId, @RequestParam String code) {
        return Map.of("valid", otpService.verifyEmailOtp(userId, code));
    }

    @PostMapping("/otp/sms/send")
    public Map<String, String> sendSmsOtp(@RequestParam String userId) {
        otpService.generateAndStoreSmsOtp(userId);
        return Map.of("message", "OTP sent to registered phone");
    }

    @PostMapping("/otp/sms/verify")
    public Map<String, Boolean> verifySmsOtp(@RequestParam String userId, @RequestParam String code) {
        return Map.of("valid", otpService.verifySmsOtp(userId, code));
    }

    @GetMapping("/backup-codes/generate")
    public Map<String, Object> generateBackupCodes(@RequestParam String userId) {
        List<String> codes = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            codes.add(UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase());
        }
        return Map.of("backupCodes", codes, "userId", userId);
    }
}
