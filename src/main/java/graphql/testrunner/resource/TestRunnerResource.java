package graphql.testrunner.resource;

import graphql.testrunner.service.TestRunnerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestRunnerResource {

  @Autowired
  private TestRunnerService testRunnerService;

  @PostMapping("/test-runner/{commitHash}")
  public void runTest(@PathVariable String commitHash) {
      System.out.println("######################    in run test commit hash   ######### : "+ commitHash);

      testRunnerService.runTest(commitHash);
  }

  @GetMapping("/")
  public String home() {
      return "Hello Docker World";
  }
}
