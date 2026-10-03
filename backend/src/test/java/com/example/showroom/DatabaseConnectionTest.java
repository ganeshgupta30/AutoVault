package com.example.showroom;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class DatabaseConnectionTest {

    @Test
    public void testSupabaseConnection() throws Exception {
        String url = "jdbc:postgresql://aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require";
        String user = "postgres.bseczgbpatmbjxjsombh";
        String password = "Ganesh@9321023512";

        System.out.println("\n==============================================");
        System.out.println("Testing connection to Supabase PostgreSQL...");
        System.out.println("==============================================");

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT version(), current_database(), current_user;")) {

            assertTrue(rs.next(), "Should retrieve at least one row");

            System.out.println(">>> SUPABASE CONNECTION SUCCESSFUL! <<<");
            System.out.println("PostgreSQL Version : " + rs.getString(1));
            System.out.println("Database Name      : " + rs.getString(2));
            System.out.println("Connected User     : " + rs.getString(3));
            System.out.println("==============================================\n");
        }
    }
}
