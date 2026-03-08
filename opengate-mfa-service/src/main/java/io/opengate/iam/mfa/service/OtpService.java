package io.opengate.iam.mfa.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private final SecureRandom random = new SecureRandom();
    private static final Duration OTP_TTL = Duration.ofMinutes(10);

    public String generateAndStoreEmailOtp(String userId) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        redisTemplate.opsForValue().set("otp:email:" + userId, otp, OTP_TTL);
        return otp;
    }

    public boolean verifyEmailOtp(String userId, String code) {
        String stored = redisTemplate.opsForValue().get("otp:email:" + userId);
        if (stored != null && stored.equals(code)) {
            redisTemplate.delete("otp:email:" + userId);
            return true;
        }
        return false;
    }

    public String generateAndStoreSmsOtp(String userId) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        redisTemplate.opsForValue().set("otp:sms:" + userId, otp, OTP_TTL);
        return otp;
    }

    public boolean verifySmsOtp(String userId, String code) {
        String stored = redisTemplate.opsForValue().get("otp:sms:" + userId);
        if (stored != null && stored.equals(code)) {
            redisTemplate.delete("otp:sms:" + userId);
            return true;
        }
        return false;
    }
}
