package com.pearl.stockwatchlist.dto.watchlist;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WatchlistDto {

  private Long id;
  private Long userId;
  private List<WatchlistItemDto> watchlistItems;
}
