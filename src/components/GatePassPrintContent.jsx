import { Box, Typography, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { getVisitorPhotoUrl } from '../utils/visitorPhoto';
import { COMPANY_NAME, COMPANY_LOGO_SRC } from '../utils/company';
import { DEVELOPER_CONTACT, DEVELOPER_PORTFOLIO_URL } from './DeveloperCredit';

/** Always light/print-safe colors (works in dark theme preview + print) */
const C = {
  text: '#0f1c2e',
  muted: '#475569',
  border: '#0f1c2e',
  borderLight: '#cbd5e1',
  sectionBg: '#f1f5f9',
  white: '#ffffff',
  link: '#1a2d4a',
};

const fieldLine = (label, value) => (
  <Typography
    variant="body2"
    sx={{ mb: 0.3, color: C.text, fontSize: '0.82rem', lineHeight: 1.45 }}
  >
    <Box component="strong" sx={{ color: C.text }}>{label}:</Box> {value ?? '—'}
  </Typography>
);

const sectionTitle = (title) => (
  <Typography
    variant="body2"
    fontWeight={800}
    sx={{
      bgcolor: C.sectionBg,
      color: C.text,
      px: 1,
      py: 0.5,
      mb: 1,
      borderRadius: 0.5,
      fontSize: '0.75rem',
      letterSpacing: 0.5,
    }}
  >
    {title}
  </Typography>
);

const GatePassPrintContent = ({ pass, qrDataUrl }) => {
  const photoUrl = getVisitorPhotoUrl(pass.visitorPhoto);

  return (
    <Box
      className="gate-pass-print-sheet"
      sx={{
        p: { xs: 1, sm: 2 },
        border: `2px solid ${C.border}`,
        borderRadius: 1,
        bgcolor: C.white,
        color: C.text,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1.5}
        pb={1.5}
        sx={{ borderBottom: `2px solid ${C.border}` }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mr: 2, flexShrink: 0 }}>
          <img
            src={COMPANY_LOGO_SRC}
            alt={`${COMPANY_NAME} logo`}
            style={{ height: 56, width: 'auto', maxWidth: 120, objectFit: 'contain', display: 'block' }}
          />
          <Box textAlign="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 0.5,
                bgcolor: C.white,
                p: 0.5,
                borderRadius: 1,
                border: `1px solid ${C.borderLight}`,
              }}
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" style={{ width: 64, height: 64, display: 'block' }} />
              ) : (
                <Typography variant="caption" sx={{ color: C.muted }}>
                  Loading QR...
                </Typography>
              )}
            </Box>
            <Typography variant="caption" display="block" sx={{ color: C.muted, fontWeight: 600 }}>
              Scan Entry/Exit
            </Typography>
          </Box>
        </Box>
        <Box textAlign="center" flex={1}>
          <Typography variant="h5" fontWeight={800} sx={{ color: C.text }}>
            {COMPANY_NAME}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: C.text }}>
            Visitor Gate Pass
          </Typography>
          <Typography variant="caption" sx={{ color: C.muted }}>
            Gate Pass No: {pass.gatePassNumber}
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ ml: 2, flexShrink: 0 }}>
          {photoUrl ? (
            <>
              <img
                src={photoUrl}
                alt="Visitor"
                crossOrigin="anonymous"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: '1px solid #94a3b8',
                  display: 'block',
                }}
              />
              <Typography variant="caption" display="block" sx={{ color: C.muted, fontWeight: 600 }}>
                Visitor Photo
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                width: 80,
                height: 80,
                border: `1px dashed ${C.borderLight}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: C.muted }}>
                No Photo
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: `1px solid ${C.borderLight}`, pb: 1 }}>
        {sectionTitle('VISITOR INFORMATION')}
        <Grid container spacing={0.5}>
          {[
            ['Date & Time', dayjs(pass.date).format('DD MMM YYYY, HH:mm')],
            ['Unit', pass.unit],
            ['Visit Type', pass.visitType],
            ['Purpose', pass.purpose],
            ['Person to Meet', pass.personToMeet],
            ['Department', pass.department],
          ].map(([key, val]) => (
            <Grid item xs={6} key={key}>
              {fieldLine(key, val)}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: `1px solid ${C.borderLight}`, pb: 1 }}>
        {sectionTitle('VISITOR DETAILS')}
        <Grid container spacing={0.5}>
          {[
            ['Visitor Name', pass.visitorName],
            ['Mobile No.', pass.mobileNumber],
            ['Company', pass.companyName],
            ['No. of Persons', pass.numberOfPersons],
            ['ID Proof Type', pass.idProofType],
            ['ID Number', pass.idNumber],
          ].map(([key, val]) => (
            <Grid item xs={6} key={key}>
              {fieldLine(key, val)}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: `1px solid ${C.borderLight}`, pb: 1 }}>
        {sectionTitle('ITEMS & VEHICLE')}
        <Grid container spacing={0.5}>
          {[
            ['Vehicle No.', pass.vehicleNumber],
            ['Items Carrying', pass.itemsCarrying],
            ['Serial No.', pass.serialNumber],
            ['Make / Brand', pass.make],
          ].map(([key, val]) => (
            <Grid item xs={6} key={key}>
              {fieldLine(key, val || '—')}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        className="gate-pass-print-footer"
        sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${C.borderLight}`, textAlign: 'center' }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ fontSize: '0.72rem', lineHeight: 1.7, color: C.muted }}
        >
          This Gate Pass Software is Developed by{' '}
          <Box component="strong" sx={{ color: C.text }}>Mohd Ateek</Box>. WhatsApp No.{' '}
          <Box component="span" sx={{ color: C.link, fontWeight: 600 }}>{DEVELOPER_CONTACT}</Box>. Visit my
          website{' '}
          <Box component="span" sx={{ color: C.link, fontWeight: 600 }}>{DEVELOPER_PORTFOLIO_URL}</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default GatePassPrintContent;
