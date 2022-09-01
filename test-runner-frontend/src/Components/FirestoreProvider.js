import React, { useReducer, useEffect } from 'react';
import { onSnapshot, collection } from '@firebase/firestore';
import db from '../Views/firebase';
import {
  getMachineNames,
  sortTestRunsByMachine,
  getBenchmarksByMachine,
  getAllBenchmarks,
} from '../Views/DashboardUtils';

const FIRESTORE_COLLECTION_NAME = 'test-runs';

const initialState = {
  loading: true,
  firestoreData: undefined,
  machines: undefined,
};

export const FirestoreContext = React.createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case 'complete':
      const machines = getMachineNames(action.payload);
      const sortedTestRuns = sortTestRunsByMachine(machines, action.payload);
      const benchmarksByMachine = getBenchmarksByMachine(sortedTestRuns);
      const testRunResults = getAllBenchmarks(benchmarksByMachine);
      return {
        ...state,
        loading: false,
        firestoreData: testRunResults.sort((a, b) => b.timestamp - a.timestamp),
        machines: machines,
      };
    default:
      return state;
  }
};

export default function FirestoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    onSnapshot(collection(db, FIRESTORE_COLLECTION_NAME), (snapshot) =>
      dispatch({ type: 'complete', payload: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) })
    );
  }, []);

  return <FirestoreContext.Provider value={state}>{children}</FirestoreContext.Provider>;
}
