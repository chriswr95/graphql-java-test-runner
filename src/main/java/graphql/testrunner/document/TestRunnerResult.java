package graphql.testrunner.document;

import java.util.List;

public class TestRunnerResult {

    public String coreName;
    public List<TestStatistics> testStatistics;

    public TestRunnerResult() {
    }

    public TestRunnerResult(String coreName, List<TestStatistics> testStatistics) {
      this.coreName = coreName;
      this.testStatistics = testStatistics;
    }
}
