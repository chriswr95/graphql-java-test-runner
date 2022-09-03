import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Link } from 'react-router-dom';

export default function IdCell({ value, hasCheckbox, onChange, status, row }) {
  const NONE = 'none';
  const BLACK = 'black';

  var iconColor = '';
  var IconComponent;
  var textDecoration = NONE;
  var pointerEvent = NONE;
  var routingReference = '#';
  var dataTestid = 'disabledCheckbox';
  var isDisabled = true;

  if (status === 'FINISHED') {
    iconColor = 'green';
    IconComponent = CheckCircleOutlinedIcon;
    textDecoration = 'underline';
    routingReference = `?report=${row?.id}`;
    pointerEvent = 'auto';
    dataTestid = 'enabledCheckbox';
    isDisabled = false;
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
          <Checkbox data-testid={dataTestid} disabled={isDisabled} value={value} onChange={() => onChange(value)} />
          <Stack direction="row" spacing={2} style={{ marginTop: '1.8%' }}>
            <IconComponent sx={{ color: iconColor }} />
            <Link to={routingReference} style={{ textDecoration: NONE, color: BLACK, pointerEvents: pointerEvent }}>
              <div style={{ textDecoration: textDecoration }}>{value}</div>
            </Link>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <IconComponent sx={{ color: iconColor }} />
          <Link to={routingReference} style={{ textDecoration: NONE, color: BLACK, pointerEvents: pointerEvent }}>
            <div style={{ textDecoration: textDecoration }}>{value}</div>
          </Link>
        </Stack>
      )}
    </>
  );
}
