package graphql.testrunner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.document.Status;
import graphql.testrunner.document.TestResult;
import graphql.testrunner.dto.Job;
import graphql.testrunner.repository.TestResultRepo;

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

        testResult.setStatus(status);
        return testResult;
    }

}
