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
import PieChartComponent from '../Components/PieChartComponent';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';

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
    classesAndBenchmarksStateA: [],
    // Data that will be used to build charts.
    classesAndBenchmarksStateB: [],
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
        case 'setClassesAndBenchmarksStateA':
            return {
                ...state,
                classesAndBenchmarksStateA: action.payload,
            };
        case 'setClassesAndBenchmarksStateB':
            return {
                ...state,
                classesAndBenchmarksStateB: action.payload,
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

export default function Compare() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { loading, firestoreData } = React.useContext(FirestoreContext);

    const { jobIdA, jobIdB } = useParams();

    const { openDialog, classesAndBenchmarksStateA, classesAndBenchmarksStateB, jsonResult, openSnackBar, snackBarMessage, snackBarMessageDuration } =
        state;

    const classes = useStyles();

    const selectedTestRunFromDashboardA = React.useMemo(() => {
        if (firestoreData !== undefined) {
            return firestoreData.find((jobA) => {
                return jobIdA === jobA.id;
            });
        }
    }, [firestoreData]);

    const selectedTestRunFromDashboardB = React.useMemo(() => {
        if (firestoreData !== undefined) {
            return firestoreData.find((jobB) => {
                return jobIdB === jobB.id;
            });
        }
    }, [firestoreData]);

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
        if (selectedTestRunFromDashboardA !== undefined && selectedTestRunFromDashboardA !== undefined) {
            dispatch({ type: 'setClassesAndBenchmarksStateA', payload: buildChartsData(selectedTestRunFromDashboardA) });
            dispatch({ type: 'setClassesAndBenchmarksStateB', payload: buildChartsData(selectedTestRunFromDashboardB) });
        }
    }, [selectedTestRunFromDashboardA, selectedTestRunFromDashboardB]);

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

                    {/* Father BOX */}
                    <Box sx={{ marginLeft: '2%', width: '98%', display: 'flex', flexDirection: 'row' }}>
                        {/* Lateral menu BOX */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'fixed' }}>
                            <Typography variant="h6" sx={{ marginBottom: '3%' }}>
                                <b>Classes</b>
                            </Typography>

                            {classesAndBenchmarksStateA.map((item, i) => (
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
                                        to={`/compare/${jobIdA}/#${item[0]}`}
                                        style={{ textDecoration: 'none', color: 'black' }}
                                    >
                                        {item[0]}
                                    </HashLink>
                                </Typography>
                            ))}
                        </Box>
                        

                        {/* Charts BOX */}
                        <Box sx={{width: '100%', marginLeft: '15%'}}>

                        {/* Start PIE CHART */}


                        <Typography variant='h4' id='Summary'><b>Summary</b></Typography>
                        {/* Top BOX */}
                    <Box sx={{ width: "95%", height: "34vh", marginBottom: "3%", backgroundColor: "#F1F1F1", display: "flex", flexDirection: "row" }}>
                        {/*  <Stack direction="row" spacing="1%" sx={{width: "300%", height: "30vh"}}> */}
                        {/* Left info */}

                        <Box sx={{ widht: "100%", marginLeft: "6%", marginTop: "3%", display: "flex", flexDirection: "column" }}>
                            <Typography variant='h7' sx={{ marginLeft: "70%", marginBottom: "5%" }}><b>Regressed</b></Typography>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 1</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }} >
                                    <ProgressBar variant="danger" now={90} />
                                </ProgressBar>
                                <Typography>- 90%</Typography>
                            </Stack>

                            {/*Delete all these stacks when data is dynamical */}

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 2</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={70} />
                                </ProgressBar>
                                <Typography>- 70%</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 3</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={50} />
                                </ProgressBar>
                                <Typography>- 50%</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 4</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={40} />
                                </ProgressBar>
                                <Typography>- 40%</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 5</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={33} />
                                </ProgressBar>
                                <Typography>- 33%</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 6</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={25} />
                                </ProgressBar>
                                <Typography>- 25%</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>Class 7</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%", direction: 'rtl' }}>
                                    <ProgressBar variant="danger" now={10} />
                                </ProgressBar>
                                <Typography>- 10%</Typography>
                            </Stack>

                        </Box>

                        {/* Pie Chart BOX */}

                        <Box sx={{ width: "40%", textAlign: "center", marginTop: "3%" }}>
                            <Typography variant="h6" sx={{ alignItems: "center" }}><b>Total</b></Typography>
                            <PieChartComponent />
                        </Box>



                        {/* Right info */}
                        <Box sx={{ widht: "100%", marginLeft: "0%", marginTop: "3%", display: "flex", flexDirection: "column" }}>
                            <Typography variant='h7' sx={{ marginBottom: "5%" }}><b>Improved</b></Typography>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 10%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={10} />
                                </ProgressBar>
                                <Typography>Class 1</Typography>
                            </Stack>

                            {/*Delete all this stacks when data is dynamical */}

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 30%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={30} />
                                </ProgressBar>
                                <Typography>Class 2</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 50%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={50} />
                                </ProgressBar>
                                <Typography>Class 3</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 60%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={60} />
                                </ProgressBar>
                                <Typography>Class 4</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 66%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={66} />
                                </ProgressBar>
                                <Typography>Class 5</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 75%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={75} />
                                </ProgressBar>
                                <Typography>Class 7</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ width: "32vh" }}>
                                <Typography>+ 90%</Typography>
                                <ProgressBar style={{ width: "50%", height: "1vh", marginTop: "4%" }}>
                                    <ProgressBar variant="success" now={90} />
                                </ProgressBar>
                                <Typography>Class 7</Typography>
                            </Stack>

                        </Box>



                        {/*  </Stack>  */}
                    </Box>


                     {/* Ends PIE CHART */}

                        
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>

                        

                        


                            {/* Bar columns BOX */}

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ width: '95%', marginBottom: '2%', marginLeft: '2%' }}>
                                    <Typography variant="h6">
                                        <b>Test run {selectedTestRunFromDashboardA?.id}</b>
                                    </Typography>
                                    <Typography style={{ color: 'grey' }}>Time of Run: {selectedTestRunFromDashboardA?.date}</Typography>
                                    <Typography style={{ color: 'grey' }}>
                                        Git Commit Hash: {selectedTestRunFromDashboardA?.commitHash}
                                    </Typography>
                                    <Typography style={{ color: 'grey' }}>Branch: {selectedTestRunFromDashboardA?.branch}</Typography>
                                </Box>
                                {classesAndBenchmarksStateA?.map((benchmarkData, i) => {
                                    var currentChart = benchmarkData;
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
                                        </Box>
                                    );
                                }
                                )}
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ width: '95%', marginBottom: '2%', marginLeft: '2%' }}>
                                    <Typography variant="h6">
                                        <b>Test run {selectedTestRunFromDashboardB?.id}</b>
                                    </Typography>
                                    <Typography style={{ color: 'grey' }}>Time of Run: {selectedTestRunFromDashboardB?.date}</Typography>
                                    <Typography style={{ color: 'grey' }}>
                                        Git Commit Hash: {selectedTestRunFromDashboardB?.commitHash}
                                    </Typography>
                                    <Typography style={{ color: 'grey' }}>Branch: {selectedTestRunFromDashboardB?.branch}</Typography>
                                </Box>
                                {classesAndBenchmarksStateB?.map((benchmarkData, i) => {
                                    var currentChart = benchmarkData;
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
                                        </Box>
                                    );
                                }
                                )}
                            </Box>
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
