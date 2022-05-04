package com.app_pke.webconv;
import java.util.ResourceBundle;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebConvApplication {

	public static ResourceBundle config;

	public static void main(String[] args) {
		config = ResourceBundle.getBundle("application");
		SpringApplication.run(WebConvApplication.class, args);
	}

}
