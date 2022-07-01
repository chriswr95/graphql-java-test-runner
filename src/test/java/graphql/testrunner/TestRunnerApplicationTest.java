package graphql.testrunner;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.CommandLineRunner;

import graphql.testrunner.service.CommandExecutorService;

import static java.util.Arrays.asList;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class TestRunnerApplicationTest {

    private static final List<String> INSTALL_GIT = asList("sh", "-c", "apk add --no-cache git");

    @Mock
    private CommandExecutorService commandExecutorService;

    @InjectMocks
    private TestRunnerApplication testRunnerApplication;

    @Test
    void initGit() throws Exception {
        CommandLineRunner cmd = testRunnerApplication.initGit(commandExecutorService);
        cmd.run("");
        verify(commandExecutorService).executeCommand(eq(INSTALL_GIT));
    }
}
