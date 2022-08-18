import { Box, Link, Stack } from '@mui/material';
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
    console.log(from);

    const classesAndBenchmarks = new Map();

    const getBenchmarks = () => {
        from.statistics?.map(testRun => {
            var benchmarkData = testRun.benchmark.split(".");
            var benchmarkClass = benchmarkData[1];
            var benchmarkMethod = benchmarkData[2];
            classesAndBenchmarks[benchmarkClass] ??= [];
            classesAndBenchmarks[benchmarkClass].push(benchmarkMethod);
        });
        console.log(classesAndBenchmarks);
    }

    useEffect(() => {
        //alert("Avoid infite loop builingRows")
        getBenchmarks();
    }, [classesAndBenchmarks]);

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
                        /*
                        Array.from(classesAndBenchmarks)?.map((benchmarkClass) => {
                          <HashLink smooth to={`/report/#${benchmarkClass}`} style={{ textDecoration: 'none', color: 'black' }}> <Typography variant='h7'>${benchmarkClass}</Typography> </HashLink>
                        })
                        */


                        classesAndBenchmarks.map(benchmarkClass => {
                            return benchmarkClass.map(benchmarkMethod => (
                              <HashLink key={benchmarkClass.id} smooth to={`/report/#${benchmarkClass}`} style={{ textDecoration: 'none', color: 'black' }}>
                                {benchmarkClass}
                              </HashLink>
                            ))
                        })
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
                <Box sx={{ width: "84%", marginLeft: "15%" }}>
                    {/* Bar columns BOX */}
                    <Stack direction="row" spacing="5%" sx={{ marginTop: "0/3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class1'><b>Benchmark Class 1</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 1</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>

                    {/*Delete all this boxes when data is dynamical */}

                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class2'><b>Benchmark Class 2</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 2</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>

                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class3'><b>Benchmark Class 3</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 3</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>

                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class4'><b>Benchmark Class 4</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 4</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>


                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class5'><b>Benchmark Class 5</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 5</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>


                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class6'><b>Benchmark Class 6</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 6</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>


                    <Stack direction="row" spacing="5%" sx={{ marginTop: "3%" }}>
                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5' id='Class7'><b>Benchmark Class 7</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                        <Box sx={{ width: "50%" }}>
                            <Typography variant='h5'><b>Benchmark Class 7</b></Typography>
                            <Chip sx={{ marginBottom: "3.6%", backgroundColor: "F1F1F1" }} label="Throughput" />
                            <BarCharts />
                        </Box>

                    </Stack>
                </Box>


            </Box>
        </div>
    );
}