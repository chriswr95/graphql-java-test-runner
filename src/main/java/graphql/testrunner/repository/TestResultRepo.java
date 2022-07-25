package graphql.testrunner.repository;

import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import graphql.testrunner.document.TestResult;

@Service
public class TestResultRepo {

    public static final Logger LOGGER = Logger.getLogger(TestResultRepo.class.getName());
    private static final String COLLECTION_NAME = "test-runs";

    @Autowired
    private Firestore firestore;

    public void saveTestResult(TestResult testResult) {
        DocumentReference docRef = this.firestore.collection(COLLECTION_NAME).document(testResult.getJobId());
        try {
            WriteResult writeResult = docRef.set(testResult).get();
            LOGGER.log(Level.INFO, "Test result saved : {0}", writeResult.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}
