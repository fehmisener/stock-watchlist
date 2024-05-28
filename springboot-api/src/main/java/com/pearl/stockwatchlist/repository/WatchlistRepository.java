package com.pearl.stockwatchlist.repository;

import com.pearl.stockwatchlist.model.watchlist.Watchlist;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

  List<Watchlist> findByUserId(Long userId);
}
