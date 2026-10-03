# Multi-stage build for Spring Boot
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage (Optimized for 512MB Free Tier)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080 10000

# Low-memory JVM flags: SerialGC + 320MB Max Heap prevents OOM on Render
ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xms128m -Xmx320m -XX:MaxMetaspaceSize=128m -Dserver.port=${PORT:-8080} -jar app.jar"]
