package graphql.testrunner.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.dto.Job;
import graphql.testrunner.exception.TestRunnerException;

import static java.util.Objects.nonNull;

import static graphql.testrunner.service.CommandExecutorService.TEST_RUN;

@Service
public class TestRunnerService {

    @Autowired
    private PrepareEnvironmentService prepareEnvironmentService;

    @Autowired
    private CommandExecutorService commandExecutorService;

    public void runTest(Job job) throws TestRunnerException {
        prepareEnvironmentService.prepareJar(job);
        verifyAndExecuteTestToRun(job);
    }

    private void verifyAndExecuteTestToRun(Job job) {
        List<String> classesToTest = job.getClasses();
        if (nonNull(classesToTest) && !classesToTest.isEmpty()) {
            executeTestOnSuppliedClasses(classesToTest);
        } else {
            executeAllTest();
        }
    }

    private void executeAllTest() {
        commandExecutorService.executeCommand(TEST_RUN);
    }

    private void executeTestOnSuppliedClasses(List<String> classesToTest) {
        commandExecutorService.executeCommand(prepareCombinedClassesToTestCommand(classesToTest));
    }

    /**
     * This prepares the optional arguments to be passed to the test runner command.
     * The jmh test jar can take class names to test as space separated values.
     *
     * eg: java -jar graphql-java-test-runner-jmh.jar AddError XYZClassName
     *
     * @param classesToTest
     * @return
     */
    private List<String> prepareCombinedClassesToTestCommand(List<String> classesToTest) {
        StringBuilder combinedClasses = new StringBuilder();
        List<String> command = new ArrayList<>();
        command.addAll(TEST_RUN);

        for (String c : classesToTest) combinedClasses.append(" ").append(c);
        command.set(2, command.get(2).concat(combinedClasses.toString()));
        return command;
    }

}
