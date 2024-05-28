package com.pearl.stockwatchlist.dto.mapper;

import com.pearl.stockwatchlist.dto.watchlist.WatchlistDto;
import com.pearl.stockwatchlist.model.watchlist.Watchlist;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WatchlistMapper {

  List<WatchlistDto> toWatchlistDto(List<Watchlist> watchlist);

  @Mapping(target = "userId", source = "user.id")
  @Mapping(target = "watchlistItems", source = "watchlistItems")
  WatchlistDto toWatchlistDto(Watchlist watchlist);
}
