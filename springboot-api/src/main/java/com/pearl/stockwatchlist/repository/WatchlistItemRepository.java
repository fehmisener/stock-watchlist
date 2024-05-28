package com.pearl.stockwatchlist.repository;

import com.pearl.stockwatchlist.model.user.User;
import com.pearl.stockwatchlist.model.watchlist.WatchlistItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
  Optional<Object> findBySymbolAndWatchlist_User(String symbol, User user);
}
