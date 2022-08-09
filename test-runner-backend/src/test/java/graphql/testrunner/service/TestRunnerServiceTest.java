package graphql.testrunner.service;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.dto.Job;

import static java.util.Arrays.asList;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TestRunnerServiceTest {

    @Mock
    private PrepareEnvironmentService prepareEnvironmentService;

    @Mock
    private CommandExecutorService commandExecutorService;

    @Mock
    private TestResultService testResultService;

    @InjectMocks
    private TestRunnerService testRunnerService;

    private static final List<String> TEST_RUN = asList("sh", "-c",
      "java -jar graphql-java/build/libs/graphql-java-test-runner-jmh.jar -rf json -rff result.json > output.log");

    @Test
    void runTestForAllClasses() {
        Job job = new Job();
        testRunnerService.runTest(job);

        verify(prepareEnvironmentService).prepareJar(eq(job));
        verify(commandExecutorService).executeCommand(eq(TEST_RUN));

        InOrder inOrder = inOrder(testResultService);
        inOrder.verify(testResultService).saveInitialTestResult(eq(job));
        inOrder.verify(testResultService).saveFinalTestResult(eq(job));
    }

    @Test
    void runTestForCustomClasses() {
        Job job = new Job();
        job.setClasses(asList("AddError", "IntBenchMark"));
        testRunnerService.runTest(job);
        List<String> command = new ArrayList<>();
        command.addAll(TEST_RUN);
        command.set(2, command.get(2).concat(" AddError IntBenchMark"));

        verify(prepareEnvironmentService).prepareJar(eq(job));
        verify(commandExecutorService).executeCommand(eq(command));
    }


}
