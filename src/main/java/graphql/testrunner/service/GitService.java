package graphql.testrunner.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import graphql.testrunner.util.TestRunnerException;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.stereotype.Service;

@Service
public class GitService {

    private static final Logger LOGGER = Logger.getLogger(GitService.class.getName());
    private static final String REPO_URL = "https://github.com/graphql-java/graphql-java.git";

    public void pullCode(String commitHash) throws TestRunnerException {
        checkout(cloneRepo(), commitHash);
    }

    private Git cloneRepo() throws TestRunnerException {
        try {
            return Git.cloneRepository()
              .setURI(REPO_URL)
              .call();
        } catch (GitAPIException e) {
            LOGGER.log(Level.SEVERE, "Error in cloning repo:{0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

    private void checkout(Git git, String commitHash) throws TestRunnerException {
        try {
            git.checkout()
              .setCreateBranch(true)
              .setName("new-branch")
              .setStartPoint(commitHash).call();
        } catch (GitAPIException e) {
            LOGGER.log(Level.SEVERE, "Error in checkout repo:{0}", e.getMessage());
            throw new TestRunnerException();
        }
    }
}
