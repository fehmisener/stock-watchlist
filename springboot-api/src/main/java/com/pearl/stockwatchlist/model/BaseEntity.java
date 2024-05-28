package com.pearl.stockwatchlist.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

  @CreatedDate
  @Temporal(TemporalType.TIMESTAMP)
  private LocalDateTime createdDate;

  @LastModifiedDate
  @Temporal(TemporalType.TIMESTAMP)
  private LocalDateTime lastModifiedDate;

  @Column(name = "deleted")
  private boolean deleted = false;
}
