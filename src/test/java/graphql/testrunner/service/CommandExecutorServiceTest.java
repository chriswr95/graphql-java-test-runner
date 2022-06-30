package graphql.testrunner.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.util.TestRunnerException;

import static java.util.Arrays.asList;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isA;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommandExecutorServiceTest {

    @Mock
    private ProcessBuilder processBuilder;

    @Mock
    private static Logger LOGGER;

    @Mock
    private Process process;

    @Mock
    private static BufferedReader bufferedReader;

    @InjectMocks
    private CommandExecutorService commandExecutorService = new CommandExecutorService(){
        @Override
        ProcessBuilder getBuilder(String dir) {
            return processBuilder;
        }
        @Override
        BufferedReader getReader(Process p) {
            return bufferedReader;
        }

    };

    @Test
    void executeCommand_when_exit_code_is_zero() throws Exception {
        List<String> command = asList("SH");
        setupProcessBuilderMock(command, 0);

        commandExecutorService.executeCommand(command);
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));
        String dir = null;
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Command logs : {0}"), eq("mocked output\n"));
    }

    @Test
    void executeCommand_when_exit_code_is_non_zero() throws Exception {
        List<String> command = asList("SH");
        setupProcessBuilderMock(command, 1);
        try {
            commandExecutorService.executeCommand(command);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));
        String dir = null;
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error exit code on command :{0}"),
          eq(command));
    }

    @Test
    void executeCommandInDir_when_exit_code_is_zero() throws Exception {
        List<String> command = asList("SH");
        setupProcessBuilderMock(command, 0);
        String dir = "/app/test";

        commandExecutorService.executeCommandInDir(command, dir);
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Command logs : {0}"), eq("mocked output\n"));
    }

    @Test
    void executeCommand_when_IOException_occurs_during_start_of_processbuilder() throws Exception {
        List<String> command = asList("SH");
        setFinalStatic(CommandExecutorService.class.getDeclaredField("LOGGER"), LOGGER);
        when(processBuilder.command(eq(command))).thenReturn(processBuilder);
        when(processBuilder.start()).thenThrow(new IOException("IO error"));

        String dir = "/app/test";
        try {
            commandExecutorService.executeCommandInDir(command, dir);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));

        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error in starting the process on command : {0}"),
          eq(command));
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error message : {0}"),
          eq("IO error"));

    }

    @Test
    void executeCommand_when_IOException_occurs_during_read_output() throws Exception {
        List<String> command = asList("SH");
        setFinalStatic(CommandExecutorService.class.getDeclaredField("LOGGER"), LOGGER);
        when(processBuilder.command(eq(command))).thenReturn(processBuilder);
        when(processBuilder.start()).thenReturn(process);
        when(bufferedReader.readLine()).thenThrow(new IOException("Error while reading line"));

        String dir = "/app/test";
        try {
            commandExecutorService.executeCommandInDir(command, dir);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));

        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error in reading process output :{0}"),
          eq("Error while reading line"));
    }

    @Test
    void executeCommand_when_InterruptedException_occurs_during_write_output() throws Exception {
        List<String> command = asList("SH");
        setFinalStatic(CommandExecutorService.class.getDeclaredField("LOGGER"), LOGGER);
        when(processBuilder.command(eq(command))).thenReturn(processBuilder);
        when(processBuilder.start()).thenReturn(process);
        when(process.waitFor()).thenThrow(new InterruptedException());

        String dir = "/app/test";
        try {
            commandExecutorService.executeCommandInDir(command, dir);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
        }
        InOrder inOrder = inOrder(LOGGER);
        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("Executing command : {0}"),
          eq(command));

        inOrder.verify(LOGGER).log(eq(Level.INFO), eq("In path : {0}"), eq(dir));
        inOrder.verify(LOGGER).log(eq(Level.SEVERE), eq("Error while exiting the process on command :{0}"),
          eq(command));
    }


    @Test
    void getBuilder() {
        CommandExecutorService commandExecutorService = new CommandExecutorService();
        ProcessBuilder pb = commandExecutorService.getBuilder(null);
        File f = pb.directory();
        assertThat(f, nullValue());

        pb = commandExecutorService.getBuilder("/app/test");
        f = pb.directory();
        assertThat(f.getName(), is("test"));
    }

    @Test
    void getReader() throws IOException {
        CommandExecutorService commandExecutorService = new CommandExecutorService();
        byte[] expectedOutput = "mocked output".getBytes();
        InputStream inputStream = new ByteArrayInputStream(expectedOutput);
        when(process.getInputStream()).thenReturn(inputStream);

        BufferedReader br = commandExecutorService.getReader(process);
        assertThat(br.readLine(), is("mocked output"));
    }

    private void setupProcessBuilderMock(List<String> command, int exitCode) throws Exception {
        when(processBuilder.command(eq(command))).thenReturn(processBuilder);
        when(processBuilder.start()).thenReturn(process);
        when(bufferedReader.readLine()).thenReturn("mocked output").thenReturn(null);
        when(process.waitFor()).thenReturn(exitCode);
        setFinalStatic(CommandExecutorService.class.getDeclaredField("LOGGER"), LOGGER);
    }

    private void setFinalStatic(Field field, Object newValue) throws Exception {
        field.setAccessible(true);
        Field modifiersField = Field.class.getDeclaredField("modifiers");
        modifiersField.setAccessible(true);
        modifiersField.setInt(field, field.getModifiers() & ~Modifier.FINAL);
        field.set(null, newValue);
    }
}
