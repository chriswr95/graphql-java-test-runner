package graphql.testrunner.repository;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestResultRepo {

    public static final Logger LOGGER = Logger.getLogger(TestResultRepo.class.getName());
    private static final String COLLECTION_NAME = "test-runs";

    @Autowired
    private Firestore firestore;

    public void updateInitialTestResult(UUID jobId, Map<String, Object> updates) {
        updateDocument(jobId, updates);
    }

    public void updateFinalTestResult(UUID jobId, Map<String, Object> updates) {
        updateDocument(jobId, updates);
    }

    private void updateDocument(UUID jobId, Map<String, Object> updates) {
        DocumentReference docRef = this.firestore.collection(COLLECTION_NAME).document(jobId.toString());
        try {
            WriteResult writeResult = docRef.update(updates).get();
            LOGGER.log(Level.INFO, "Test result updated : {0}", writeResult.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}
