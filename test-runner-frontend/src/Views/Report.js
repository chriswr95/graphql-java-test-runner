import * as React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, IconButton, Snackbar, CircularProgress, Slide } from '@mui/material';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from 'react-router-hash-link';
import BarCharts from '../Components/BarChart';
import { useParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, Dialog } from '@material-ui/core';
import { Stack } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { buildChartsData, buildIndividualJsonResults, buildJsonResults, downloadJSON } from './ReportUtils';
import { FirestoreContext } from '../Components/FirestoreProvider';

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
  return (
    <Slide
      {...props}
      direction="up"
      style={{ color: 'white', backgroundColor: '#e535ab', fontWeight: '600', textShadow: '1px 3px black' }}
    />
  );
}

const initialState = {
  // State of the dialog that shows test results with JSON format.
  openDialog: false,
  // Data that will be used to build charts.
  classesAndBenchmarksState: [],
  // Test results with JSON format.
  jsonResult: {},
  // State of the snackbar that appears after clicking on downloading and copy buttons.
  openSnackBar: false,
  // Snackbar message according to type of button clicked.
  snackBarMessage: '',
  // Snackbar duration according to type of button clicked.
  snackBarMessageDuration: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'handleDialog':
      return {
        ...state,
        openDialog: action.payload.isOpen,
        jsonResult: action.payload.jsonResults,
      };
    case 'setClassesAndBenchmarksState':
      return {
        ...state,
        classesAndBenchmarksState: action.payload,
      };
    case 'handleSnackBar':
      return {
        ...state,
        snackBarMessage: action.payload.message,
        snackBarMessageDuration: action.payload.messageDuration,
        openSnackBar: action.payload.isOpen,
      };
    default:
      return state;
  }
};

