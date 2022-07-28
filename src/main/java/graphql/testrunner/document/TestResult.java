package graphql.testrunner.document;


import java.util.Map;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.spring.data.firestore.Document;

@Document(collectionName = "test-runs")
public class TestResult {

    @DocumentId
    public String jobId;
    public Map<String, Status> status;
    public String commitHash;
    public Map<String, TestRunnerResult> testRunnerResults;

}
