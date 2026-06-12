import { useState, useRef, useCallback, useContext } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Grid, TextField, MenuItem,
  Button, IconButton, CircularProgress, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, FormControlLabel
} from '@mui/material';
import Webcam from 'react-webcam';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import { ThemeModeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DeveloperCredit from '../components/DeveloperCredit';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } },
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5 }}>
    <Box
      sx={{
        width: 42, height: 42, borderRadius: '14px',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.25, letterSpacing: '-0.015em', fontSize: '1rem' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 650, display: 'block', mt: 0.2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const CreatePass = () => {
  const { register, handleSubmit, formState: { errors } } = useReactHookForm();
  const navigate = useNavigate();
  const { mode } = useContext(ThemeModeContext);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cameraMode, setCameraMode] = useState(null);
  const webcamRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const isDark = mode === 'dark';

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotoPreview(imageSrc);
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            setPhotoFile(file);
            setCameraMode(null);
          });
      }
    }
  }, [webcamRef]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => { setPhotoFile(null); setPhotoPreview(null); };

  const onSubmit = async (data) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'itemsCarrying') {
          formData.append(key, data[key]);
        }
      });
      const itemsString = selectedItems.join(', ') || 'None';
      formData.append('itemsCarrying', itemsString);

      if (photoFile) formData.append('visitorPhoto', photoFile);
      await axios.post('/api/gatepass', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Gate pass created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating pass');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      bgcolor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)',
      '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
      '&:hover fieldset': { borderColor: 'primary.light' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 16px rgba(197, 160, 89,0.2)' },
      transition: 'all 0.25s ease',
    },
    '& .MuiInputLabel-root': { color: 'text.secondary', fontSize: '0.9rem', fontWeight: 650 },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
  };

  const sectionPaperSx = {
    borderRadius: '24px',
    border: '1px solid',
    borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    bgcolor: 'background.paper',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 24px -4px rgba(197, 160, 89, 0.03)',
    p: { xs: 3.5, sm: 4.5 },
    mb: 3.8,
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    '&:hover': {
      borderColor: 'rgba(197, 160, 89,0.22)',
      boxShadow: isDark ? '0 16px 36px rgba(197, 160, 89, 0.05)' : '0 16px 36px rgba(197, 160, 89, 0.06)',
    }
  };

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', pb: 6 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.2, mb: 4.5 }}>
        <Box
          sx={{
            width: 54, height: 54, borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(197, 160, 89, 0.3)', flexShrink: 0,
          }}
        >
          <AssignmentTurnedInIcon sx={{ color: 'white', fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.02em', fontSize: '1.45rem' }}>
            Create Gate Pass
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
            Fill in visitor details to generate a new gate pass
          </Typography>
        </Box>
      </Box>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ─── Section 1: Visit Scope Details ─── */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <SectionHeader
                icon={<InfoOutlinedIcon sx={{ color: 'white', fontSize: 20 }} />}
                title="Visit Information"
                subtitle="Date, unit, and host details"
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Date & Time" type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    {...register('date', { required: 'Date is required' })}
                    error={!!errors.date} helperText={errors.date?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth select label="Unit" defaultValue=""
                    {...register('unit', { required: 'Unit is required' })}
                    error={!!errors.unit} helperText={errors.unit?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="Sugar">Sugar</MenuItem>
                    <MenuItem value="Distillery">Distillery</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth select label="Visit Type" defaultValue=""
                    {...register('visitType', { required: 'Visit type is required' })}
                    error={!!errors.visitType} helperText={errors.visitType?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="Official">Official</MenuItem>
                    <MenuItem value="Non-Official">Non-Official</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth select label="Purpose" defaultValue=""
                    {...register('purpose', { required: 'Purpose is required' })}
                    error={!!errors.purpose} helperText={errors.purpose?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Interview">Interview</MenuItem>
                    <MenuItem value="Govt Officials">Govt Officials</MenuItem>
                    <MenuItem value="Contractors">Contractors</MenuItem>
                    <MenuItem value="Quotation Submission">Quotation Submission</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Person to Meet"
                    placeholder="Enter person name"
                    {...register('personToMeet', { required: 'Person to meet is required' })}
                    error={!!errors.personToMeet} helperText={errors.personToMeet?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Department"
                    placeholder="Enter department"
                    {...register('department', { required: 'Department is required' })}
                    error={!!errors.department} helperText={errors.department?.message}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 2: Visitor Personal Bio ─── */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <SectionHeader
                icon={<PersonSearchIcon sx={{ color: 'white', fontSize: 20 }} />}
                title="Visitor Details"
                subtitle="Visitor identity and ID proof"
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Visitor Name"
                    placeholder="Enter visitor name"
                    {...register('visitorName', {
                      required: 'Visitor name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      pattern: { value: /^[a-zA-Z\s.'-]+$/, message: 'Only letters and standard marks allowed' },
                    })}
                    error={!!errors.visitorName} helperText={errors.visitorName?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Mobile Number"
                    placeholder="Enter 10-digit mobile number"
                    inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: { value: /^[6-9][0-9]{9}$/, message: 'Enter valid 10-digit number starting with 6-9' },
                    })}
                    error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Company Name"
                    placeholder="Enter company name"
                    {...register('companyName', {
                      required: 'Company name is required',
                      minLength: { value: 2, message: 'Must be at least 2 characters' },
                    })}
                    error={!!errors.companyName} helperText={errors.companyName?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth type="number" label="No. of Persons" defaultValue={1}
                    inputProps={{ min: 1, max: 100 }}
                    {...register('numberOfPersons', {
                      required: 'Number of persons is required',
                      min: { value: 1, message: 'Must be at least 1' },
                      max: { value: 100, message: 'Maximum 100 persons' },
                    })}
                    error={!!errors.numberOfPersons}
                    helperText={errors.numberOfPersons?.message || ''}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth select label="ID Proof Type" defaultValue=""
                    {...register('idProofType', { required: 'ID proof type is required' })}
                    error={!!errors.idProofType} helperText={errors.idProofType?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                    <MenuItem value="PAN">PAN</MenuItem>
                    <MenuItem value="Company ID">Company ID</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="ID Number"
                    placeholder="Enter ID number"
                    {...register('idNumber', {
                      required: 'ID number is required',
                      minLength: { value: 4, message: 'Must be at least 4 digits' },
                    })}
                    error={!!errors.idNumber} helperText={errors.idNumber?.message}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 3: Material Items & Vehicle Registry ─── */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
                <SectionHeader
                  icon={<DirectionsCarIcon sx={{ color: 'white', fontSize: 20 }} />}
                  title="Items & Vehicle"
                  subtitle="Optional vehicle and items details"
                />
                <Chip label="Optional" size="small" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: 'text.secondary', fontWeight: 800, fontSize: '0.68rem', px: 0.5 }} />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Vehicle Number" placeholder="e.g. UP 32 XX 1234" {...register('vehicleNumber')} sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', mb: 1, fontSize: '0.85rem' }}>
                    Items Carrying
                  </Typography>
                  <Grid container spacing={0.5}>
                    {['Laptop', 'Mobile', 'USB/Pendrive', 'Tools', 'Documents'].map((item) => (
                      <Grid item xs={6} key={item}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedItems.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, item]);
                                } else {
                                  setSelectedItems(selectedItems.filter((i) => i !== item));
                                }
                              }}
                              color="primary"
                              sx={{
                                color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                py: 0.5
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" fontWeight={650} sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                              {item}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Serial Number" placeholder="Enter serial number" {...register('serialNumber')} sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Make" placeholder="e.g. Dell, HP, Lenovo" {...register('make')} sx={fieldSx} />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 4: Camera Verification ─── */}
          <motion.div variants={itemVariants}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5, letterSpacing: '-0.015em', fontSize: '1rem' }}>
                Visitor Photo
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3.5, fontWeight: 650 }}>
                Upload a photo or capture using camera
              </Typography>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: photoFile ? 'primary.main' : 'divider',
                  borderRadius: '20px',
                  p: { xs: 4, sm: 6 },
                  textAlign: 'center',
                  bgcolor: photoFile ? (isDark ? 'rgba(197, 160, 89,0.06)' : 'rgba(197, 160, 89,0.02)') : 'rgba(0,0,0,0.01)',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'primary.main', bgcolor: isDark ? 'rgba(197, 160, 89,0.08)' : 'rgba(197, 160, 89,0.04)' },
                  position: 'relative',
                }}
              >
                <input
                  hidden accept="image/*" type="file"
                  id="photo-upload-input"
                  onChange={handlePhotoChange}
                />
                {photoPreview ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Box
                      component="img"
                      src={photoPreview}
                      alt="Preview"
                      sx={{
                        width: 140, height: 140, borderRadius: '20px',
                        objectFit: 'cover',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        border: '3px solid',
                        borderColor: 'primary.main',
                        display: 'block',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={removePhoto}
                      sx={{
                        position: 'absolute', top: -10, right: -10,
                        bgcolor: 'error.main', color: 'white',
                        width: 28, height: 28,
                        '&:hover': { bgcolor: 'error.dark' },
                        boxShadow: '0 4px 12px rgba(244,63,94,0.4)',
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 3.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <label htmlFor="photo-upload-input" style={{ cursor: 'pointer' }}>
                      <Box
                        sx={{
                          width: 62, height: 62, borderRadius: '16px',
                          bgcolor: 'rgba(197, 160, 89,0.08)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                          border: '1px solid rgba(197, 160, 89,0.12)',
                          '&:hover': { bgcolor: 'rgba(197, 160, 89,0.15)', transform: 'translateY(-3px)' },
                          transition: 'all 0.25s',
                        }}
                      >
                        <PhotoCamera sx={{ color: 'primary.main', fontSize: 26 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                        Upload Photo
                      </Typography>
                    </label>
                    
                    <Box onClick={() => setCameraMode('user')} sx={{ cursor: 'pointer' }}>
                      <Box
                        sx={{
                          width: 62, height: 62, borderRadius: '16px',
                          bgcolor: 'rgba(197, 160, 89,0.08)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                          border: '1px solid rgba(197, 160, 89,0.12)',
                          '&:hover': { bgcolor: 'rgba(197, 160, 89,0.15)', transform: 'translateY(-3px)' },
                          transition: 'all 0.25s',
                        }}
                      >
                        <CameraswitchIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                        Front Camera
                      </Typography>
                    </Box>
                    
                    <Box onClick={() => setCameraMode('environment')} sx={{ cursor: 'pointer' }}>
                      <Box
                        sx={{
                          width: 62, height: 62, borderRadius: '16px',
                          bgcolor: 'rgba(197, 160, 89,0.08)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                          border: '1px solid rgba(197, 160, 89,0.12)',
                          '&:hover': { bgcolor: 'rgba(197, 160, 89,0.15)', transform: 'translateY(-3px)' },
                          transition: 'all 0.25s',
                        }}
                      >
                        <AddAPhotoIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                        Back Camera
                      </Typography>
                    </Box>
                  </Box>
                )}
                {photoFile && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 2.2, color: 'primary.main', fontWeight: 800 }}>
                    ✓ Photo Linked: {photoFile.name}
                  </Typography>
                )}
              </Box>
            </Paper>
          </motion.div>

          {/* ─── Submit Clearances ─── */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.003 }} whileTap={{ scale: 0.997 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 2, fontSize: '0.98rem', fontWeight: 800,
                borderRadius: '16px', letterSpacing: 0.5,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                boxShadow: '0 8px 24px rgba(197, 160, 89, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-dark) 100%)',
                  boxShadow: '0 12px 32px rgba(197, 160, 89, 0.45)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
                '&:disabled': { background: 'divider', color: 'text.secondary', boxShadow: 'none' },
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Creating...</span>
                </Box>
              ) : (
                'Create Gate Pass'
              )}
            </Button>
          </motion.div>

        </form>
      </motion.div>

      <DeveloperCredit sx={{ mt: 5 }} />

      {/* Futuristic Camera Capture Dialog with holographic scanline laser */}
      <Dialog
        open={!!cameraMode}
        onClose={() => setCameraMode(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: '#000',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', bgcolor: '#0c1222', py: 2.2, px: 3 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: '0.2px' }}>Capture Photo</Typography>
          <IconButton onClick={() => setCameraMode(null)} size="small" sx={{ color: '#94a3b8', bgcolor: 'rgba(255,255,255,0.04)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0, bgcolor: '#000', minHeight: 340 }}>
          {cameraMode && (
            <Box className="biometric-scanner-frame" sx={{ width: '100%', height: '100%', display: 'block', borderRadius: 0, border: 'none', boxShadow: 'none' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: cameraMode }}
                style={{ width: '100%', maxHeight: '60vh', objectFit: 'cover', display: 'block' }}
                onUserMediaError={() => {
                  toast.error("Camera access denied or device disconnected!");
                  setCameraMode(null);
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, bgcolor: '#0c1222', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Button onClick={() => setCameraMode(null)} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={capturePhoto}
            sx={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '12px',
              py: 1,
              px: 3,
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-dark))',
              }
            }}
          >
            Capture Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePass;
