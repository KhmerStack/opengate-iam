package io.opengate.iam.common.exception;

public class ResourceNotFoundException extends OpenGateException {
    public ResourceNotFoundException(String resource, String id) {
        super("RESOURCE_NOT_FOUND", resource + " not found with id: " + id);
    }
}
