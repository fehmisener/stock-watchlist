package com.pearl.stockwatchlist.service;

import com.pearl.stockwatchlist.dto.user.LoginUserDto;
import com.pearl.stockwatchlist.dto.user.RegisterUserDto;
import com.pearl.stockwatchlist.model.user.User;
import com.pearl.stockwatchlist.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  public AuthService(
      UserRepository userRepository,
      AuthenticationManager authenticationManager,
      PasswordEncoder passwordEncoder) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User register(RegisterUserDto input) {
    User user = new User(input.getEmail(), passwordEncoder.encode(input.getPassword()));
    return userRepository.save(user);
  }

  public User authenticate(LoginUserDto input) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

    return userRepository.findByEmail(input.getEmail()).orElseThrow();
  }
}
