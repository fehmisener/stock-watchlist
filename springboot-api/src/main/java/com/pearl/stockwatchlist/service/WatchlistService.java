package com.pearl.stockwatchlist.service;

import com.pearl.stockwatchlist.dto.mapper.WatchlistMapper;
import com.pearl.stockwatchlist.dto.watchlist.AddWatchlistRequestDto;
import com.pearl.stockwatchlist.dto.watchlist.WatchlistDto;
import com.pearl.stockwatchlist.model.user.User;
import com.pearl.stockwatchlist.model.watchlist.Watchlist;
import com.pearl.stockwatchlist.model.watchlist.WatchlistItem;
import com.pearl.stockwatchlist.repository.UserRepository;
import com.pearl.stockwatchlist.repository.WatchlistItemRepository;
import com.pearl.stockwatchlist.repository.WatchlistRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WatchlistService {

  private static final Logger logger = LoggerFactory.getLogger(WatchlistService.class);

  private final WatchlistRepository watchlistRepository;
  private final WatchlistItemRepository watchlistItemRepository;
  private final UserRepository userRepository;
  private final WatchlistMapper watchlistMapper;

  public WatchlistService(
      WatchlistRepository watchlistRepository,
      WatchlistItemRepository watchlistItemRepository,
      UserRepository userRepository,
      WatchlistMapper watchlistMapper) {
    this.watchlistRepository = watchlistRepository;
    this.watchlistItemRepository = watchlistItemRepository;
    this.userRepository = userRepository;
    this.watchlistMapper = watchlistMapper;
  }

  public List<WatchlistDto> getWatchlistsByUserId(Long userId) {
    logger.info("Getting watchlist for user with id: {}", userId);
    return watchlistMapper.toWatchlistDto(watchlistRepository.findByUserId(userId));
  }

  public WatchlistDto addWatchlist(Long userId, AddWatchlistRequestDto addWatchlistRequestDto) {
    logger.info("Adding watchlist for user with id: {}", userId);

    if (addWatchlistRequestDto.getWatchlistItems().isEmpty()) {
      throw new RuntimeException("Watchlist items cannot be empty");
    }

    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getWatchlists().isEmpty()) {
      Watchlist watchlist = new Watchlist();
      watchlist.setUser(user);
      watchlist.setWatchlistItems(
          addWatchlistRequestDto.getWatchlistItems().stream()
              .map(dto -> new WatchlistItem(watchlist, dto.getSymbol()))
              .toList());

      return watchlistMapper.toWatchlistDto(watchlistRepository.save(watchlist));
    } else {
      Watchlist existingWatchlist = user.getWatchlists().get(0);

      watchlistRepository.delete(existingWatchlist);

      List<WatchlistItem> newWatchlistItems =
          addWatchlistRequestDto.getWatchlistItems().stream()
              .map(dto -> new WatchlistItem(existingWatchlist, dto.getSymbol()))
              .toList();

      existingWatchlist.setWatchlistItems(newWatchlistItems);

      return watchlistMapper.toWatchlistDto(watchlistRepository.save(existingWatchlist));
    }
  }

  @Transactional
  public void deleteWatchlistItem(Long userId, String symbol) {

    User user =
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    WatchlistItem watchlistItem =
        (WatchlistItem)
            watchlistItemRepository.findBySymbolAndWatchlist_User(symbol, user).orElse(null);

    if (watchlistItem != null) {
      watchlistItemRepository.delete(watchlistItem);
    }
  }
}
