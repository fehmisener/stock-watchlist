package com.pearl.stockwatchlist.dto.watchlist;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddWatchlistRequestDto {

  private List<WatchlistItemDto> watchlistItems;
}
