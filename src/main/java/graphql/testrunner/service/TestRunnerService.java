package graphql.testrunner.service;

import graphql.testrunner.exception.TestRunnerException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestRunnerService {

    @Autowired
    private PrepareEnvironmentService prepareEnvironmentService;

    public void runTest(String commitHash) throws TestRunnerException {
        prepareEnvironmentService.prepareJar(commitHash);

        //run jmh tests
    }



}
