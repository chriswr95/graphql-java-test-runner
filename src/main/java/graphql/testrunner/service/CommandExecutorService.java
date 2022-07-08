package graphql.testrunner.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import graphql.testrunner.util.TestRunnerException;

import org.springframework.stereotype.Service;

import static java.util.Arrays.asList;

@Service
public class CommandExecutorService {

    public static final Logger LOGGER = Logger.getLogger(CommandExecutorService.class.getName());

    public static final String GRAPHQL_DIR = "/app/graphql-java/";
    public static final List<String> BUILD_GRAPHQL_JMH_JAR = asList("sh", "-c", "RELEASE_VERSION=test-runner-jmh ./gradlew jmhJar");


    public void executeCommand(List<String> command) throws TestRunnerException {
        execute(command, null);
    }

    public void executeCommandInDir(List<String> command, String dir) throws TestRunnerException {
        execute(command, dir);
    }

    private void execute(List<String> command, String dir) throws TestRunnerException {
        LOGGER.log(Level.INFO, "Executing command : {0}", command);
        LOGGER.log(Level.INFO, "In path : {0}", dir);
        try {
            ProcessBuilder processBuilder = getBuilder(dir).command(command);
            Process process = processBuilder.start();
            writeOutput(process, readOutput(process), command);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error in starting the process on command : {0}", command);
            LOGGER.log(Level.SEVERE, "Error message : {0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

    private String readOutput(Process process) throws TestRunnerException {
        BufferedReader reader = getReader(process);
        StringBuilder output = new StringBuilder();
        try {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }
        } catch (IOException ex) {
            LOGGER.log(Level.SEVERE, "Error in reading process output :{0}", ex.getMessage());
            throw new TestRunnerException();
        }
        return output.toString();
    }

    private void writeOutput(Process process, String output, List<String> command) throws IOException {
        try {
            int exitVal = process.waitFor();
            if (exitVal == 0) {
                LOGGER.log(Level.INFO, "Command logs : {0}", output);
            } else {
                LOGGER.log(Level.SEVERE, "Error exit code on command :{0}", command);
                throw new TestRunnerException();
            }
        } catch (InterruptedException e) {
            LOGGER.log(Level.SEVERE, "Error while exiting the process on command :{0}", command);
            throw new TestRunnerException();
        }
    }

    /**
     * Prepares the process builder either in default directory or the path passed in the arguments.
     *
     * @param dir the path of the directory
     */
     ProcessBuilder getBuilder(String dir) {
        if (Objects.isNull(dir)) {
            return new ProcessBuilder();
        } else {
            return new ProcessBuilder().directory(new File(dir));
        }
    }

    BufferedReader getReader(Process p) {
         return new BufferedReader(new InputStreamReader(p.getInputStream()));
    }

}
