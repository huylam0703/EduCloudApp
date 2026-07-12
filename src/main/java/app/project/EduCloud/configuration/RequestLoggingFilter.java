package app.project.EduCloud.configuration;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        String requestId = Optional
                .ofNullable(request.getHeader(REQUEST_ID_HEADER))
                .filter(value -> !value.isBlank())
                .orElse(UUID.randomUUID().toString());

        MDC.put("requestId", requestId);
        MDC.put("username", "anonymous");

        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            log.info(
                    "HTTP request started method={} uri={} clientIp={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    getClientIp(request)
            );

            filterChain.doFilter(request, response);

        } catch (Exception exception) {
            log.error(
                    "HTTP request failed method={} uri={} error={}",
                    request.getMethod(),
                    request.getRequestURI(),
                    exception.getMessage(),
                    exception
            );

            throw exception;

        } finally {
            long durationMs = System.currentTimeMillis() - startTime;

            if (response.getStatus() >= 500) {
                log.error(
                        "HTTP request completed method={} uri={} status={} durationMs={}",
                        request.getMethod(),
                        request.getRequestURI(),
                        response.getStatus(),
                        durationMs
                );
            } else if (response.getStatus() >= 400) {
                log.warn(
                        "HTTP request completed method={} uri={} status={} durationMs={}",
                        request.getMethod(),
                        request.getRequestURI(),
                        response.getStatus(),
                        durationMs
                );
            } else {
                log.info(
                        "HTTP request completed method={} uri={} status={} durationMs={}",
                        request.getMethod(),
                        request.getRequestURI(),
                        response.getStatus(),
                        durationMs
                );
            }

            MDC.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}