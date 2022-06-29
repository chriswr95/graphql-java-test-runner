package graphql.testrunner.service;

import java.util.List;

import graphql.testrunner.util.TestRunnerException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static java.util.Arrays.asList;

@Service
public class PrepareEnvironmentService {

    private static final String GRAPHQL_DIR = "/app/graphql-java/";
    private static final List<String> BUILD_GRAPHQL_JAR = asList("sh", "-c", "RELEASE_VERSION=test-runner ./gradlew build");
    private static final List<String> BUILD_GRAPHQL_JMH_JAR = asList("RELEASE_VERSION=test-runner-jmh", "./gradlew jmhJar");

    @Autowired
    private GitService gitService;

    @Autowired
    private CommandExecutorService commandExecutorService;

    /**
     * Clones the graphql-java project and prepares the jars required for tests.
     *
     * @param commitHash
     * @throws TestRunnerException
     */
    public void prepareJars(String commitHash) throws TestRunnerException {
        gitService.pullCode(commitHash);
        buildGraphqlJar();
        buildGraphqlJMHJar();
    }

    private void buildGraphqlJar() throws TestRunnerException {
        commandExecutorService.executeCommandInDir(BUILD_GRAPHQL_JAR, GRAPHQL_DIR);
    }

    private void buildGraphqlJMHJar() throws TestRunnerException {
        commandExecutorService.executeCommandInDir(BUILD_GRAPHQL_JMH_JAR, GRAPHQL_DIR);
    }

}
