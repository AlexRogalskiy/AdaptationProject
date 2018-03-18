package ru.hh.school.adaptation.services.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.hh.nab.core.util.FileSettings;
import ru.hh.school.adaptation.dto.HhUserInfoDto;
import ru.hh.school.adaptation.dto.UserDto;
import ru.hh.school.adaptation.entities.User;
import ru.hh.school.adaptation.exceptions.EntityNotFoundException;
import ru.hh.school.adaptation.services.MailService;
import ru.hh.school.adaptation.services.UserService;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import java.net.URI;

public class AuthService {
  private static final Logger logger = LoggerFactory.getLogger(MailService.class);
  private HhApiService apiService;
  private UserService userService;

  @Inject
  public AuthService(FileSettings fileSettings, UserService userService) {
    FileSettings oauthSettings = fileSettings.getSubSettings("oauth");
    final String clientId = oauthSettings.getString("client.id");
    final String clientSecret = oauthSettings.getString("client.secret");
    final String redirectUri = oauthSettings.getString("redirect-uri");
    apiService = new HhApiService(clientId, clientSecret, redirectUri);

    this.userService = userService;
  }

  public URI getAuthorizationUri() {
    return URI.create(apiService.getAuthorizationUrl());
  }

  public void authorize(HttpServletRequest request) {
    String code = request.getParameter("code");
    try {
      // User info.
      HhUserInfoDto userInfo = apiService.getUserInfo(code);
      if (userInfo == null) {
        logger.error("Oops! Something goes wrong.");
        return;
      }

      // Obtain user by hhid.
      User user = userService.getUserByHhid(userInfo.getId());
      if (user == null) {
        // Access denied for the user.
        logger.error("There is no user with hhid {}", userInfo.getId());
        return;
      }

      // Update user.
      UserDto userDto = userService.getUserDto(user.getId());
      userDto.firstName = userInfo.getFirstName();
      userDto.lastName = userInfo.getLastName();
      userDto.middleName = userInfo.getMiddleName();
      userDto.email = userInfo.getEmail();
      userService.updateUser(userDto);


      // Add user id to session.
      UserSession userSession = getUserSession(request);
      userSession.setId(user.getId());
    } catch (Exception e) {
      logger.error(e.getMessage());
    }
  }

  public void logout(HttpServletRequest request) {
    if (isUserLoggedIn(request)) {
      getUserSession(request).logout();
    }
  }

  public boolean isUserLoggedIn(HttpServletRequest request) {
    return getUserSession(request).getId() != null;
  }

  public User getUser(HttpServletRequest request) throws EntityNotFoundException {
    Integer userId = getUserSession(request).getId();
    return userService.getUser(userId);
  }

  private UserSession getUserSession(HttpServletRequest request) {
    return new UserSession(request.getSession());
  }
}
