import { Box, getListItemTextUtilityClass, Link, Stack } from '@mui/material';
import * as React from 'react';
import Typography from "@mui/material/Typography";
import GraphQL_Logo from "../Assets/GraphQL_Java_Logo_v2.png"
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chip from '@mui/material/Chip';
import { HashLink } from 'react-router-hash-link';
import BarCharts from '../Components/BarChart';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Report() {
    const location = useLocation()
    const { from } = location.state

    const classesAndBenchmarks = {};

    const classesAndBenchmarksLength = ["1", "2"];

    const [classesAndBenchmarksState, setClassesAndBenchmarksState] = useState({});

    const getBenchmarks = () => {
        from.statistics?.map(testRun => {
            var benchmarkData = testRun.benchmark.split(".");
            var benchmarkClass = benchmarkData[1];
            var benchmarkMethod = benchmarkData[2];
            classesAndBenchmarks[benchmarkClass] ??= [];
            classesAndBenchmarks[benchmarkClass].push(benchmarkMethod);
        });
        console.log(classesAndBenchmarks);
        setClassesAndBenchmarksState(classesAndBenchmarks);
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
            />

            {/* Test Runs info */}
            <Box sx={{ width: "95%", marginBottom: "2%", marginLeft: "2%" }}>
                <Typography variant='h4'><b>Test run {from.id}</b></Typography>
                <Typography style={{ color: "grey" }}>Time of Run: 10:34 AM PST - July 20, 2022</Typography>
                <Typography style={{ color: "grey" }}>Git Commit Hash: {from.commitHash}</Typography>
                <Typography style={{ color: "grey" }}>Branch: {from.branch}</Typography>
            </Box>

            {/* Father BOX */}
            <Box sx={{ marginLeft: "2%", width: "100%", display: "flex", flexDirection: "row" }}>




                {/* Lateral menu BOX */}
                <Box sx={{ display: "flex", flexDirection: "column", position: "fixed" }}>
                    <HashLink smooth to='/report/#Summary' style={{ textDecoration: 'none', color: 'black' }}> <Typography variant='h6' sx={{ marginBottom: "3%" }}><b>Benchmarks</b></Typography> </HashLink>

                    {
                        Object.keys(classesAndBenchmarksState).map((item, i) => (
                            <HashLink key={i} smooth to={`/report/#${item}`} style={{ textDecoration: 'none', color: 'black' }} >
                                <Typography variant='h7' >{item}</Typography>
                            </HashLink>


                        ))

                    }

                    {/*
                    <HashLink smooth to='/report/#Summary' style={{ textDecoration: 'none', color: 'black' }}> <Typography variant='h6' sx={{ marginBottom: "3%" }}><b>Benchmarks</b></Typography> </HashLink>
                    <HashLink smooth to='/report/#Class1' style={{ textDecoration: 'none', color: 'black' }}>  <Typography variant='h7'>Benchmark Class 1</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class2' style={{ textDecoration: 'none', color: 'black' }}>  <Typography variant='h7'>Benchmark Class 2</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class3' style={{ textDecoration: 'none', color: 'black' }} >  <Typography variant='h7'>Benchmark Class 3</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class4' style={{ textDecoration: 'none', color: 'black' }}>  <Typography variant='h7'>Benchmark Class 4</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class5' style={{ textDecoration: 'none', color: 'black' }}>  <Typography variant='h7'>Benchmark Class 5</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class6' style={{ textDecoration: 'none', color: 'black' }} >  <Typography variant='h7'>Benchmark Class 6</Typography>  </HashLink>
                    <HashLink smooth to='/report/#Class7' style={{ textDecoration: 'none', color: 'black' }}>  <Typography variant='h7'>Benchmark Class 7</Typography>  </HashLink>
                    */}
                </Box>

                {/* Charts BOX */}
                <Box sx={{ width: "84%", marginLeft: "15%", display: "flex", flexDirection: "row" }}>
                    {/* Bar columns BOX */}

                        <Box sx={{ width: "50%", display: "flex", flexDirection: "column" }}>
                            <Box sx={{marginBottom: "3%"}}>
                                <Typography variant='h5' id='Class1'><b>Benchmark Class 1</b></Typography>
                                <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                                <BarCharts />
                            </Box>
                        </Box>

                        <Box sx={{ width: "50%",  display: "flex", flexDirection: "column" }}>
                            <Box sx={{marginBottom: "3%"}}>
                                <Typography variant='h5'><b>Benchmark Class 1</b></Typography>
                                <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                                <BarCharts />
                            </Box>

                            
                        </Box>

                    
                </Box>


            </Box>
        </div>
    );
}