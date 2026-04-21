package lk.ijse.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/secure")
    public String secureData() {
        return "this is a secure endpoint, you need to be authenticated to access this";
    }

    @GetMapping("/public/info")
    public String publicData() {
        return "this is a public endpoint, anyone can access this without authentication";
    }
}
