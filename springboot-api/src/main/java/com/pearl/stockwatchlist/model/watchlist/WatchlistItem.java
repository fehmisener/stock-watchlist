package com.pearl.stockwatchlist.model.watchlist;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "watchlist_items")
public class WatchlistItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NonNull
  @ManyToOne
  @JoinColumn(name = "watchlist_id")
  private Watchlist watchlist;

  @NonNull private String symbol;
}
