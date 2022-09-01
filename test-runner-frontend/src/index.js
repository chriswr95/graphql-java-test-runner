import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import FirestoreProvider from './Components/FirestoreProvider';
import View from './View';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FirestoreProvider>
      <BrowserRouter basename="/graphql-java-test-runner">
        <Routes>
          <Route path="/" element={<View />} />
          {/* 
          <Route path="/report/:jobId" element={<Report />} />
          <Route path="/compare/:jobIdA/:jobIdB" element={<Compare />} />
*/}
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
