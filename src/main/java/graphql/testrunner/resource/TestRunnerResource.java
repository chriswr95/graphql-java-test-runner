package graphql.testrunner.resource;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import graphql.testrunner.service.TestRunnerService;

import static java.util.Objects.nonNull;

@RestController
public class TestRunnerResource {

    @Autowired
    private TestRunnerService testRunnerService;

    @PostMapping("/test-runner")
    public void runTest(@RequestBody Map<String, String> commitHash) {
        if (nonNull(commitHash) || !commitHash.containsKey("commit_hash"))
            testRunnerService.runTest(commitHash.get("commit_hash"));
    }

    @GetMapping("/")
    public String home() {
        return "Hello Docker World";
    }
}
