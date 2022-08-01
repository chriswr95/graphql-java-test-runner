package graphql.testrunner.converter;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import graphql.testrunner.exception.TestRunnerException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.isA;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RawDataToStringTest {

    @Mock
    private JsonParser jp;

    @Mock
    private DeserializationContext ctxt;

    @Mock
    private ObjectCodec objectCodec;

    private RawDataToString rawDataToString = new RawDataToString();

    @Test
    void deserialize() throws IOException {
        when(jp.getCodec()).thenReturn(objectCodec);
        when(objectCodec.readTree(eq(jp))).thenThrow(IOException.class);
        try {
            rawDataToString.deserialize(jp, ctxt);
            fail("Expected exception.");
        } catch (Exception ex) {
            assertThat(ex, isA(TestRunnerException.class));
            assertEquals("Error in deserializing field rawData.", ex.getMessage());
        }
    }
}
