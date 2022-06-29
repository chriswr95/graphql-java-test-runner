package graphql.testrunner;

import graphql.testrunner.service.CommandExecutorService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static java.util.Arrays.asList;

@SpringBootApplication
public class TestRunnerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestRunnerApplication.class, args);
	}

	@Bean
	public CommandLineRunner initGit(CommandExecutorService commandExecutorService) {
		return args -> {
			commandExecutorService.executeCommand(asList("sh", "-c", "apk add --no-cache git"));
		};
	}

}
