package app.project.EduCloud.service.Auth;

import app.project.EduCloud.dto.request.Auth.AuthenticationRequest;
import app.project.EduCloud.dto.request.Auth.IntrospectRequest;
import app.project.EduCloud.dto.request.Auth.LogOutRequest;
import app.project.EduCloud.dto.request.Auth.RefeshRequest;
import app.project.EduCloud.dto.response.Auth.AuthenticationResponse;
import app.project.EduCloud.dto.response.Auth.IntrospectResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;

    void logOut(LogOutRequest request) throws ParseException, JOSEException;

    AuthenticationResponse refeshToken(RefeshRequest request) throws ParseException, JOSEException;
}
