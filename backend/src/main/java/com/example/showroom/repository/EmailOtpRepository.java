package com.example.showroom.repository;

import com.example.showroom.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    // Find the latest unused OTP for an email
    Optional<EmailOtp> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);

    // Count OTPs generated for an email within a time window (rate limiting)
    @Query("SELECT COUNT(o) FROM EmailOtp o WHERE o.email = :email AND o.createdAt > :since")
    long countRecentOtpsByEmail(@Param("email") String email, @Param("since") LocalDateTime since);
}
