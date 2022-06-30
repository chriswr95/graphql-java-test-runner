package graphql.testrunner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.util.TestRunnerException;

import static graphql.testrunner.service.CommandExecutorService.BUILD_GRAPHQL_JAR;
import static graphql.testrunner.service.CommandExecutorService.BUILD_GRAPHQL_JMH_JAR;
import static graphql.testrunner.service.CommandExecutorService.GRAPHQL_DIR;

@Service
public class PrepareEnvironmentService {

    @Autowired
    private GitService gitService;

    @Autowired
    private CommandExecutorService commandExecutorService;


    public void prepareJars(String commitHash) throws TestRunnerException {
        gitService.checkout(commitHash);
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
