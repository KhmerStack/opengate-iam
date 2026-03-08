package io.opengate.iam.common.exception;

public class OpenGateException extends RuntimeException {
    private final String errorCode;

    public OpenGateException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
