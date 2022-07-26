package graphql.testrunner.document;

import java.util.List;
import java.util.Map;

public class TestStatistics {

    public String jmhVersion;
    public String benchmark;
    public String mode;
    public int threads;
    public int forks;
    public String jvm;
    public List<Object> jvmArgs;
    public String jdkVersion;
    public String vmName;
    public String vmVersion;
    public int warmupIterations;
    public String warmupTime;
    public int warmupBatchSize;
    public int measurementIterations;
    public String measurementTime;
    public int measurementBatchSize;
    public PrimaryMetric primaryMetric;
    public Map<Object, Object> secondaryMetrics;


}
