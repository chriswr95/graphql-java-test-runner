import * as React from 'react';
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
import TestRunsTable from '../Components/TestRunsTable';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

  const [checkBoxState, setCheckboxState] = React.useState(false);
  
  const [cancelButtonState, setCancelButtonState] = React.useState(false);
  //const [testResults, setTestResults] = useState([{ commitHash: "Loading...", id: "initial" }]);
  var branchArray = [
    'master',
    'add_error_logs',
    'save_data'
];

var statusArray = [
  'FAILED',
  'FINISHED',
];

  const [testResults, setTestResults] = useState([]);

  const navigate = useNavigate();


  function manageCompareAction(){
    if(checkBoxSelection.length >= 0){
      setCheckBoxSelection([]);
      //navigate("/report")
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

  /*
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
  
*/


    const [rowsF, setRowsF] = useState([
      {
        id: '2c89206c-1929-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:35 pm"
      },
      {
        id: '84598338-1931-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:40 pm"
      },
      {
        id: 'ac9cc066-192d-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:51 pm"
      },
      {
        id: 'f71da006-1937-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 6:35 pm"
      },
      {
        id: '888fafca-192e-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 7:02 pm"
      },
      {
        id: '6f7b7ed0-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 8:35 pm"
      },
      {
        id: 'a7b884b4-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 8:59 pm"
      },
      {
        id: 'a1224f86-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 9:12 pm"
      },
      {
        id: 'af2ac950-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 10:42 pm"
      },
  
  
    ]);
    const [allRows, setAllRows] = useState([
      {
        id: '2c89206c-1929-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:35 pm"
      },
      {
        id: '84598338-1931-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:40 pm"
      },
      {
        id: 'ac9cc066-192d-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 4:51 pm"
      },
      {
        id: 'f71da006-1937-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 6:35 pm"
      },
      {
        id: '888fafca-192e-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 7:02 pm"
      },
      {
        id: '6f7b7ed0-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 8:35 pm"
      },
      {
        id: 'a7b884b4-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 8:59 pm"
      },
      {
        id: 'a1224f86-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 9:12 pm"
      },
      {
        id: 'af2ac950-1981-11ed-861d-0242ac120002',
        branch: branchArray[Math.floor(Math.random()*branchArray.length)],
        status: statusArray[Math.floor(Math.random()*statusArray.length)],
        benchmarks: 12,
        improvedVsRegresed:{
          improved: 8,
          regressed: 4
        },
        date:  "12/08/2022 10:42 pm"
      },
  
  
    ]);

    

    const buildRows = () => {
      testResults?.sort((a,b) => b.testRunnerResults.core_32.startTime - a.testRunnerResults.core_32.startTime);
      testResults?.map((test, index) => {
        var timestamp = test.testRunnerResults.core_32.startTime;
        var date = new Date(timestamp * 26);
        const newObj = {
            id: test.commitHash,
            //branch: textArray[Math.floor(Math.random()*textArray.length)],
            status: test.status.core_32,
            benchmarks: test.testRunnerResults.core_32.testStatistics?.length,
            improvedVsRegresed: compareBenchmarks(testResults[index], testResults[index+1] ? testResults[index+1] : []),
            date:  date.toLocaleString(), 
          }
         setRowsF(rowsF => [...rowsF, newObj]); 
         setAllRows(allRows => [...allRows, newObj]);
         console.log(newObj.improvedVsRegresed);
      })
    };

    
    const compareBenchmarks = (currentTestRun, previousTestRun) => {
      var results = {
        improved: 0,
        regressed: 0
      };

      for(var i=0; i<currentTestRun.testRunnerResults?.core_32.testStatistics?.length; i++){
        for(var j=0; j<previousTestRun.testRunnerResults?.core_32.testStatistics?.length; j++){
            if(currentTestRun.testRunnerResults?.core_32.testStatistics?.[i].benchmark == previousTestRun.testRunnerResults?.core_32.testStatistics?.[j].benchmark){
              if(currentTestRun.testRunnerResults?.core_32.testStatistics?.[i].primaryMetric.score >= previousTestRun.testRunnerResults?.core_32.testStatistics?.[j].primaryMetric.score){
                results.improved++;
              }else{
                results.regressed++;
              }
            }
        }
      }
      return results;
    }

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
                          right:"10.2%"
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
