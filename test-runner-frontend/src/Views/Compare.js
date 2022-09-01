import * as React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Snackbar, CircularProgress, Slide } from '@mui/material';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from 'react-router-hash-link';
import BarCharts from '../Components/BarChart';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, Dialog } from '@material-ui/core';
import { Stack } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  buildChartsData,
  buildIndividualJsonResultsCompare,
  buildJsonResults,
  combineChartsData,
  downloadJSON,
  getImprovedVsRegressedValues,
} from './ReportAndCompareUtils';
import { FirestoreContext } from '../Components/FirestoreProvider';
import PieChartComponent from '../Components/PieChartComponent';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import Marquee from 'react-fast-marquee';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const GRAPHQL_JAVA_GITHUB = 'https://github.com/graphql-java/graphql-java';

const useStyles = makeStyles({
  dialog: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 1000,
    height: 1000,
    marginBottom: 0,
  },
});

function TransitionSnackBar(props) {
  return <Slide {...props} direction="up" style={{ color: 'white', backgroundColor: '#E535AB', fontWeight: 600 }} />;
}

function TransitionDialog(props) {
  return <Slide {...props} direction="left" style={{ backgroundColor: 'transparent' }} />;
}

const initialState = {
  // State of the dialog that shows test results with JSON format.
  openDialog: false,
  // Combined test runs in order to display one single chart.
  combinedClassesAndBenchmarksState: [],
  // Combined test results with JSON format.
  jsonResult: {},
  // Test A results with JSON format.
  jsonResultTestRunA: {},
  // Test B results with JSON format.
  jsonResultTestRunB: {},
  // State of the snackbar that appears after clicking on downloading and copy buttons.
  openSnackBar: false,
  // Snackbar message according to type of button clicked.
  snackBarMessage: '',
  // Snackbar duration according to type of button clicked.
  snackBarMessageDuration: null,
  // Current tab selected on Dialog.
  selectedTab: '1',
  // Results obtained from getImprovedVsRegressedValues().
  improvedAndRegressedResults: {},
  // Selected test run results (either jsonReslTestRunA or jsonReslTestRunB).
  selectedJsonResult: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'handleDialog':
      return {
        ...state,
        openDialog: action.payload.isOpen,
        jsonResult: action.payload.jsonResults,
        jsonResultTestRunA: {
          className: action.payload.jsonResults?.className,
          jobId: action.payload.jsonResults?.jobIdA,
          jsonResults: action.payload.jsonResults?.jsonResults?.filter((_, index) => index % 2 === 0),
        },
        jsonResultTestRunB: {
          className: action.payload.jsonResults?.className,
          jobId: action.payload.jsonResults?.jobIdB,
          jsonResults: action.payload.jsonResults?.jsonResults?.filter((_, index) => index % 2 !== 0),
        },
        selectedTab: '1',
        selectedJsonResult: {
          className: action.payload.jsonResults?.className,
          jobId: action.payload.jsonResults?.jobIdA,
          jsonResults: action.payload.jsonResults?.jsonResults?.filter((_, index) => index % 2 === 0),
        },
      };
    case 'setClassesAndBenchmarksState':
      const classesAndBenchmarksA = buildChartsData(action.payload.testRunA);
      const classesAndBenchmarksB = buildChartsData(action.payload.testRunB);
      return {
        ...state,
        improvedAndRegressedResults: getImprovedVsRegressedValues(classesAndBenchmarksA, classesAndBenchmarksB),
        combinedClassesAndBenchmarksState: combineChartsData(classesAndBenchmarksA, classesAndBenchmarksB),
      };
    case 'handleSnackBar':
      return {
        ...state,
        snackBarMessage: action.payload.message,
        snackBarMessageDuration: action.payload.messageDuration,
        openSnackBar: action.payload.isOpen,
      };
    case 'handleTabsChange':
      return {
        ...state,
        selectedTab: action.payload,
        selectedJsonResult: action.payload === '1' ? state.jsonResultTestRunA : state.jsonResultTestRunB,
      };
    default:
      return state;
  }
};

