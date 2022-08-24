import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Link } from 'react-router-dom';

export default function IdCell({ value, hasCheckbox, onChange, status, row }) {
  var iconColor = '';

  var IconComponent;

  if (status === 'FINISHED') {
    iconColor = 'green';
    IconComponent = CheckCircleOutlinedIcon;
  } else if (status === 'FAILED') {
    iconColor = 'red';
    IconComponent = HighlightOffOutlinedIcon;
  } else if (status === 'RUNNING') {
    iconColor = 'orange';
    IconComponent = HourglassBottomIcon;
  } else {
    iconColor = 'gray';
    IconComponent = HelpOutlineIcon;
  }

  return (
    <>
      {hasCheckbox ? (
        <Stack direction="row" spacing={2}>
          {status === 'FINISHED' ? (
            <Checkbox data-testid="enabledCheckbox" value={value} onChange={() => onChange(value)} />
          ) : (
            <Checkbox data-testid="disabledCheckbox" disabled={true} value={value} onChange={() => onChange(value)} />
          )}
          <Stack direction="row" spacing={2} style={{ marginTop: '1.8%' }}>
            <IconComponent sx={{ color: iconColor }} />
            {status === 'FINISHED' ? (
              <Link to="/report" state={{ from: row }} style={{ textDecoration: 'none', color: 'black' }}>
                <div style={{ textDecoration: 'underline' }}>{value}</div>
              </Link>
            ) : (
              <div style={{ textDecoration: 'none' }}>{value}</div>
            )}
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <IconComponent sx={{ color: iconColor }} />
          {status === 'FINISHED' ? (
            <Link to="/report" state={{ from: row }} style={{ textDecoration: 'none', color: 'black' }}>
              <div style={{ textDecoration: 'underline' }}>{value}</div>
            </Link>
          ) : (
            <div style={{ textDecoration: 'none' }}>{value}</div>
          )}
        </Stack>
      )}
    </>
  );
}
