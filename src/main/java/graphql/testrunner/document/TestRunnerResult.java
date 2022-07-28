package graphql.testrunner.document;

import java.util.List;

import com.google.cloud.firestore.FieldValue;

public class TestRunnerResult {

    public String coreName;
    public FieldValue startTime;
    public FieldValue finishTime;
    public List<TestStatistics> testStatistics;

    public TestRunnerResult() {
    }

}
