package graphql.testrunner;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.service.CommandExecutorService;

@ExtendWith(MockitoExtension.class)
class TestRunnerApplicationTest {

    @Mock
    private CommandExecutorService commandExecutorService;

    @InjectMocks
    private TestRunnerApplication testRunnerApplication;

    @Test
    void init(){
    }
}
