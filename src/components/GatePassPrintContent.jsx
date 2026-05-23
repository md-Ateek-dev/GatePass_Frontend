import { Box, Typography, Grid, Link } from '@mui/material';
import dayjs from 'dayjs';
import { getVisitorPhotoUrl } from '../utils/visitorPhoto';
import { COMPANY_NAME, COMPANY_LOGO_SRC } from '../utils/company';
import { DEVELOPER_CONTACT, DEVELOPER_PORTFOLIO_URL } from './DeveloperCredit';

const GatePassPrintContent = ({ pass, qrDataUrl }) => {
  const photoUrl = getVisitorPhotoUrl(pass.visitorPhoto);

  return (
    <Box className="gate-pass-print-sheet" sx={{ p: { xs: 1, sm: 2 }, border: '2px solid #0f172a', borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5} pb={1.5} sx={{ borderBottom: '2px solid #0f172a' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mr: 2, flexShrink: 0 }}>
          <Box textAlign="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={COMPANY_LOGO_SRC}
              alt={`${COMPANY_NAME} logo`}
              style={{ height: 56, width: 'auto', maxWidth: 120, objectFit: 'contain', display: 'block' }}
            />
          </Box>
          <Box textAlign="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 0.5 }}>
            <Box sx={{ width: 72, height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0.5, bgcolor: '#ffffff', p: 0.5, borderRadius: 1, border: '1px solid #e2e8f0' }}>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" style={{ width: 64, height: 64, display: 'block' }} />
              ) : (
                <Typography variant="caption" color="text.secondary">Loading QR...</Typography>
              )}
            </Box>
            <Typography variant="caption" display="block">Scan Entry/Exit</Typography>
          </Box>
        </Box>
        <Box textAlign="center" flex={1}>
          <Typography variant="h5" fontWeight={800}>{COMPANY_NAME}</Typography>
          <Typography variant="subtitle1" fontWeight={600}>Visitor Gate Pass</Typography>
          <Typography variant="caption" color="text.secondary">Gate Pass No: {pass.gatePassNumber}</Typography>
        </Box>
        <Box textAlign="center" sx={{ ml: 2, flexShrink: 0 }}>
          {photoUrl ? (
            <>
              <img
                src={photoUrl}
                alt="Visitor"
                crossOrigin="anonymous"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc', display: 'block' }}
              />
              <Typography variant="caption" display="block">Visitor Photo</Typography>
            </>
          ) : (
            <Box sx={{ width: 80, height: 80, border: '1px dashed #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary">No Photo</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
        <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
          VISITOR INFORMATION
        </Typography>
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
              <Typography variant="body2" sx={{ mb: 0.3 }}>
                <strong>{key}:</strong> {val || '—'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
        <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
          VISITOR DETAILS
        </Typography>
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
              <Typography variant="body2" sx={{ mb: 0.3 }}>
                <strong>{key}:</strong> {val || '—'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mb={1.5} sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
        <Typography variant="body2" fontWeight={800} sx={{ bgcolor: '#f1f5f9', px: 1, py: 0.5, mb: 1, borderRadius: 0.5 }}>
          ITEMS & VEHICLE
        </Typography>
        <Grid container spacing={0.5}>
          {[
            ['Vehicle No.', pass.vehicleNumber],
            ['Items Carrying', pass.itemsCarrying],
            ['Serial No.', pass.serialNumber],
            ['Make / Brand', pass.make],
          ].map(([key, val]) => (
            <Grid item xs={6} key={key}>
              <Typography variant="body2" sx={{ mb: 0.3 }}>
                <strong>{key}:</strong> {val || '—'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="gate-pass-print-footer" sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #cbd5e1', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: '0.72rem', lineHeight: 1.7, color: '#475569', display: 'block' }}>
          This Gate Pass Software is Developed by <strong>Mohd Ateek</strong>. WhatsApp No.{' '}
          <Link href={`tel:${DEVELOPER_CONTACT}`} sx={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}>
            {DEVELOPER_CONTACT}
          </Link>
          . Visit my website{' '}
          <Link href={DEVELOPER_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" sx={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}>
            {DEVELOPER_PORTFOLIO_URL}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default GatePassPrintContent;
