import { Box } from '@mui/material';
import * as React from 'react';
import Typography from "@mui/material/Typography";
import GraphQL_Logo from "../Assets/GraphQL_Java_Logo_v2.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from 'react-router-hash-link';
import BarCharts from '../Components/BarChart';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Report() {
    const location = useLocation()
    const { from } = location?.state;

    const classesAndBenchmarks = {};
    var arrayBenchmarks = [];
    // console.log(from);

    const [classesAndBenchmarksState, setClassesAndBenchmarksState] = useState({});

    const getBenchmarks = () => {
        from?.statistics?.map(testRun => {
            var benchmarkCassAndMethod = testRun.benchmark.split(".");
            var benchmarkClass = benchmarkCassAndMethod[1] + "-" + testRun.mode;
            var benchmarkMethod = benchmarkCassAndMethod[2];
            var benchmarkData = {
                "benchmarkMethod": benchmarkMethod,
                "benchmarkScore": testRun.primaryMetric.score,
                "benchmarkError": testRun.primaryMetric.scoreError,
                "mode": testRun.mode
            }
            classesAndBenchmarks[benchmarkClass] ??= [];
            classesAndBenchmarks[benchmarkClass].push(benchmarkData);
        });
        var sortedByClassNameClassesAndBenchmarks = Object.keys(classesAndBenchmarks)
            .sort()
            .reduce((acc, key) => ({
                ...acc, [key]: classesAndBenchmarks[key]
            }), {})

        setClassesAndBenchmarksState(sortedByClassNameClassesAndBenchmarks);
    }

    useEffect(() => {
        getBenchmarks();
    }, []);

    return (
        <div>
            <img
                style={{
                    marginLeft: "2%",
                    marginTop: "0.5%",
                    marginBottom: "1%",
                    width: "18%"
                }}
                src={GraphQL_Logo}
                alt="GraphQL Java Logo"
            />

            {/* Test Runs info */}
            <Box sx={{ width: "95%", marginBottom: "2%", marginLeft: "2%" }}>
                <Typography variant='h4'><b>Test run {from?.id}</b></Typography>
                <Typography style={{ color: "grey" }}>Time of Run: {from?.date}</Typography>
                <Typography style={{ color: "grey" }}>Git Commit Hash: {from?.commitHash}</Typography>
                <Typography style={{ color: "grey" }}>Branch: {from?.branch}</Typography>
            </Box>

            {/* Father BOX */}
            <Box sx={{ marginLeft: "2%", width: "100%", display: "flex", flexDirection: "row" }}>




                {/* Lateral menu BOX */}
                <Box sx={{ display: "flex", flexDirection: "column", position: "fixed" }}>
                    <HashLink smooth to='/report/#Summary' style={{ textDecoration: 'none', color: 'black' }}> <Typography variant='h6' sx={{ marginBottom: "3%" }}><b>Benchmarks</b></Typography> </HashLink>

                    {
                        Object.keys(classesAndBenchmarksState).map((item, i) => (

                            <HashLink key={i} smooth to={`/report/#${item}`} style={{ textDecoration: 'none', color: 'black' }} >
                                <Typography variant='h7' style={{ maxWidth: "63%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", display: "block" }} >{item}</Typography>
                            </HashLink>


                        ))

                    }

                </Box>

                {/* Charts BOX */}
                <Box sx={{ width: "84%", marginLeft: "15%", display: "flex", flexDirection: "row" }}>
                    {/* Bar columns BOX */}

                    <Box sx={{ width: "50%", display: "flex", flexDirection: "column" }}>




                        {
                            
                            Object.entries(classesAndBenchmarksState).map((benchmarkData, i) => {
                                arrayBenchmarks.push(benchmarkData);
                            })
                            
}           
{
                            
                            arrayBenchmarks.map((benchmarkData, i) => {
                                var currentChart = arrayBenchmarks[i];
                                var nextChart = i<=arrayBenchmarks.length ? arrayBenchmarks[i+1] : null;
                                if(i % 2 == 0 || i == 0){
                                return(

                                    <Box  sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
    
                                    <Box key={i} sx={{ marginBottom: "3%", marginRight: "21%" }}>
                                        <Typography variant='h5' id={`${currentChart[0]}`}><b>{currentChart[0]}</b></Typography>
                                        {/* <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label={benchmarkData[1].mode} /> */}
                                        <BarCharts classesAndBenchmarksState={currentChart[1]} />
                                    </Box>

                                    {

                                    nextChart ?
    
                                    <Box key={i+1} sx={{ marginBottom: "3%" }}>
                                    <Typography variant='h5' id={`${nextChart[0]}`}><b>{nextChart[0]}</b></Typography>
                                        {/* <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label={benchmarkData[1].mode} /> */}
                                        <BarCharts classesAndBenchmarksState={nextChart[1]} />
                                    </Box>

                                    :

                                    null
    
                                    
                                    
                                    }

                                    </Box>
                                );
                                }
                            })

                        }
                        {/*
                        <Box sx={{ width: "50%",  display: "flex", flexDirection: "column" }}>
                            <Box sx={{marginBottom: "3%"}}>
                                <Typography variant='h5'><b>Benchmark Class 1</b></Typography>
                                <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                                <BarCharts />
                            </Box>
                
                            
                        </Box>

                */}
                    </Box>
                </Box>


            </Box>
        </div>
    );
}