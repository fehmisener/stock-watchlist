package com.pearl.stockwatchlist.controller;

import com.pearl.stockwatchlist.dto.user.LoginResponse;
import com.pearl.stockwatchlist.dto.user.LoginUserDto;
import com.pearl.stockwatchlist.dto.user.RegisterUserDto;
import com.pearl.stockwatchlist.model.user.User;
import com.pearl.stockwatchlist.security.JwtUtil;
import com.pearl.stockwatchlist.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

  private final AuthService authService;
  private final JwtUtil jwtUtil;

  public AuthController(AuthService authService, JwtUtil jwtUtil) {
    this.authService = authService;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
    User registeredUser = authService.register(registerUserDto);

    return ResponseEntity.ok(registeredUser);
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {

    User authenticatedUser = authService.authenticate(loginUserDto);
    String jwtToken = jwtUtil.generateToken(authenticatedUser);

    return ResponseEntity.ok(
        LoginResponse.builder().token(jwtToken).expiresIn(jwtUtil.getExpirationTime()).build());
  }

  @PostMapping("/validateToken")
  public ResponseEntity<Boolean> validateToken(@RequestBody String token) {
    boolean isValid = jwtUtil.isTokenExpired(token);
    return ResponseEntity.ok(!isValid);
  }
}
