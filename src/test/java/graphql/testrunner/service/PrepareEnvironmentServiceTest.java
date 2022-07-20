package graphql.testrunner.service;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.dto.Job;

import static java.util.Arrays.asList;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PrepareEnvironmentServiceTest {

    @Mock
    private GitService gitService;

    @Mock
    private CommandExecutorService commandExecutorService;

    @InjectMocks
    private PrepareEnvironmentService prepareEnvironmentService;

    private static final String GRAPHQL_DIR = "graphql-java/";
    private static final List<String> BUILD_GRAPHQL_JMH_JAR = asList("sh", "-c", "RELEASE_VERSION=test-runner-jmh ./gradlew jmhJar");

    @Test
    void prepareJars() {
        UUID jobId = UUID.randomUUID();
        Job job = new Job();
        job.setJobId(jobId);
        job.setCommitHash("abc123");
        
        prepareEnvironmentService.prepareJar(job);

        verify(gitService).checkout(eq(jobId), eq("abc123"));
        verify(commandExecutorService).executeCommandInDir(eq(BUILD_GRAPHQL_JMH_JAR), eq(GRAPHQL_DIR));
    }
}
