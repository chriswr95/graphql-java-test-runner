package graphql.testrunner.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.document.TestStatistics;
import graphql.testrunner.dto.Job;

import static java.util.Arrays.asList;

import static org.mockito.ArgumentMatchers.eq;
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
      "java -jar graphql-java/build/libs/graphql-java-test-runner-jmh.jar -rf json -rff result.json");

    @Test
    void runTestForAllClasses() {
        Job job = new Job();
        testRunnerService.runTest(job);

        verify(prepareEnvironmentService).prepareJar(eq(job));
        verify(commandExecutorService).executeCommand(eq(TEST_RUN));
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

    @Test
    void readResultJson() {
        List<TestStatistics> testStatistics = new ArrayList<>();
        try {
            testStatistics = new ObjectMapper().readValue(new File("result.json"),
                new TypeReference<List<TestStatistics>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println( testStatistics);
    }
}
