package graphql.testrunner.service;

import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.InvalidRemoteException;
import org.eclipse.jgit.api.errors.TransportException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.exception.TestRunnerException;

@Service
public class GitService {

    private static final Logger LOGGER = Logger.getLogger(GitService.class.getName());
    private static final String BRANCH = "new-branch-";
    private static final String REMOTE = "origin";

    @Autowired
    private Git git;

    public void checkout(UUID jobId, String commitHash) throws TestRunnerException {
        try {
            fetch();
            git.checkout()
              .setCreateBranch(true)
              .setName(BRANCH + jobId)
              .setStartPoint(commitHash.trim()).call();
        } catch (GitAPIException e) {
            LOGGER.log(Level.SEVERE, "Error in checkout repo: {0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

    private void fetch() {
        try {
            git.fetch().setRemote(REMOTE).call();
        } catch (InvalidRemoteException e) {
            LOGGER.log(Level.SEVERE, "Invalid remote : {0}", e.getMessage());
            throw new TestRunnerException();
        } catch (TransportException e) {
            LOGGER.log(Level.SEVERE, "Transport operation failed : {0}", e.getMessage());
            throw new TestRunnerException();
        } catch (GitAPIException e) {
            LOGGER.log(Level.SEVERE, "Error in fetch operation: {0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

}
