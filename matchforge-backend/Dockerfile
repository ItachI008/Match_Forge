# Use an official JDK 17 runtime as base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and source code
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Package the application (skip tests for speed)
RUN ./mvnw clean package -DskipTests

# Expose the port your app listens on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "target/*.jar"]