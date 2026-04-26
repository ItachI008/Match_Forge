package com.example.matchforge.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public GroqService(@Value("${groq.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

   public String chat(String prompt) {
    Map<String, Object> request = Map.of(
            "model", "llama-3.3-70b-versatile", 
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "temperature", 0.7
    );

        try {
            String jsonResponse = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            response -> response.bodyToMono(String.class).flatMap(body -> {
                                System.err.println("Groq API error: " + body);
                                return Mono.error(new RuntimeException("Groq API error: " + body));
                            }))
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = mapper.readTree(jsonResponse);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Groq call failed", e);
        }
    }
}