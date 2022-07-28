package graphql.testrunner.document;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class PrimaryMetric {

    public double score;
    public double scoreError;
    public List<Double> scoreConfidence;
    public Map<String, Double> scorePercentiles;
    public String scoreUnit;

    @JsonIgnore
    public List<List<Double>> rawData;
}
