package graphql.testrunner.converter;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import graphql.testrunner.exception.TestRunnerException;

/**
 * Converts the rawData field present in test result.json from List<List<Double>> to String
 * to make the field compatible with Firestore schema.
 *
 */
public class RawDataToString extends StdDeserializer<String> {

    public RawDataToString() {
        this(null);
    }

    protected RawDataToString(Class valueClass) {
        super(valueClass);
    }

    @Override
    public String deserialize(JsonParser jp, DeserializationContext ctxt) {
        try {
          return jp.getCodec().readTree(jp).toString();
        } catch (IOException e) {
          throw new TestRunnerException("Error in deserializing field rawData.");
        }
    }
}
