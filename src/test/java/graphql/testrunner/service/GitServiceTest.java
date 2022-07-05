package graphql.testrunner.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jgit.api.CheckoutCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.EmptyCommitException;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.util.TestRunnerException;

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
    private static Logger LOGGER;

    @InjectMocks
    private GitService gitService;

    @Test
    void checkout() throws GitAPIException {
        when(git.checkout()).thenReturn(checkoutCommand);
        when(checkoutCommand.setCreateBranch(eq(true))).thenReturn(checkoutCommand);
        when(checkoutCommand.setName(eq("new-branch"))).thenReturn(checkoutCommand);
        when(checkoutCommand.setStartPoint(eq("abc123abc"))).thenReturn(checkoutCommand);

        gitService.checkout("abc123abc");
        verify(checkoutCommand).call();
    }

    @Test
    void checkoutWhenGitAPIExceptionIsThrown() throws Exception {
        when(git.checkout()).thenReturn(checkoutCommand);
        when(checkoutCommand.setCreateBranch(eq(true))).thenReturn(checkoutCommand);
        when(checkoutCommand.setName(eq("new-branch"))).thenReturn(checkoutCommand);
        when(checkoutCommand.setStartPoint(eq("abc123abc"))).thenReturn(checkoutCommand);
        when(checkoutCommand.call()).thenThrow(new EmptyCommitException("Commit empty"));
        setFinalStatic(GitService.class.getDeclaredField("LOGGER"), LOGGER);

        try {
            gitService.checkout("abc123abc");
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error in checkout repo: {0}"),
          eq("Commit empty"));
    }
}
