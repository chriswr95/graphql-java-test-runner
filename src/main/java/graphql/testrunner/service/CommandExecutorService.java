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

@Service
public class CommandExecutorService {

    private static final Logger LOGGER = Logger.getLogger(CommandExecutorService.class.getName());

    public void executeCommand(List<String> command) throws TestRunnerException {
        execute(command, null);
    }

    public void executeCommandInDir(List<String> command, String dir) throws TestRunnerException {
        execute(command, dir);
    }

    private void execute(List<String> command, String dir) throws TestRunnerException {
        LOGGER.log(Level.INFO, "Executing command :{0},", command);
        LOGGER.log(Level.INFO, "In path :{0},", dir);
        ProcessBuilder processBuilder = getBuilder(dir);

        processBuilder.command(command);
        try {
            Process process = processBuilder.start();
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(
              new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }
            int exitVal = process.waitFor();
            if (exitVal == 0) {
                LOGGER.log(Level.INFO, "#### Command logs ####:{0}", output);
            }
        } catch (IOException | InterruptedException e) {
            LOGGER.log(Level.SEVERE, "Error in executing command :{0}", command);
            LOGGER.log(Level.SEVERE, "Error message :{0}", e.getMessage());
            throw new TestRunnerException();
        }
    }

    private ProcessBuilder getBuilder(String dir) {
        if (Objects.isNull(dir)) {
            return new ProcessBuilder();
        } else {
            return new ProcessBuilder().directory(new File(dir));
        }
    }

}
