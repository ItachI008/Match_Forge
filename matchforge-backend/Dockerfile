# Use Eclipse Temurin (official OpenJDK distribution) as base
FROM eclipse-temurin:17-jdk-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the source code
COPY . .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Build the application (skip tests to speed up)
RUN ./mvnw clean package -DskipTests

# Use a lightweight JDK for runtime
FROM eclipse-temurin:17-jre-slim

# Set the working directory
WORKDIR /app

# Copy the jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]