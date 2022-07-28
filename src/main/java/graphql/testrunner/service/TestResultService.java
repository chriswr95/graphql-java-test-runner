package graphql.testrunner.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.document.TestStatistics;
import graphql.testrunner.dto.Job;
import graphql.testrunner.exception.TestRunnerException;
import graphql.testrunner.repository.FirestoreWriter;

import static com.google.cloud.firestore.FieldValue.serverTimestamp;

import static graphql.testrunner.document.Status.FINISHED;
import static graphql.testrunner.document.Status.RUNNING;

@Service
public class TestResultService {

    private static final String CORE = "core_" + ((Runtime.getRuntime().availableProcessors() > 2) ? 32 : 2);
    private static final String COMMIT_HASH_KEY = "commitHash";
    private static final String STATUS_KEY = "status."+ CORE;
    private static final String TEST_RUNNER_RESULT_KEY = "testRunnerResults." + CORE;
    private static final String TEST_START_TIME_KEY =  TEST_RUNNER_RESULT_KEY + ".startTime";
    private static final String TEST_FINISH_TIME_KEY =  TEST_RUNNER_RESULT_KEY + ".finishTime";
    private static final String TEST_STATISTICS_KEY =  TEST_RUNNER_RESULT_KEY + ".testStatistics";
    private static final String FILE_NAME = "result.json";

    @Autowired
    private FirestoreWriter firestoreWriter;

    public void saveInitialTestResult(Job job) {
        Map<String, Object> updates = new HashMap<>();
        updates.put(COMMIT_HASH_KEY, job.getCommitHash());
        updates.put(STATUS_KEY, RUNNING);
        updates.put(TEST_START_TIME_KEY, serverTimestamp());
        firestoreWriter.updateDocument(job.getJobId(), updates);
    }

    public void saveFinalTestResult(Job job) {
        Map<String, Object> updates = new HashMap<>();
        updates.put(STATUS_KEY, FINISHED);
        updates.put(TEST_FINISH_TIME_KEY, serverTimestamp());
        updates.put(TEST_STATISTICS_KEY, readResultJson());
        firestoreWriter.updateDocument(job.getJobId(), updates);
    }

    private List<TestStatistics> readResultJson() {
        try {
            return new ObjectMapper().readValue(new File(FILE_NAME),
                new TypeReference<List<TestStatistics>>() {});
        } catch (IOException ex) {
            throw new TestRunnerException("Error in reading result.json" + ex.getMessage());
        }
    }
}
