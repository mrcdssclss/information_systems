package com.example.aop;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CacheStatistics {
    @PersistenceUnit
    private EntityManagerFactory emf;

    @Value("${cache.statistics.enabled:true}")
    private boolean enabled;

    @After("execution(* org.springframework.data.repository.Repository+.*(..))")
    public void logStats() {
        if (!enabled) return;

        var stats = emf
                .unwrap(org.hibernate.SessionFactory.class)
                .getStatistics();

        System.out.println("L2 hits: " + stats.getSecondLevelCacheHitCount());
        System.out.println("L2 misses: " + stats.getSecondLevelCacheMissCount());
        System.out.println("L2 puts: " + stats.getSecondLevelCachePutCount());
    }
}
