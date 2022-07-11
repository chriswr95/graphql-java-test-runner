package graphql.testrunner.resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import graphql.testrunner.dto.Job;
import graphql.testrunner.service.TestRunnerService;

import static java.util.Objects.nonNull;

import static org.apache.logging.log4j.util.Strings.isEmpty;

@RestController
public class TestRunnerResource {

    @Autowired
    private TestRunnerService testRunnerService;

    @PostMapping("/test-runner")
    public void runTest(@RequestBody Job job) {
        String commitHash = job.getCommitHash();
        if (nonNull(commitHash) && !isEmpty(commitHash))
            testRunnerService.runTest(job);
        //TODO fail the job and save to the database
    }

    @GetMapping("/")
    public String home() {
        return "Hello Docker World";
    }
}
