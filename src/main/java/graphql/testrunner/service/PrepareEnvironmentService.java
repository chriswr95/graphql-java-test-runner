package graphql.testrunner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.exception.TestRunnerException;

import static graphql.testrunner.service.CommandExecutorService.BUILD_GRAPHQL_JMH_JAR;
import static graphql.testrunner.service.CommandExecutorService.GRAPHQL_DIR;

@Service
public class PrepareEnvironmentService {

    @Autowired
    private GitService gitService;

    @Autowired
    private CommandExecutorService commandExecutorService;


    public void prepareJar(String commitHash) throws TestRunnerException {
        gitService.checkout(commitHash);
        buildGraphqlJMHJar();
    }

    private void buildGraphqlJMHJar() throws TestRunnerException {
        commandExecutorService.executeCommandInDir(BUILD_GRAPHQL_JMH_JAR, GRAPHQL_DIR);
    }

}
