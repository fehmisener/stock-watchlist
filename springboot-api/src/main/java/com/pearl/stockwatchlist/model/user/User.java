package com.pearl.stockwatchlist.model.user;

import com.pearl.stockwatchlist.model.BaseEntity;
import com.pearl.stockwatchlist.model.watchlist.Watchlist;
import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@SQLRestriction(value = "deleted <> true")
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
public class User extends BaseEntity implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NonNull
  @Column(unique = true)
  private String email;

  @NonNull
  @Column(unique = true)
  private String password;

  @OneToMany(mappedBy = "user")
  private List<Watchlist> watchlists;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
