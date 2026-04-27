# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Add new user for run spring boot application for security reasons
RUN addgroup --gid 10001 spring && \
    adduser --uid 10001 --gid 10001 --disabled-password --gecos "" spring
USER 10001
ENTRYPOINT ["java", "-jar", "app.jar"]
