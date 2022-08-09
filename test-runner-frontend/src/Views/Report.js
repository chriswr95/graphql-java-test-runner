import { Box, Link, Stack } from '@mui/material';
import * as React from 'react';
import RecentRunsTable from '../Components/BarCharts';
import Typography from "@mui/material/Typography";
import GraphQL_Logo from "../Assets/GraphQL_Java_Logo_v2.png"
import PieChart from '../Components/PieChartComponent';
import PieChartComponent from '../Components/PieChartComponent';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chip from '@mui/material/Chip';
import { HashLink } from 'react-router-hash-link';


export default function Report() {
    return(
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

      <Typography sx={{marginLeft: "2%", marginBottom: "0.5%"}} variant="h5">
        <b>Compare Test Runs</b>
      </Typography>
      <br></br>

      {/* Father BOX */}
        <Box sx={{marginLeft: "2%", width: "100%", display:"flex", flexDirection:"row"}}>


            

                {/* Lateral menu BOX */}
                <Box sx={{display:"flex", flexDirection:"column", position: "fixed"}}>
                <HashLink smooth to='/report/#Summary' style={{textDecoration: 'none', color:'black'}}> <Typography variant='h6' sx={{marginBottom: "3%"}}><b>Summary</b></Typography> </HashLink>
                <HashLink smooth to='/report/#Class1' style={{textDecoration: 'none', color:'black'}}>  <Typography variant='h7'>Benchmark Class 1</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class2' style={{textDecoration: 'none', color:'black'}}>  <Typography variant='h7'>Benchmark Class 2</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class3'style={{textDecoration: 'none', color:'black'}} >  <Typography variant='h7'>Benchmark Class 3</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class4' style={{textDecoration: 'none', color:'black'}}>  <Typography variant='h7'>Benchmark Class 4</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class5' style={{textDecoration: 'none', color:'black'}}>  <Typography variant='h7'>Benchmark Class 5</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class6'style={{textDecoration: 'none', color:'black'}} >  <Typography variant='h7'>Benchmark Class 6</Typography>  </HashLink>
                <HashLink smooth to='/report/#Class7' style={{textDecoration: 'none', color:'black'}}>  <Typography variant='h7'>Benchmark Class 7</Typography>  </HashLink>               
                </Box>

                {/* Charts BOX */}
                <Box sx={{width: "84%", marginLeft: "15%"}}>
                    <Typography variant='h5' id='Summary'><b>Summary</b></Typography>
                    {/* Top BOX */}
                    <Box sx={{width: "95%", height: "34vh", marginBottom: "3%", backgroundColor: "#F1F1F1", display:"flex", flexDirection:"row"}}>
                      {/*  <Stack direction="row" spacing="1%" sx={{width: "300%", height: "30vh"}}> */}
                            {/* Left info */}
                            
                            <Box sx={{widht: "100%", marginLeft: "6%", marginTop: "3%", display:"flex", flexDirection:"column"}}>
                                <Typography variant='h7' sx={{marginLeft: "70%", marginBottom: "5%"}}><b>Regressed</b></Typography>
                                
                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 1</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={90}/>
                                </ProgressBar>
                                <Typography>- 90%</Typography>
                                </Stack>

                                {/*Delete all these stacks when data is dynamical */}

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 2</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={70}/>
                                </ProgressBar>
                                <Typography>- 70%</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 3</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={50}/>
                                </ProgressBar>
                                <Typography>- 50%</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 4</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={40}/>
                                </ProgressBar>
                                <Typography>- 40%</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 5</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={33}/>
                                </ProgressBar>
                                <Typography>- 33%</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 6</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={25}/>
                                </ProgressBar>
                                <Typography>- 25%</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>Class 7</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="danger" now={10}/>
                                </ProgressBar>
                                <Typography>- 10%</Typography>
                                </Stack>
                                
                            </Box>

                            {/* Pie Chart BOX */}
                    
                            <Box sx={{width: "40%", textAlign: "center", marginTop: "3%"}}>
                            <Typography variant="h6" sx={{alignItems: "center"}}><b>Total</b></Typography>
                            <PieChartComponent/> 
                            </Box>
                         
                            

                            {/* Right info */}
                            <Box sx={{widht: "100%", marginLeft: "0%", marginTop: "3%", display:"flex", flexDirection:"column"}}>
                                <Typography variant='h7' sx={{marginBottom: "5%"}}><b>Improved</b></Typography>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 10%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={10} />
                                </ProgressBar>
                                <Typography>Class 1</Typography>
                                </Stack>

                                {/*Delete all this stacks when data is dynamical */}

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 30%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={30} />
                                </ProgressBar>
                                <Typography>Class 2</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 50%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={50} />
                                </ProgressBar>
                                <Typography>Class 3</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 60%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={60} />
                                </ProgressBar>
                                <Typography>Class 4</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 66%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={66} />
                                </ProgressBar>
                                <Typography>Class 5</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 75%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={75} />
                                </ProgressBar>
                                <Typography>Class 7</Typography>
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{width: "32vh"}}>
                                <Typography>+ 90%</Typography>
                                <ProgressBar style={{width: "50%", height: "1vh", marginTop:"4%"}}>
                                    <ProgressBar variant="success" now={90} />
                                </ProgressBar>
                                <Typography>Class 7</Typography>
                                </Stack>

                            </Box>
                            
                           
                            
                      {/*  </Stack>  */}
                    </Box>

                    {/* Test runs table */}
                    <Stack direction="row" spacing="5%">
                        <Box sx={{width: "50%", display:"flex", flexDirection:"column"}}>
                            <Typography variant='h6'><b>Test run 117acea6-141f-11ed-861d-0242ac120002</b></Typography>
                            <Typography style={{color:"grey"}}>Time of Run: 10:34 AM PST - July 20, 2022</Typography>
                            <Typography style={{color:"grey"}}>Git Commit Hash: 64df49a7ddaa55f3gg7jhgk976963</Typography>
                            <Typography style={{color:"grey"}}>Branch: Master</Typography>
                        </Box>

                        <Box sx={{width: "50%", display:"flex", flexDirection:"column"}}>
                            <Typography variant='h6'><b>Test run 1cb67c3e-141f-11ed-861d-0242ac120002</b></Typography>
                            <Typography style={{color:"grey"}}>Time of Run: 10:34 AM PST - July 20, 2022</Typography>
                            <Typography style={{color:"grey"}}>Git Commit Hash: 64df49a7ddaa55f3gg7jhgk976963</Typography>
                            <Typography style={{color:"grey"}}>Branch: Master</Typography>
                        </Box>

                        {/*Delete all this boxes when data is dynamical */}
                    </Stack>

                    <Box>
                    {/* Bar columns BOX */}
                        <Stack direction="row" spacing="5%" sx={{marginTop: "4.5%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class1'><b>Benchmark Class 1</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 1</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>

                        {/*Delete all this boxes when data is dynamical */}

                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class2'><b>Benchmark Class 2</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 2</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>

                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class3'><b>Benchmark Class 3</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 3</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>

                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class4'><b>Benchmark Class 4</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 4</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>


                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class5'><b>Benchmark Class 5</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 5</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>


                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class6'><b>Benchmark Class 6</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 6</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>


                        <Stack direction="row" spacing="5%" sx={{marginTop: "3%"}}>
                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5' id='Class7'><b>Benchmark Class 7</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                            <Box sx={{width: "50%"}}>
                                <Typography variant='h5'><b>Benchmark Class 7</b></Typography>
                                <Chip sx={{marginBottom: "3.6%", backgroundColor:"F1F1F1"}} label="Throughput" />
                                <RecentRunsTable/>
                            </Box>

                        </Stack>
                    </Box>

                </Box>
           
        </Box>
     </div>
    );
}