# Problem Statement
graphql-java has a benchmark suite which is under utilized. The benchmarks are run on an adhoc basis by developers, are sometimes forgotten about, and are not used to gate approval of pull requests.

Work was [started](https://github.com/graphql-java/graphql-java/pull/2364) on a system to automatically run the project benchmarks on every pull request. It was not completed because it was difficult to find funding for the compute resources required to run the benchmarks.

**Enter Adarsh Jaiswal**.  @adarsh-jaiswal is interning at Twitter this summer, and we're hoping his project can be to create a system for running the benchmark tests, which we're calling a performance architecture.

# Goals
| Number | Requirement                                                           | Level | Notes                                                                                                                                  |
|--------|-----------------------------------------------------------------------|-------|----------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Open source                                                           | mvp   | The test suite should live in graphql-java.                                                                                            |
| 2      | Twitter independent                                                   | mvp   | The test suite should not depend on Twitter infrastructure or Twitter funding. There should be zero data overlap.                      |
| 3      | Maintained over time                                                  | mvp   | We should be able to track the performance of the library against our use cases over time.                                             |
| 4      | Choose how often tests are run                                        | mvp   | We should be able to change how often the tests are run. For example daily, weekly, and on every pull request against the main branch. |
| 5      | Easy to visualize                                                     | mvp   | We should be able to visualize the test results, and link to the results from github pull requests.                                    |
| 6      | System should be able to run in 0 cost mode                           | mvp   |                                                                                                                                        |
| 7      | System should not exhaust graphql-java github actions budget          | mvp   |                                                                                                                                        |
| 8      | System should run against multiple JVM’s                              | bonus |                                                                                                                                        |
| 9      | System should be able to run against different configurations of VM’s | bonus | For example run on a 4 core vs 32 core machine                                                                                         |

## Success Criteria
A successful project means a set of performance tests are run regularly against graphql-java. This means Adarsh has landed the test suite into graphql-java or a companion repository.

The system needs to be understandable and maintainable by others after the internship. Ideally we deliver this project to the graphql-java maintainers who now believe it belongs to graphql-java (as opposed to Twitter).

# High-Level Approach

The testing architecture will live as a microservice hosted in Google Cloud. As much as possible, we will stay within the free tier of Google Cloud Services. We will trigger test runs via a Github actions. We will make the results of the test runs available through a dashboard which will serve two purposes. 
1 How does a specific commit affect the performance of GraphQL Java? 
2 What does the performance of GraphQL Java look like over time?

Since we will be executing arbitrary (potentially malicious) code, we need to be careful about sandboxing the test executor.
## Component 1 - Test Runner
<img width="1267" alt="Screen Shot 2022-06-17 at 11 54 50 AM" src="https://user-images.githubusercontent.com/37849366/174386048-e28a155f-ddd3-47c9-9765-0ebe4747fa60.png">

### Tech Stack
| Technology                       | Usage                                 | Free Tier Usage Limit                                           |
|----------------------------------|---------------------------------------|-----------------------------------------------------------------|
| Pub/Sub Queue                    | Hold onto tasks until worker is ready | 10 GB of messages per month                                     |
| Compute Engine                   | Run test workflow                     | 1 e2-micro VM per month in us-west-1                            |
| Firestore                        | Store test results                    | 1 GB of data storage                                            |
| Cloud Functions                  | Read test results from Firestore      | 2 million invocations per month                                 |
| Google Cloud Development Manager | Infrastructure as code                | (I believe this is free, but couldn’t find anything definitive) |
| Google Cloud Build               | Continuous deployment                 | 120 build minutes per day                                       |

## API’s
**Run Test API**

The Run Test API isn’t a public HTTP API. Instead the triggering event, a Github Action, will publish a message to a Google Cloud Pub/Sub Queue. See this  [example](https://cloud.google.com/pubsub/docs/publisher#python) . The message will be a json object with the following format:
```
{
  “gitCommit”: “518d25c3df21f1d2cbc49abd613c7a55cd4c7339”
}
```
**Read API**

The read API will be an HTTP api which only exposes a GET operation. It can be queried as follows:
```
curl -X GET “ [https://SOME_REGION.cloudfunctions.net/](https://your_region-your_project_id.cloudfunctions.net/FUNCTION_NAME) jmh_test_result?commit=518d25c3df21f1d2cbc49abd613c7a55cd4c7339”
```

The response will be a json object with the format provided in *Example 1*.
## Data Stores
We will have one data store named TestRuns, which lives as a Firestore Database with the following format. At 1 GB of storage, and 1,000 Bytes per record (the size of the example record below) we can safely store roughly one million records.

*Example 1 - Data Store Schema*
```
{
  “id”: “cd887934-ec17-11ec-8ea0-0242ac120002”,
  “runDate”: “06-14-2022”,
  “pullRequest”: 5,
  “commit”: “”,
  “branch”: “adajaiswal/test”,
  “status”: “success”,
   “testRunData”: [
    {
      “className”: “class1.java”,
      “scores”: [
        {
          “functionName”: “fun1”,
          “currentRun”: {
            “score”: 3467631.2300505415,
            “scoreError”: 98563.33258873208,
            “scoreConfidence”: [
              3369067.897461809,
              3566194.5626392737
            ],
            “scorePercentiles”: {
              “0.0”: 3333994.173460993,
              “50.0”: 3474993.5017186473,
              “90.0”: 3532339.4656069754
            },
            “scoreUnit”: “ops/s”,
            “rawData”: [
              [
                3524193.1540743182,
                3531314.663170731
              ],
              [
                3440045.3067861893,
                3333994.173460993
              ]
            ]
          }
        }
      ]
    }
  ]
}
```


## Component 2 - Github Actions

<img width="969" alt="Screen Shot 2022-06-17 at 12 01 01 PM" src="https://user-images.githubusercontent.com/37849366/174386640-c993df2c-7280-405e-bea9-66d9ab56cf6a.png">

We want to run our test suite based on configured github actions/webhooks. There were two options that we experimented with:
### 1. Run daily against master -
* Using a schedule event in workflow yml file - In this approach we configure a workflow file with a cron job which runs a curl script to call our test endpoint. Our test endpoint will be configured via a secret env variable and we will use this env variable in the workflow yml file. 
* Cron job in our test microservice - We can set a cron job to run daily at night, which will pull the latest code from the master branch and test it. 
* Github webhooks - it does not provide any schedule event functionality.

### 2. Run on a pull request creation - This can be achieved using github webhooks. 
* The owner of the repo can set our POST endpoint which will be called on pull request event.  
* Owner can also  [set a secret token](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks)  which will be passed in the request header called “X-Hub-Signature-256”. In our endpoint we can authenticate the request based on the agreed secret.
* From the payload that github sends to our endpoint we can filter out and process only for the created pull request event type.
After the test run we want to put a comment on the PR with the link to the dashboard test result. 
* This can be achieved and is shown in the Prototypes section. We need a  [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (personal access token shared by the repo owner to us) , it is required when we trigger a rest call to initiate a comment workflow on the pull request.



## Component 3 - Test Dashboard

```
TODO: We're still working on the dashboard design! Expect a follow up in the future.
```


