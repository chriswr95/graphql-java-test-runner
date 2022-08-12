import * as React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Stack, Typography } from '@mui/material';

export default function ProgressBarCell({ improvedValue, regressedValue }) {

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Typography sx={{ color: 'green' }}>{improvedValue}</Typography>
                <ProgressBar style={{ width: '57%', height: '0.9vh', marginTop: '4%' }}>
                    <ProgressBar variant="success" now={improvedValue * 100} key={1} />
                    <ProgressBar variant="danger" now={regressedValue * 100} key={2} />
                </ProgressBar>
                <Typography variant="h8" sx={{ color: 'red' }}>
                    {regressedValue}
                </Typography>
            </Stack>
        </div>
    );
}