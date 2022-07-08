package graphql.testrunner.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jgit.api.CheckoutCommand;
import org.eclipse.jgit.api.FetchCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.EmptyCommitException;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.dto.Job;
import graphql.testrunner.exception.TestRunnerException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.isA;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static graphql.testrunner.TestUtils.setFinalStatic;

@ExtendWith(MockitoExtension.class)
class GitServiceTest {

    @Mock
    private Git git;

    @Mock
    private CheckoutCommand checkoutCommand;

    @Mock
    private FetchCommand fetchCommand;

    @Mock
    private static Logger LOGGER;

    @InjectMocks
    private GitService gitService;

    private Job job = new Job();

    @BeforeEach
    public void before() {
        job.setCommitHash("8abc12345fdfd");
        when(git.fetch()).thenReturn(fetchCommand);
        when(fetchCommand.setRemote(eq("origin"))).thenReturn(fetchCommand);
    }

    @Test
    void checkout() throws GitAPIException {

        when(git.checkout()).thenReturn(checkoutCommand);
        when(checkoutCommand.setCreateBranch(eq(true))).thenReturn(checkoutCommand);
        when(checkoutCommand.setName(eq("new-branch-" + job.getJobId()))).thenReturn(checkoutCommand);
        when(checkoutCommand.setStartPoint(eq("8abc12345fdfd"))).thenReturn(checkoutCommand);

        gitService.checkout(job);
        verify(checkoutCommand).call();
        verify(fetchCommand).call();
    }

    @Test
    void checkoutWhenGitAPIExceptionIsThrown() throws Exception {
        when(git.checkout()).thenReturn(checkoutCommand);
        when(checkoutCommand.setCreateBranch(eq(true))).thenReturn(checkoutCommand);
        when(checkoutCommand.setName(eq("new-branch-" + job.getJobId()))).thenReturn(checkoutCommand);
        when(checkoutCommand.setStartPoint(eq("8abc12345fdfd"))).thenReturn(checkoutCommand);
        when(checkoutCommand.call()).thenThrow(new EmptyCommitException("Commit empty"));
        setFinalStatic(GitService.class.getDeclaredField("LOGGER"), LOGGER);

        try {
            gitService.checkout(job);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        verify(fetchCommand).call();
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error in checkout repo: {0}"),
          eq("Commit empty"));
    }
}
