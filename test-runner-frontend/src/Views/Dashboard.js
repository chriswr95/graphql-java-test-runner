import * as React from 'react';
import { PerformanceChart } from '../Components/PerformanceChart';
import { RecentRunsTable } from '../Components/BarCharts';
import { WorstTrendingTable } from '../Components/WorstTrendingTable';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GraphQL_Logo from "../Assets/GraphQL_Java_Logo_v2.png"
import DropdownMenuAllTestRuns from '../Components/DropdownMenuAllTestRuns';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { useEffect, useState } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import db from './firebase';
import RunsTable from '../Components/RunsTable';
import TestRunsTable from '../Components/TestRunsTable';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

  const [checkBoxState, setCheckboxState] = React.useState(false);
  
  const [cancelButtonState, setCancelButtonState] = React.useState(false);
  //const [testResults, setTestResults] = useState([{ commitHash: "Loading...", id: "initial" }]);
  const [testResults, setTestResults] = useState([]);

  const navigate = useNavigate();


  function manageCompareAction(){
    if(checkBoxSelection.length === 2){
      setCheckBoxSelection([]);
      navigate("/report")
    }
    setCheckBoxSelection([]);
    setCheckboxState(!checkBoxState);
    setCancelButtonState(!cancelButtonState);
  }

  const handleCancel = () => {
    setCheckBoxSelection([]);
    setCheckboxState(false);
    setCancelButtonState(false);
  }

    useEffect(() => 
        () =>
            onSnapshot(collection(db, 'test-runs'), (snapshot) => 
                setTestResults(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            ),
        []
    );

    useEffect(() => {
      //alert("Avoid infite loop builingRows")
      buildRows()
    }, [testResults]);
  
/*
    const getInfo = () => {
      onSnapshot(collection(db, 'test-runs'), (snapshot) => 
                setTestResults(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
      )
      buildRows();
    }

    useEffect(() => {
      getInfo()
    }, []);
    */


    const [rowsF, setRowsF] = useState([]);
    const [allRows, setAllRows] = useState([]);

    var textArray = [
      'master',
      'add_error_logs',
      'save_data'
  ];

    const buildRows = () => {
      testResults?.sort((a,b) => a.testRunnerResults.core_32.startTime - b.testRunnerResults.core_32.startTime);
      testResults?.map((test) => {
        var timestamp = test.testRunnerResults.core_32.startTime;
        var date = new Date(timestamp * 1000);
        const newObj = {
            id: test.commitHash,
            branch: textArray[Math.floor(Math.random()*textArray.length)],
            status: test.status.core_32,
            benchmarks: test.testRunnerResults.core_32.testStatistics?.length,
            improvedVsRegresed: test.commitHash,
            date:  date.toLocaleString(), 
          }
         setRowsF(rowsF => [...rowsF, newObj]); 
         setAllRows(allRows => [...allRows, newObj]); 
      })
    };


    const childToParent = (dropdownSelection) => {
      if(dropdownSelection === "Master Only"){
        filterMasterBranch();
      }else{
        filterAllBranches();
      }
    }
  
    const filterMasterBranch = () => {
      const branch = "master"
      setRowsF(rowsF.filter(test => test.branch === branch));
    }

    const filterAllBranches = () => {
      setRowsF(allRows);
    }

    const sortBenchmarks = () => {
      allRows?.sort((a,b) => b.benchmarks - a.benchmarks);
      setRowsF(allRows);
    }

    const sortDate = () => {
      allRows?.sort((a,b) => b.date - a.date);
      setRowsF(allRows);
    }

    const [checkBoxSelection, setCheckBoxSelection] = React.useState([]);

    const childToParentCheckBox = (childToParentData) => {
      if(checkBoxSelection.find(checkBoxSelection => checkBoxSelection === childToParentData))
        setCheckBoxSelection(checkBoxSelection.filter(checkBoxSelection => checkBoxSelection !== childToParentData))
      else
        setCheckBoxSelection(checkBoxSelection => [...checkBoxSelection, childToParentData]);
      //console.log(childToParentData);
    }
  
  
  
     
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

      <Typography sx={{marginLeft: "2%", marginBottom: "0.5%"}} variant="h4">
        <b>Summary</b>
      </Typography>
      <br></br>
      
      
      <Stack sx={{marginBottom: "2%"}} direction="row" spacing={9}>

      <Box
      sx={{
        width: "100%",
        marginLeft: "2%",
        marginRight: "2%",
      }}>
     <Stack direction="row"> 
        <Typography variant="h5">
          <b>Test Runs</b>
        </Typography>
       {/* <Stack direction="row" spacing={2}> */}
         { 
          cancelButtonState
            ?
                <Button sx={{
                          color: "gray",
                          borderColor: "gray",
                          borderRadius: "9%",
                          position: "absolute",
                          right:"11.2%"
                        }}
                        variant="outlined"
                        onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
            :
                null
         }
          <Button sx={{
                    color: !checkBoxState ? "gray" : "#e535ab",
                    borderColor:  !checkBoxState ? "gray" : "#e535ab",
                    borderWidth: "2px",
                    borderRadius: "9%",
                    position: "absolute",
                    right:"2%"
                  }}
                  variant="outlined"
                  disabled={checkBoxState && checkBoxSelection.length != 2 ? true : false}
                  onClick={() => manageCompareAction()}
          >
            Compare
          </Button>
       {/* </Stack> */}
      </Stack> 

      

      <DropdownMenuAllTestRuns childToParent={childToParent}/>
      

      { checkBoxState === true 
          ?
          checkBoxSelection.length > 2 ?
            <Alert severity="warning" sx={{width: "30%", marginTop: "1.6%"}}>You can only select 2 test runs to compare!</Alert>
            :
          checkBoxSelection.length === 2 ?
            <Alert severity="success" sx={{width: "30%", marginTop: "1.6%"}}>Nice selection! You can now compare this 2 test runs</Alert>
              :
            <Alert severity="info" sx={{width: "30%", marginTop: "1.6%"}}>Select {2 - checkBoxSelection.length} Test Runs to compare</Alert>
          :
            null         
      }

      
      
      <TestRunsTable childToParentCheckBox={childToParentCheckBox} checkBoxState={checkBoxState} testResults={testResults} rowsF={rowsF} sortBenchmarks={sortBenchmarks} sortDate={sortDate}/>

      </Box>
      
      </Stack>


 
        <Box sx={{width: "100%", bottom: "5%", position: 'absolute'}} >
 
            <Typography variant="h7" sx={{color: "gray", left: "3%", position: 'absolute'}} >
              <b>v1.0</b>
            </Typography>

            <Typography variant="h7" sx={{color: "gray", left: "9%", position: 'absolute'}} >
              Updated July, 2022
            </Typography>
     
        

        <Typography variant="h7" sx={{color: "gray", right: "3%", position: 'absolute'}} >
          Created by Twitter, Inc.
        </Typography>

        </Box>
     
      
    </div>
  );
}