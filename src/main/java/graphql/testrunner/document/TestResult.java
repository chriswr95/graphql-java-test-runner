package graphql.testrunner.document;


import java.util.List;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.spring.data.firestore.Document;

@Document(collectionName = "test-runs")
public class TestResult {

    @DocumentId
    private String jobId;
    private Status status;
    private String commitHash;
    private List<TestRunnerResult> testRunnerResults;

    public String getJobId() {
      return jobId;
    }

    public void setJobId(String jobId) {
      this.jobId = jobId;
    }

    public Status getStatus() {
      return status;
    }

    public void setStatus(Status status) {
      this.status = status;
    }

    public String getCommitHash() {
      return commitHash;
    }

    public void setCommitHash(String commitHash) {
      this.commitHash = commitHash;
    }

    public List<TestRunnerResult> getTestRunnerResults() {
      return testRunnerResults;
    }

    public void setTestRunnerResults(List<TestRunnerResult> testRunnerResults) {
      this.testRunnerResults = testRunnerResults;
    }
}
