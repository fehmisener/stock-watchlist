package com.pearl.stockwatchlist.model.watchlist;

import com.pearl.stockwatchlist.model.BaseEntity;
import com.pearl.stockwatchlist.model.user.User;
import jakarta.persistence.*;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "watchlists")
@SQLRestriction("deleted <> true")
@SQLDelete(sql = "UPDATE watchlists SET deleted = true WHERE id = ?")
public class Watchlist extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "watchlist", cascade = CascadeType.ALL)
  private List<WatchlistItem> watchlistItems;
}
