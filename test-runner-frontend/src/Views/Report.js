import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  ListItem,
  List,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  CircularProgress,
  Slide,
} from '@mui/material';
import GraphQL_Logo from '../Assets/GraphQL_Java_Logo_v2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from 'react-router-hash-link';
import BarCharts from '../Components/BarChart';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useReducer } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, Dialog } from '@material-ui/core';
import { fontWeight, Stack } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { builChartsData, buildJsonResults, downloadJSON, printPDF } from './ReportUtils';
import { Link } from 'react-router-dom';

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
  open: false,
  classesAndBenchmarksState: [],
  jsonResult: {},
  fromCopy: {},
  openSnackBar: false,
  loadingState: true,
  snackBarMessage: '',
  snackBarMessageDuration: null,
  transitionSnackBar: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'handleDialog':
      return {
        ...state,
        open: action.payload.isOpen,
        jsonResult: action.payload.jsonResults,
      };
    case 'setClassesAndBenchmarksState':
      return {
        ...state,
        classesAndBenchmarksState: action.payload,
        loadingState: false,
      };
    case 'setFromCopy':
      return {
        ...state,
        fromCopy: action.payload,
      };
    case 'handleSnackBar':
      return {
        ...state,
        transitionSnackBar: action.payload.transition,
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

  const {
    open,
    classesAndBenchmarksState,
    jsonResult,
    fromCopy,
    openSnackBar,
    loadingState,
    snackBarMessage,
    snackBarMessageDuration,
    transitionSnackBar,
  } = state;

  const location = useLocation();
  const classes = useStyles();
  const { from } = location.state ? location.state : fromCopy;
  var arrayBenchmarks = [];

  const handleClickOpenSnackBar = (Transition, message, messageDuration) => () => {
    dispatch({
      type: 'handleSnackBar',
      payload: { transition: Transition, message: message, isOpen: true, messageDuration: messageDuration },
    });
    navigator.clipboard.writeText(JSON.stringify(jsonResult.jsonResults, undefined, 2));
  };

  const handleCloseSnackBar = () => {
    dispatch({ type: 'handleSnackBar', payload: { transition: undefined, message: '', isOpen: false } });
  };

  const getBenchmarks = () => {
    dispatch({ type: 'setClassesAndBenchmarksState', payload: builChartsData(from) });
  };

  useEffect(() => {
    getBenchmarks();
    dispatch({ type: 'setFromCopy', payload: from });
    // eslint-disable-next-line
  }, []);

  const handleClickOpenDialog = (benchmarks) => {
    dispatch({ type: 'handleDialog', payload: { isOpen: true, jsonResults: buildJsonResults(benchmarks) } });
  };

  const handleCloseDialog = () => {
    dispatch({ type: 'handleDialog', payload: { isOpen: false, jsonResults: {} } });
  };

  const downloadJSONReport = (Transition, message, messageDuration) => {
    dispatch({
      type: 'handleSnackBar',
      payload: { transition: Transition, message: message, isOpen: true, messageDuration: messageDuration },
    });
    downloadJSON(jsonResult.className, jsonResult.jobId, jsonResult.jsonResults);
  };

  const downloadPDF = (Transition, message, messageDuration) => {
    dispatch({
      type: 'handleSnackBar',
      payload: { transition: Transition, message: message, isOpen: true, messageDuration: messageDuration },
    });
    printPDF();
  };

  return (
    <div>
      {loadingState === true ? (
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            marginTop: 0,
            marginLeft: 0,
          }}
        >
          <CircularProgress style={{ width: '10vh' }} color="secondary" />
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
              color: '#e535ab',
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
            open={open}
            onClose={() => handleCloseDialog()}
          >
            <AppBar sx={{ position: 'relative', bgcolor: 'transparent' }}>
              <Toolbar>
                <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
                  <b>{jsonResult.className}</b>
                </Typography>
                <IconButton color="inherit" onClick={() => handleCloseDialog()} sx={{ color: 'gray' }}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>

              <Stack direction="row" spacing={2} style={{ marginLeft: '6%', marginBottom: '3%' }}>
                <Button
                  variant="outlined"
                  sx={{ color: '#e535ab', borderColor: '#e535ab' }}
                  onClick={() => downloadJSONReport(TransitionSnackBar, 'JSON file downloaded', null)}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: 'gray', borderColor: 'gray' }}
                  onClick={handleClickOpenSnackBar(TransitionSnackBar, 'JSON results saved into clipboard', null)}
                >
                  Copy
                </Button>
              </Stack>
            </AppBar>

            <List>
              <ListItem>
                <pre>{JSON.stringify(jsonResult.jsonResults, undefined, 2)}</pre>
              </ListItem>
              <Divider />
            </List>
          </Dialog>

          {/* Test Runs info */}
          <Box sx={{ width: '97%', marginBottom: '2%', marginLeft: '2%' }}>
            <Typography variant="h4">
              <b>Test run {from?.id ? from?.id : fromCopy?.id}</b>
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
              id="print"
              onClick={() => downloadPDF(TransitionSnackBar, 'Your PDF has started downloading', 2500)}
              variant="outlined"
            >
              Download
            </Button>
            <Typography style={{ color: 'grey' }}>Time of Run: {from?.date ? from?.date : fromCopy?.date}</Typography>
            <Typography style={{ color: 'grey' }}>
              Git Commit Hash: {from?.commitHash ? from?.commitHash : fromCopy?.commitHash}
            </Typography>
            <Typography style={{ color: 'grey' }}>Branch: {from?.branch ? from?.branch : fromCopy?.branch}</Typography>
          </Box>

          {/* Father BOX */}
          <Box sx={{ marginLeft: '2%', width: '98%', display: 'flex', flexDirection: 'row' }}>
            {/* Lateral menu BOX */}
            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'fixed' }}>
              <HashLink smooth to="/report/#Summary" style={{ textDecoration: 'none', color: 'black' }}>
                {' '}
                <Typography variant="h6" sx={{ marginBottom: '3%' }}>
                  <b>Benchmarks</b>
                </Typography>{' '}
              </HashLink>

              {Object.keys(classesAndBenchmarksState).map((item, i) => (
                <HashLink key={i} smooth to={`/report/#${item}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <Typography
                    variant="h7"
                    style={{
                      maxWidth: '63%',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      display: 'block',
                    }}
                  >
                    {item}
                  </Typography>
                </HashLink>
              ))}
            </Box>

            {/* Charts BOX */}
            <Box sx={{ width: '100%', marginLeft: '15%', display: 'flex', flexDirection: 'row' }}>
              {/* Bar columns BOX */}

              <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                {Object.entries(classesAndBenchmarksState).map((benchmarkData, i) => {
                  arrayBenchmarks.push(benchmarkData);
                  return null;
                })}
                {arrayBenchmarks.map((benchmarkData, i) => {
                  var currentChart = benchmarkData;
                  var nextChart = i <= arrayBenchmarks.length ? arrayBenchmarks[i + 1] : null;
                  if (i % 2 === 0 || i === 0) {
                    return (
                      <Box key={i} sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box key={i} sx={{ marginBottom: '3%', marginRight: '21%' }}>
                          <Typography variant="h5" id={`${currentChart[0]}`} sx={{ display: 'block' }}>
                            <b>{currentChart[0]}</b>
                          </Typography>
                          <IconButton
                            style={{ float: 'right' }}
                            edge="start"
                            color="inherit"
                            onClick={() => handleClickOpenDialog(currentChart[1])}
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
                              onClick={() => handleClickOpenDialog(nextChart[1])}
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
              TransitionComponent={transitionSnackBar}
              message={snackBarMessage}
              key={transitionSnackBar ? transitionSnackBar.name : ''}
            />
          </Box>
        </div>
      )}
    </div>
  );
}
