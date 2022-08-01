package graphql.testrunner.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.firestore.FieldValue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.document.TestStatistics;
import graphql.testrunner.dto.Job;
import graphql.testrunner.exception.TestRunnerException;
import graphql.testrunner.repository.FirestoreWriter;

import static java.util.UUID.randomUUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isA;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.util.AssertionErrors.assertTrue;

import static graphql.testrunner.document.Status.FINISHED;
import static graphql.testrunner.document.Status.RUNNING;

@ExtendWith(MockitoExtension.class)
class TestResultServiceTest {

    @Mock
    private FirestoreWriter firestoreWriter;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private File file;

    @Captor
    private ArgumentCaptor<Map<String, Object>> updateCaptor;

    private static final String CORE = "core_" + ((Runtime.getRuntime().availableProcessors() > 2) ? 32 : 2);
    private static final String COMMIT_HASH_KEY = "commitHash";
    private static final String STATUS_KEY = "status."+ CORE;
    private static final String TEST_RUNNER_RESULT_KEY = "testRunnerResults." + CORE;
    private static final String TEST_START_TIME_KEY =  TEST_RUNNER_RESULT_KEY + ".startTime";
    private static final String TEST_FINISH_TIME_KEY =  TEST_RUNNER_RESULT_KEY + ".finishTime";
    private static final String TEST_STATISTICS_KEY =  TEST_RUNNER_RESULT_KEY + ".testStatistics";


    @InjectMocks
    private TestResultService testResultService = new TestResultService() {
        @Override
        File getResultJsonFile(){
            return new File("src/test/resources/test-result.json");
        }
    };

    @InjectMocks
    private TestResultService testResultService2 = new TestResultService() {
        @Override
        File getResultJsonFile(){
            return file;
        }
        @Override
        ObjectMapper getObjectMapper() {
            return objectMapper;
        }
    };


    @Test
    void saveInitialTestResult() {
        Job job = new Job();
        job.setJobId(randomUUID());
        testResultService.saveInitialTestResult(job);
        verify(firestoreWriter).updateDocument(eq(job.getJobId()), updateCaptor.capture());

        Map<String, Object> expectedUpdates = updateCaptor.getValue();
        assertThat(expectedUpdates.size(), is(3));
        assertTrue("The status of job in the machine", expectedUpdates.containsKey(STATUS_KEY));
        assertTrue("Test start time", expectedUpdates.containsKey(TEST_START_TIME_KEY));
        assertTrue("Commit hash of job ", expectedUpdates.containsKey(COMMIT_HASH_KEY));

        assertThat(expectedUpdates.get(STATUS_KEY), is(RUNNING));
        assertThat(expectedUpdates.get(TEST_START_TIME_KEY), instanceOf(FieldValue.class));
    }

    @Test
    void saveFinalTestResult() {
        Job job = new Job();
        job.setJobId(randomUUID());
        testResultService.saveFinalTestResult(job);
        verify(firestoreWriter).updateDocument(eq(job.getJobId()), updateCaptor.capture());

        Map<String, Object> expectedUpdates = updateCaptor.getValue();
        assertThat(expectedUpdates.size(), is(3));
        assertTrue("The status of job in the machine", expectedUpdates.containsKey(STATUS_KEY));
        assertTrue("Test finish time", expectedUpdates.containsKey(TEST_FINISH_TIME_KEY));
        assertTrue("Test statistics ", expectedUpdates.containsKey(TEST_STATISTICS_KEY));

        assertThat(expectedUpdates.get(STATUS_KEY), is(FINISHED));
        assertThat(expectedUpdates.get(TEST_FINISH_TIME_KEY), instanceOf(FieldValue.class));

        List<TestStatistics> testStatistics = (List<TestStatistics>)expectedUpdates.get(TEST_STATISTICS_KEY);
        assertThat(testStatistics.get(0).primaryMetric.rawData, is("[[24.723610439506174,25.38902299746193]," +
            "[29.309346084795322,27.008850377358492],[26.820389268096516,25.351490670886076]]"));
    }

    @Test
    void saveFinalTestResultThrowsTestRunnerException() throws IOException {
        Job job = new Job();
        job.setJobId(randomUUID());
        when(objectMapper.readValue(eq(file), any(TypeReference.class))).thenThrow(new IOException("IO Error"));
        try {
            testResultService2.saveFinalTestResult(job);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
            assertEquals("Error in reading result.json: IO Error", ex.getMessage());
        }
        verify(firestoreWriter, never()).updateDocument(eq(job.getJobId()), updateCaptor.capture());
    }

    @Test
    void getResultJsonFile() {
        File f = new TestResultService().getResultJsonFile();
        assertThat(f.getName(), is("result.json"));
    }
}
