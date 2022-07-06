package graphql.testrunner;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import graphql.testrunner.util.TestRunnerException;

@SpringBootApplication
public class TestRunnerApplication {

	private static final Logger LOGGER = Logger.getLogger(TestRunnerApplication.class.getName());
	private static final String REPO_URL = "https://github.com/graphql-java/graphql-java.git";

	public static void main(String[] args) {
		SpringApplication.run(TestRunnerApplication.class, args);
	}

	@Bean
	public Git git() {
		try {
			return Git.cloneRepository()
			.setURI(REPO_URL)
			.call();
		} catch (GitAPIException e) {
			LOGGER.log(Level.SEVERE, "Error in cloning repo:{0}", e.getMessage());
			throw new TestRunnerException();
		}
	}

}
