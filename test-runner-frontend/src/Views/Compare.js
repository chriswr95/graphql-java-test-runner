import * as React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, IconButton, Snackbar, CircularProgress, Slide } from '@mui/material';
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
    buildIndividualJsonResults,
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
    improvedAndRegressedResults: {}
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
                    jobId: action.payload.jsonResults?.jobId,
                    jsonResults: action.payload.jsonResults?.jsonResults?.filter((_, index) => index % 2 === 0),
                },
                jsonResultTestRunB: {
                    className: action.payload.jsonResults?.className,
                    jobId: action.payload.jsonResults?.jobId,
                    jsonResults: action.payload.jsonResults?.jsonResults?.filter((_, index) => index % 2 !== 0),
                },
                selectedTab: '1',
            };
        case 'setClassesAndBenchmarksState':
            const classesAndBenchmarksA = buildChartsData(action.payload.testRunA);
            const classesAndBenchmarksB = buildChartsData(action.payload.testRunB);
            console.log(getImprovedVsRegressedValues(classesAndBenchmarksA, classesAndBenchmarksB));
            return {
                ...state,
                improvedAndRegressedResults: getImprovedVsRegressedValues(classesAndBenchmarksA, classesAndBenchmarksB),
                combinedClassesAndBenchmarksState: combineChartsData(classesAndBenchmarksA, classesAndBenchmarksB)
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
        navigator.clipboard.writeText(JSON.stringify(jsonResult.jsonResults, undefined, 2));
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
                        <TabContext value={selectedTab}>
                            <AppBar sx={{ position: 'relative', bgcolor: 'transparent' }}>
                                <Toolbar>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            widht: '57%',
                                            borderRadius: '0 0 12px 0',
                                            borderRight: '1.5px solid #e535ab',
                                            borderBottom: '1.5px solid #e535ab',
                                            pb: '1.5%',
                                            pt: '1.5%',
                                        }}
                                    >
                                        <TabList
                                            style={{ color: 'gray' }}
                                            onChange={handleChangeOnTabs}
                                            TabIndicatorProps={{ style: { background: 'darkgray' } }}
                                        >
                                            <Tab label="Test Run 1 results" value="1" />
                                            <Tab label="Test Run 2 results" value="2" />
                                        </TabList>
                                    </Box>

                                    <IconButton
                                        color="inherit"
                                        onClick={() => handleCloseDialog()}
                                        style={{ color: 'gray', position: 'absolute', right: '3%' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Toolbar>

                                <Typography sx={{ ml: '6%', mb: '3%', mt: '3%', flex: 1, color: 'black' }} variant="h6">
                                    <b>{jsonResult.className ? jsonResult.className : jsonResult.id}</b>
                                </Typography>

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
                                        onClick={() => handleClickOpenSnackBar('JSON results saved into clipboard', null)}
                                    >
                                        Copy
                                    </Button>
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
                            <Typography variant="h6" sx={{ marginBottom: '3%' }}>
                                <b>Classes</b>
                            </Typography>

                            {combinedClassesAndBenchmarksState?.map((item, i) => (
                                <Typography
                                    key={i}
                                    variant="h7"
                                    style={{
                                        maxWidth: '54%',
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
                                    height: `${(improvedAndRegressedResults?.improvedClasses?.length + improvedAndRegressedResults.regressedClasses?.length) * 2.5}vh`,
                                    marginBottom: '3%',
                                    backgroundColor: '#F1F1F1',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    borderRadius: '12px 12px 12px 12px',
                                }}
                            >
                                {/*  <Stack direction="row" spacing="1%" sx={{width: "300%", height: "30vh"}}> */}
                                {/* Left info */}

                                <Grid container spacing={1}>

                                    <Grid item xs={5}>
                                        <Box
                                            sx={{ marginLeft: '6%', marginTop: '3%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <Typography variant="h7" sx={{ marginLeft: '70%', marginBottom: '5%' }}>
                                                <b>Regressed</b>
                                            </Typography>

                                            {
                                                improvedAndRegressedResults.regressedClasses?.map((regressedClasses, i) => {
                                                    return (
                                                        <Stack key={i} direction="row" spacing={2} sx={{ width: '100%' }}>
                                                            <Typography
                                                                style={{
                                                                    maxWidth: '25%',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    display: 'block',
                                                                }}>{regressedClasses[0]}</Typography>
                                                            <ProgressBar style={{ width: '50%', height: '1vh', marginTop: '4%', direction: 'rtl' }}>
                                                                <ProgressBar variant="danger" now={(regressedClasses[1].improvementOrRegressionPercentage) * -10} />
                                                            </ProgressBar>
                                                            <Typography>{regressedClasses[1].improvementOrRegressionPercentage.toFixed(2)}%</Typography>
                                                        </Stack>
                                                    )
                                                })
                                            }



                                        </Box>

                                    </Grid>


                                    {/* Pie Chart BOX */}

                                    <Grid item xs={2}>
                                        <Box sx={{ textAlign: 'center', marginTop: '3%' }}>
                                            <Typography variant="h6" sx={{ alignItems: 'center' }}>
                                                <b>Total</b>
                                            </Typography>
                                            <PieChartComponent  totalImprovedScore={improvedAndRegressedResults.totalImprovedScore} totalRegressedScore={improvedAndRegressedResults.totalRegressedScore} />
                                        </Box>
                                    </Grid>



                                    {/* Right info */}
                                    <Grid item xs={5}>
                                        <Box
                                            sx={{ marginLeft: '6%', marginTop: '3%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <Typography variant="h7" sx={{ marginBottom: '5%' }}>
                                                <b>Improved</b>
                                            </Typography>

                                            {
                                                improvedAndRegressedResults.improvedClasses?.map((improvedClass, i) => {
                                                    return (
                                                        <Stack key={i} direction="row" spacing={2} sx={{ width: '100%' }}>
                                                            <Typography>{improvedClass[1].improvementOrRegressionPercentage.toFixed(2)}%</Typography>
                                                            <ProgressBar style={{ width: '36%', height: '1vh', marginTop: '4%', direction: 'ltr' }}>
                                                                <ProgressBar variant="success" now={improvedClass[1].improvementOrRegressionPercentage * 10} />
                                                            </ProgressBar>
                                                            <Typography
                                                                style={{
                                                                    maxWidth: '40%',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    display: 'block',
                                                                }}>{improvedClass[0]}</Typography>
                                                        </Stack>
                                                    )
                                                })
                                            }

                                        </Box>
                                    </Grid>

                                </Grid>


                            </Box>

                            {/* Ends PIE CHART */}

                            {/* Bar columns BOX */}

                            <Box sx={{ widht: '95%', marginLeft: '0%', marginTop: '3%', display: 'flex', flexDirection: 'row' }}>
                                <Box
                                    sx={{
                                        width: '45%',
                                        marginBottom: '2%',
                                        borderLeft: '3px solid #337ab7',
                                        borderBottom: '3.6px solid #337ab7',
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
                                        marginLeft: '2%',
                                        borderLeft: '3.6px solid #ff7f0e',
                                        borderBottom: '3px solid #ff7f0e',
                                        borderRadius: '0 0 0 12px',
                                        paddingLeft: '1%',
                                        paddingBottom: '1%',
                                    }}
                                >
                                    <Typography variant="h6">
                                        <b>Test run {selectedTestRunFromDashboardA?.id}</b>
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
