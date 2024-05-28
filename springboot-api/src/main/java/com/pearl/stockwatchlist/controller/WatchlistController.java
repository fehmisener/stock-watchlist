package com.pearl.stockwatchlist.controller;

import com.pearl.stockwatchlist.dto.watchlist.AddWatchlistRequestDto;
import com.pearl.stockwatchlist.dto.watchlist.WatchlistDto;
import com.pearl.stockwatchlist.model.user.User;
import com.pearl.stockwatchlist.service.WatchlistService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/watchlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchlistController {

  private User currentUser;
  private final WatchlistService watchlistService;

  public WatchlistController(WatchlistService watchlistService) {
    this.watchlistService = watchlistService;
  }

  @ModelAttribute
  public void setAuthentication() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    this.currentUser = (User) authentication.getPrincipal();
  }

  @GetMapping("/get")
  public ResponseEntity<List<WatchlistDto>> getWatchlistsByUserId() {
    return ResponseEntity.ok(watchlistService.getWatchlistsByUserId(currentUser.getId()));
  }

  @PostMapping("/add")
  public ResponseEntity<WatchlistDto> addWatchlist(
      @RequestBody AddWatchlistRequestDto watchlistDto) {
    return ResponseEntity.ok(watchlistService.addWatchlist(currentUser.getId(), watchlistDto));
  }

  @DeleteMapping("/deleteItem")
  public ResponseEntity<Void> deleteItemFromWatchlist(@RequestParam String symbol) {
    watchlistService.deleteWatchlistItem(currentUser.getId(), symbol);
    return ResponseEntity.ok().build();
  }
}
