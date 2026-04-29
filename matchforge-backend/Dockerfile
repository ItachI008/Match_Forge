# Build stage
FROM amazoncorretto:17-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and source code
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the wrapper executable
RUN chmod +x mvnw

# Download dependencies (cached)
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17-alpine

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]