export default function Compare() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, firestoreData } = React.useContext(FirestoreContext);

  const [searchParam] = useSearchParams();

  const jobIdA = searchParam.get('compareA');
  const jobIdB = searchParam.get('compareB');

  const handleChangeOnTabs = (event, newValue) => {
    dispatch({ type: 'handleTabsChange', payload: newValue });
  };

  const {
    openDialog,
    combinedClassesAndBenchmarksState,
    jsonResult,
    jsonResultTestRunA,
    jsonResultTestRunB,
    improvedAndRegressedResults,
    openSnackBar,
    snackBarMessage,
    snackBarMessageDuration,
    selectedTab,
    selectedJsonResult,
  } = state;

  const classes = useStyles();

  const selectedTestRunFromDashboardA = React.useMemo(() => {
    if (firestoreData !== undefined) {
      return firestoreData.find((jobA) => {
        return jobIdA === jobA.id;
      });
    }
  }, [firestoreData, jobIdA]);

  const selectedTestRunFromDashboardB = React.useMemo(() => {
    if (firestoreData !== undefined) {
      return firestoreData.find((jobB) => {
        return jobIdB === jobB.id;
      });
    }
  }, [firestoreData, jobIdB]);

  const handleClickOpenSnackBar = (message, messageDuration) => () => {
    dispatch({
      type: 'handleSnackBar',
      payload: { message: message, isOpen: true, messageDuration: messageDuration },
    });
    navigator.clipboard.writeText(JSON.stringify(selectedJsonResult.jsonResults, undefined, 2));
  };

  const handleCloseSnackBar = () => {
    dispatch({ type: 'handleSnackBar', payload: { message: '', isOpen: false } });
  };

  useEffect(() => {
    if (selectedTestRunFromDashboardA !== undefined && selectedTestRunFromDashboardA !== undefined) {
      dispatch({
        type: 'setClassesAndBenchmarksState',
        payload: { testRunA: selectedTestRunFromDashboardA, testRunB: selectedTestRunFromDashboardB },
      });
    }
  }, [selectedTestRunFromDashboardA, selectedTestRunFromDashboardB]);

  const handleClickOpenDialog = (benchmarks, isIndividualBenchmark) => {
    if (isIndividualBenchmark)
      dispatch({
        type: 'handleDialog',
        payload: { isOpen: true, jsonResults: buildIndividualJsonResultsCompare(benchmarks) },
      });
    else dispatch({ type: 'handleDialog', payload: { isOpen: true, jsonResults: buildJsonResults(benchmarks) } });
  };

  const handleCloseDialog = () => {
    dispatch({ type: 'handleDialog', payload: { isOpen: false, jsonResults: {} } });
  };

  const downloadJSONReport = (message, messageDuration) => {
    dispatch({
      type: 'handleSnackBar',
      payload: { message: message, isOpen: true, messageDuration: messageDuration },
    });
    downloadJSON(selectedJsonResult.className, selectedJsonResult.jobId, selectedJsonResult.jsonResults);
  };

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            marginTop: 0,
            marginLeft: 0,
          }}
        >
          <CircularProgress style={{ width: '7vh' }} color="secondary" />
        </Box>
      ) : (
        <div>
          <img
            style={{
              marginLeft: '2%',
              marginTop: '0.5%',
              marginBottom: '1%',
              width: '18%',
            }}
            src={GraphQL_Logo}
            alt="GraphQL Java Logo"
          />
          <a
            style={{
              marginRight: '3.5%',
              marginTop: '1.1%',
              float: 'right',
              textDecoration: 'none',
              color: 'gray',
              fontWeight: '720',
            }}
            href={GRAPHQL_JAVA_GITHUB}
          >
            GitHub
          </a>

          <Dialog
            classes={{
              paper: classes.dialog,
            }}
            open={openDialog}
            onClose={() => handleCloseDialog()}
            TransitionComponent={TransitionDialog}
          >
            <TabContext value={selectedTab}>
              <AppBar sx={{ position: 'sticky', bgcolor: 'white' }}>
                <Toolbar>
                  <TabList
                    style={{ color: 'gray', position: 'absolute', left: 0 }}
                    onChange={handleChangeOnTabs}
                    TabIndicatorProps={{ style: { background: 'darkgray' } }}
                  >
                    <Tab label="Test Run 1 results" value="1" />
                    <Tab label="Test Run 2 results" value="2" />
                  </TabList>

                  <IconButton
                    color="inherit"
                    onClick={() => handleCloseDialog()}
                    style={{ color: 'gray', position: 'absolute', right: 0, marginRight: '3%' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>

                <Stack
                  direction="row"
                  spacing={2}
                  style={{ paddingBottom: '3%', paddingLeft: '5%', paddingTop: '3.6%', paddingRight: '6%' }}
                >
                  <Typography sx={{ color: 'black', flex: '1' }} variant={jsonResult.className ? 'h5' : 'h6'}>
                    <b>{jsonResult.className ? jsonResult.className : jsonResult.id}</b>
                  </Typography>

                  <IconButton
                    variant="outlined"
                    sx={{ color: '#e535ab', borderColor: '#e535ab' }}
                    onClick={() => downloadJSONReport('JSON file downloaded', null)}
                  >
                    <DownloadForOfflineOutlinedIcon sx={{ color: '#E535AB', fontSize: '4.3vh' }} />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    sx={{ color: 'gray', borderColor: 'gray' }}
                    onClick={handleClickOpenSnackBar('JSON results saved into clipboard', null)}
                  >
                    <ContentCopyIcon sx={{ color: '#313846', fontSize: '4.3vh' }} />
                  </IconButton>
                </Stack>
              </AppBar>

              <TabPanel value="1">
                <pre>{JSON.stringify(jsonResultTestRunA?.jsonResults, undefined, 2)}</pre>
              </TabPanel>
              <TabPanel value="2">
                <pre>{JSON.stringify(jsonResultTestRunB?.jsonResults, undefined, 2)}</pre>
              </TabPanel>
            </TabContext>
          </Dialog>

          <Box sx={{ width: '97%', marginBottom: '2%', marginLeft: '2%' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'gray' }}>
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h4" style={{ marginTop: '1%' }}>
              <b>Compare Test Runs</b>
            </Typography>
          </Box>

          {/* Father BOX */}
          <Box sx={{ marginLeft: '2%', width: '98%', display: 'flex', flexDirection: 'row' }}>
            {/* Lateral menu BOX */}
            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'fixed' }}>
              <Typography variant="h6">
                <b>Classes</b>
              </Typography>

              <Box
                sx={{
                  minWidth: '21vh',
                  width: '61%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#F1F1F1',
                  borderRadius: '12px 12px 12px 12px',
                  padding: '4%',
                }}
              >
                {combinedClassesAndBenchmarksState?.map((item, i) => (
                  <Typography
                    key={i}
                    variant="h7"
                    style={{
                      maxWidth: '100%',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'block',
                    }}
                  >
                    <HashLink
                      smooth
                      to={`?compareA=${jobIdA}&compareB=${jobIdB}#${item[0]}`}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      {item[0]}
                    </HashLink>
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Charts BOX */}
            <Box sx={{ width: '100%', marginLeft: '15%' }}>
              {/* Start PIE CHART */}

              <Typography variant="h5" id="Summary">
                <b>Summary</b>
              </Typography>
              {/* Top BOX */}
              <Box
                sx={{
                  width: '95%',
                  marginBottom: '2.5%',
                  backgroundColor: '#F1F1F1',
                  display: 'flex',
                  flexDirection: 'row',
                  borderRadius: '12px 12px 12px 12px',
                  paddingTop: '2%',
                  paddingBottom: '3%',
                  paddingLeft: '1.8%',
                  paddingRight: '1.8%',
                }}
              >
                {/* Left info */}

                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <Box sx={{ marginLeft: '6%', marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ marginLeft: '70%', marginBottom: '5%' }}>
                        <b>Regressed</b>
                      </Typography>

                      {improvedAndRegressedResults.regressedClasses?.map((regressedClasses, i) => {
                        return (
                          <Stack key={i} direction="row" spacing={2} sx={{ width: '100%' }}>
                            <Typography
                              style={{
                                maxWidth: '40%',
                                width: '40%',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'block',
                              }}
                            >
                              {' '}
                              <Marquee gradientColor={0} play={true} pauseOnHover={true} speed={9} delay={3} loop={2}>
                                {regressedClasses[0]}
                              </Marquee>
                            </Typography>
                            <ProgressBar style={{ width: '34%', height: '1vh', marginTop: '2%', direction: 'rtl' }}>
                              <ProgressBar
                                variant="danger"
                                now={regressedClasses[1].improvementOrRegressionPercentage}
                              />
                            </ProgressBar>
                            <Typography>
                              - {regressedClasses[1].improvementOrRegressionPercentage.toFixed(2)}%
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* Pie Chart BOX */}

                  <Grid item xs={2}>
                    <Box sx={{ textAlign: 'center', marginTop: '3%' }}>
                      <Typography variant="h5" sx={{ alignItems: 'center' }}>
                        <b>Total</b>
                      </Typography>
                      <PieChartComponent
                        totalImprovedPercentage={improvedAndRegressedResults.totalImprovedPercentage}
                        totalRegressedPercentage={improvedAndRegressedResults.totalRegressedPercentage}
                      />
                    </Box>
                  </Grid>

                  {/* Right info */}
                  <Grid item xs={5}>
                    <Box sx={{ marginLeft: '6%', marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ marginBottom: '5%' }}>
                        <b>Improved</b>
                      </Typography>

                      {improvedAndRegressedResults.improvedClasses?.map((improvedClass, i) => {
                        return (
                          <Stack key={i} direction="row" spacing={2} sx={{ width: '100%' }}>
                            <Typography sx={{ maxWidth: '18%', width: '18%' }}>
                              + {improvedClass[1].improvementOrRegressionPercentage.toFixed(2)}%
                            </Typography>
                            <ProgressBar style={{ width: '34%', height: '1vh', marginTop: '2%', direction: 'ltr' }}>
                              <ProgressBar variant="success" now={improvedClass[1].improvementOrRegressionPercentage} />
                            </ProgressBar>
                            <Typography
                              style={{
                                maxWidth: '34%',
                                width: '34%',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'block',
                              }}
                            >
                              <Marquee gradientColor={0} play={true} pauseOnHover={true} speed={9} delay={3} loop={2}>
                                {improvedClass[0]}
                              </Marquee>
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Ends PIE CHART */}

              {/* Bar columns BOX */}

              <Box sx={{ widht: '100%', marginTop: '3%', marginBottom: '1.6%', display: 'flex', flexDirection: 'row' }}>
                <Box
                  sx={{
                    width: '45%',
                    marginBottom: '2%',
                    borderLeft: '4.3px solid #313846',
                    borderBottom: '4.3px solid #313846',
                    borderRadius: '0 0 0 12px',
                    paddingLeft: '1%',
                    paddingBottom: '1%',
                  }}
                >
                  <Typography variant="h6">
                    <b>Test run {selectedTestRunFromDashboardA?.id}</b>
                  </Typography>

                  <Typography style={{ color: 'grey' }}>Time of Run: {selectedTestRunFromDashboardA?.date}</Typography>
                  <Typography style={{ color: 'grey' }}>
                    Git Commit Hash: {selectedTestRunFromDashboardA?.commitHash}
                  </Typography>
                  <Typography style={{ color: 'grey' }}>Branch: {selectedTestRunFromDashboardA?.branch}</Typography>
                </Box>

                <Box
                  sx={{
                    width: '45%',
                    marginBottom: '2%',
                    marginLeft: '5%',
                    borderLeft: '4.3px solid #E535AB',
                    borderBottom: '4.3px solid #E535AB',
                    borderRadius: '0 0 0 12px',
                    paddingLeft: '1%',
                    paddingBottom: '1%',
                  }}
                >
                  <Typography variant="h6">
                    <b>Test run {selectedTestRunFromDashboardB?.id}</b>
                  </Typography>

                  <Typography style={{ color: 'grey' }}>Time of Run: {selectedTestRunFromDashboardB?.date}</Typography>
                  <Typography style={{ color: 'grey' }}>
                    Git Commit Hash: {selectedTestRunFromDashboardB?.commitHash}
                  </Typography>
                  <Typography style={{ color: 'grey' }}>Branch: {selectedTestRunFromDashboardB?.branch}</Typography>
                </Box>
              </Box>
              {combinedClassesAndBenchmarksState?.map((benchmarkData, i) => {
                var currentChart = benchmarkData;
                return (
                  <Box key={i} sx={{ marginBottom: '3.4%', marginRight: '5%' }}>
                    <Typography variant="h5" id={`${currentChart[0]}`}>
                      <b>{currentChart[1][0][0].benchmarkClass}</b>
                    </Typography>
                    <IconButton
                      style={{ float: 'right' }}
                      edge="start"
                      color="inherit"
                      onClick={() => handleClickOpenDialog(currentChart[1][1], true)}
                      aria-label="open"
                    >
                      <MoreHorizIcon />
                    </IconButton>

                    <BarCharts classesAndBenchmarksState={currentChart[1][1]} mediumCharts={false} />
                  </Box>
                );
              })}
            </Box>

            <Snackbar
              open={openSnackBar}
              onClose={handleCloseSnackBar}
              autoHideDuration={snackBarMessageDuration}
              TransitionComponent={TransitionSnackBar}
              message={snackBarMessage}
              key={snackBarMessage}
            />
          </Box>
        </div>
      )}
    </div>
  );
}