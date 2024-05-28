package com.pearl.stockwatchlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class StockwatchApplication {

  public static void main(String[] args) {
    SpringApplication.run(StockwatchApplication.class, args);
  }
}
