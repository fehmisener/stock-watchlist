package com.pearl.stockwatchlist.dto.user;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class LoginResponse {

  private String token;
  private long expiresIn;
}
