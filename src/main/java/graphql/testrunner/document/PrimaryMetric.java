package graphql.testrunner.document;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import graphql.testrunner.converter.RawDataToString;

public class PrimaryMetric {

    public double score;
    public double scoreError;
    public List<Double> scoreConfidence;
    public Map<String, Double> scorePercentiles;
    public String scoreUnit;

    @JsonDeserialize(using = RawDataToString.class)
    public String rawData;
}
