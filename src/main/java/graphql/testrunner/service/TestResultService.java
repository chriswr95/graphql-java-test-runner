package graphql.testrunner.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.document.Status;
import graphql.testrunner.document.TestResult;
import graphql.testrunner.document.TestRunnerResult;
import graphql.testrunner.document.TestStatistics;
import graphql.testrunner.dto.Job;
import graphql.testrunner.repository.TestResultRepo;

import static graphql.testrunner.document.Status.FINISHED;

@Service
public class TestResultService {

    @Autowired
    private TestResultRepo testResultRepo;

    public void saveTestResult(Job job, Status status) {
        TestResult testResult = getTestResult(job, status);
        testResultRepo.saveTestResult(testResult);
    }

    private TestResult getTestResult(Job job, Status status) {
        TestResult testResult = new TestResult();
        testResult.setJobId(job.getJobId().toString());
        testResult.setCommitHash(job.getCommitHash());

        //read result.json and set the required fields depending on status
        if (status == FINISHED) {
            List<TestRunnerResult> testRunnerResults = new ArrayList<>();
            testRunnerResults.add(new TestRunnerResult("core-2", readResultJson()));
            testResult.setTestRunnerResults(testRunnerResults);
        }

        testResult.setStatus(status);
        return testResult;
    }

    private List<TestStatistics> readResultJson() {
        List<TestStatistics> testStatistics = new ArrayList<>();
        try {
            testStatistics = new ObjectMapper().readValue(new File("result.json"),
                new TypeReference<List<TestStatistics>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
        return testStatistics;
    }

}
