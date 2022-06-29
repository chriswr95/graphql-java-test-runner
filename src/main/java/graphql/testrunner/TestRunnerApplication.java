package graphql.testrunner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import graphql.testrunner.service.CommandExecutorService;

import static graphql.testrunner.service.CommandExecutorService.INSTALL_GIT;

@SpringBootApplication
public class TestRunnerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestRunnerApplication.class, args);
	}

	@Bean
	public CommandLineRunner initGit(CommandExecutorService commandExecutorService) {
		return args -> {
			commandExecutorService.executeCommand(INSTALL_GIT);
		};
	}

}