export default function Report() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, firestoreData } = React.useContext(FirestoreContext);

  const { jobId } = useParams();

  const { openDialog, classesAndBenchmarksState, jsonResult, openSnackBar, snackBarMessage, snackBarMessageDuration } =
    state;

  const classes = useStyles();

  const selectedTestRunFromDashboard = React.useMemo(() => {
    if (firestoreData !== undefined) {
      return firestoreData.find((job) => {
        return jobId === job.id;
      });
    }
  }, [firestoreData, jobId]);

  const handleClickOpenSnackBar = (message, messageDuration) => () => {
    dispatch({
      type: 'handleSnackBar',
      payload: { message: message, isOpen: true, messageDuration: messageDuration },
    });
    navigator.clipboard.writeText(JSON.stringify(jsonResult.jsonResults, undefined, 2));
  };

  const handleCloseSnackBar = () => {
    dispatch({ type: 'handleSnackBar', payload: { message: '', isOpen: false } });
  };

  useEffect(() => {
    if (selectedTestRunFromDashboard !== undefined)
      dispatch({ type: 'setClassesAndBenchmarksState', payload: buildChartsData(selectedTestRunFromDashboard) });
  }, [selectedTestRunFromDashboard]);

  const handleClickOpenDialog = (benchmarks, isIndividualBenchmark) => {
    if (isIndividualBenchmark)
      dispatch({
        type: 'handleDialog',
        payload: { isOpen: true, jsonResults: buildIndividualJsonResults(benchmarks) },
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
    downloadJSON(jsonResult.className, jsonResult.jobId, jsonResult.jsonResults);
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
          >
            <AppBar sx={{ position: 'relative', bgcolor: 'transparent' }}>
              <Toolbar>
                <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
                  <b>{jsonResult.className ? jsonResult.className : jsonResult.jobId}</b>
                </Typography>
                <IconButton color="inherit" onClick={() => handleCloseDialog()} sx={{ color: 'gray' }}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>

              <Stack direction="row" spacing={2} style={{ marginLeft: '6%', marginBottom: '3%' }}>
                <Button
                  variant="outlined"
                  sx={{ color: '#e535ab', borderColor: '#e535ab' }}
                  onClick={() => downloadJSONReport('JSON file downloaded', null)}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: 'gray', borderColor: 'gray' }}
                  onClick={handleClickOpenSnackBar('JSON results saved into clipboard', null)}
                >
                  Copy
                </Button>
              </Stack>
            </AppBar>

            <Box sx={{ margin: '6%' }}>
              <pre>{JSON.stringify(jsonResult.jsonResults, undefined, 2)}</pre>
            </Box>
          </Dialog>

          {/* Test Runs info */}
          <Box sx={{ width: '97%', marginBottom: '2%', marginLeft: '2%' }}>
            <Typography variant="h4">
              <b>Test run {selectedTestRunFromDashboard?.id}</b>
            </Typography>
            <Button
              sx={{
                marginRight: '2%',
                marginTop: '1.1%',
                float: 'right',
                width: '7%',
                color: '#e535ab',
                borderColor: '#e535ab',
              }}
              onClick={() => handleClickOpenDialog(classesAndBenchmarksState, false)}
              variant="outlined"
            >
              Download
            </Button>
            <Typography style={{ color: 'grey' }}>Time of Run: {selectedTestRunFromDashboard?.date}</Typography>
            <Typography style={{ color: 'grey' }}>
              Git Commit Hash: {selectedTestRunFromDashboard?.commitHash}
            </Typography>
            <Typography style={{ color: 'grey' }}>Branch: {selectedTestRunFromDashboard?.branch}</Typography>
          </Box>

          {/* Father BOX */}
          <Box sx={{ marginLeft: '2%', width: '98%', display: 'flex', flexDirection: 'row' }}>
            {/* Lateral menu BOX */}
            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'fixed' }}>
              <Typography variant="h6" sx={{ marginBottom: '3%' }}>
                <b>Classes</b>
              </Typography>

              {classesAndBenchmarksState.map((item, i) => (
                <Typography
                  key={i}
                  variant="h7"
                  style={{
                    maxWidth: '63%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                >
                  <HashLink
                    smooth
                    to={`?report=${jobId}#${item[0]}`}
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    {item[0]}
                  </HashLink>
                </Typography>
              ))}
            </Box>

            {/* Charts BOX */}
            <Box sx={{ width: '100%', marginLeft: '15%', display: 'flex', flexDirection: 'row' }}>
              {/* Bar columns BOX */}

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {classesAndBenchmarksState.map((benchmarkData, i) => {
                  var currentChart = benchmarkData;
                  var nextChart = i <= classesAndBenchmarksState.length ? classesAndBenchmarksState[i + 1] : null;
                  if (i % 2 === 0 || i === 0) {
                    return (
                      <Box key={i} sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box key={i} sx={{ marginBottom: '3.6%', marginRight: '10%' }}>
                          <Typography variant="h5" id={`${currentChart[0]}`} sx={{ display: 'block' }}>
                            <b>{currentChart[0]}</b>
                          </Typography>
                          <IconButton
                            style={{ float: 'right' }}
                            edge="start"
                            color="inherit"
                            onClick={() => handleClickOpenDialog(currentChart[1], true)}
                            aria-label="open"
                          >
                            <MoreHorizIcon />
                          </IconButton>

                          <BarCharts classesAndBenchmarksState={currentChart[1]} />
                        </Box>

                        {nextChart ? (
                          <Box key={i + 1} sx={{ marginBottom: '3%' }}>
                            <Typography variant="h5" id={`${nextChart[0]}`} sx={{ display: 'block' }}>
                              <b>{nextChart[0]}</b>
                            </Typography>
                            <IconButton
                              style={{ float: 'right' }}
                              edge="start"
                              color="inherit"
                              onClick={() => handleClickOpenDialog(nextChart[1], true)}
                              aria-label="open"
                            >
                              <MoreHorizIcon />
                            </IconButton>
                            <BarCharts classesAndBenchmarksState={nextChart[1]} />
                          </Box>
                        ) : null}
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>
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
