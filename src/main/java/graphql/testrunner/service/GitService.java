package graphql.testrunner.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.util.TestRunnerException;

@Service
public class GitService {

    private static final Logger LOGGER = Logger.getLogger(GitService.class.getName());
    private static final String BRANCH = "new-branch";

    @Autowired
    private Git git;

    public void checkout(String commitHash) throws TestRunnerException {
        try {
            git.checkout()
              .setCreateBranch(true)
              .setName(BRANCH)
              .setStartPoint(commitHash).call();
        } catch (GitAPIException e) {
            LOGGER.log(Level.SEVERE, "Error in checkout repo: {0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

}
