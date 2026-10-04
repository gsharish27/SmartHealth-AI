package com.healthmonitoring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username:postgres}")
    private String dbUsername;

    @Value("${spring.datasource.password:postgres}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = dbUrl;
        String username = dbUsername;
        String password = dbPassword;

        if (url != null) {
            // Handle postgres:// or postgresql:// without jdbc: prefix
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(url);
                    if (uri.getUserInfo() != null && uri.getUserInfo().contains(":")) {
                        String[] userInfo = uri.getUserInfo().split(":");
                        username = userInfo[0];
                        password = userInfo[1];
                    }
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    url = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath();
                } catch (Exception e) {
                    url = url.replace("postgres://", "jdbc:postgresql://");
                }
            }
        }

        DataSourceBuilder<?> builder = DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(url);

        if (username != null && !username.isBlank()) {
            builder.username(username);
        }
        if (password != null && !password.isBlank()) {
            builder.password(password);
        }

        return builder.build();
    }
}
