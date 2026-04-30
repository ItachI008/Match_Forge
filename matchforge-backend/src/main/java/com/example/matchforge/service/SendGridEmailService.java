package com.example.matchforge.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class SendGridEmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @PostConstruct
    public void init() {
        System.out.println("========================================");
        System.out.println("SendGrid From Email: " + fromEmail);
        System.out.println("SendGrid API Key present: " + (apiKey != null && apiKey.startsWith("SG.")));
        System.out.println("========================================");
    }

    @Async
    public void sendEmail(String toEmail, String subject, String body) {
        System.out.println("========================================");
        System.out.println("Attempting to send email...");
        System.out.println("From: " + fromEmail);
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("========================================");

        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            System.out.println("SendGrid status code: " + response.getStatusCode());
            System.out.println("SendGrid body: " + response.getBody());
            System.out.println("SendGrid X-Message-Id: " +
                response.getHeaders().get("X-Message-Id"));

            if (response.getStatusCode() == 202) {
                System.out.println("Email accepted by SendGrid. Check spam if not received.");
            } else {
                System.err.println("Unexpected status: " + response.getStatusCode());
                System.err.println("Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("SendGrid exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}