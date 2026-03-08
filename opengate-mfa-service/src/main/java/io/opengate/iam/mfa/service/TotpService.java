package io.opengate.iam.mfa.service;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TotpService {

    private static final int DIGITS = 6;
    private static final int WINDOW = 1;
    private static final int STEP = 30;

    public String generateSecret() {
        byte[] bytes = new byte[20];
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public String buildQrUri(String secret, String account, String issuer) {
        return String.format(
            "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30",
            issuer, account, secret, issuer
        );
    }

    public boolean verify(String secret, String code) {
        long currentStep = System.currentTimeMillis() / 1000L / STEP;
        for (int i = -WINDOW; i <= WINDOW; i++) {
            if (generateTotp(secret, currentStep + i).equals(code)) return true;
        }
        return false;
    }

    private String generateTotp(String secret, long step) {
        try {
            byte[] key = Base64.getDecoder().decode(secret);
            byte[] stepBytes = new byte[8];
            for (int i = 7; i >= 0; i--) {
                stepBytes[i] = (byte) (step & 0xFF);
                step >>= 8;
            }
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(key, "HmacSHA1"));
            byte[] hash = mac.doFinal(stepBytes);
            int offset = hash[hash.length - 1] & 0x0F;
            int otp = ((hash[offset] & 0x7F) << 24)
                | ((hash[offset + 1] & 0xFF) << 16)
                | ((hash[offset + 2] & 0xFF) << 8)
                | (hash[offset + 3] & 0xFF);
            return String.format("%0" + DIGITS + "d", otp % (int) Math.pow(10, DIGITS));
        } catch (Exception e) {
            throw new RuntimeException("TOTP generation failed", e);
        }
    }
}
