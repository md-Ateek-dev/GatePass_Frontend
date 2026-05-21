import { useState, useRef, useCallback } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Grid, TextField, MenuItem,
  Button, IconButton, CircularProgress, Divider, Paper, Chip,
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
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
    <Box
      sx={{
        width: 36, height: 36, borderRadius: '10px',
        background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a', lineHeight: 1.3 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const CreatePass = () => {
  const { register, handleSubmit, formState: { errors } } = useReactHookForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cameraMode, setCameraMode] = useState(null);
  const webcamRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [selectedItems, setSelectedItems] = useState([]);

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
      toast.success('Gate Pass request created successfully!');
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
      borderRadius: '10px', bgcolor: '#fafbfc',
      '&:hover fieldset': { borderColor: '#1976d2' },
      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48, height: 48, borderRadius: '14px',
              background: 'linear-gradient(135deg, #1565c0, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(25,118,210,0.35)', flexShrink: 0,
            }}
          >
            <AssignmentTurnedInIcon sx={{ color: 'white', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
              Create Gate Pass
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Fill in visitor details to submit a new pass request
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ─── Section 1: Visitor Details ─── */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3, border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', p: { xs: 2.5, sm: 3.5 }, mb: 2.5,
              }}
            >
              <SectionHeader
                icon={<InfoOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />}
                title="Visitor Details"
                subtitle="Date, unit, type and purpose of visit"
              />
              <Grid container spacing={2.5}>
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
                    {...register('visitType', { required: 'Visit Type is required' })}
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
                    fullWidth label="Person To Meet"
                    {...register('personToMeet', { required: 'Required' })}
                    error={!!errors.personToMeet} helperText={errors.personToMeet?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Department"
                    {...register('department', { required: 'Required' })}
                    error={!!errors.department} helperText={errors.department?.message}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 2: Visitor Details ─── */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3, border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', p: { xs: 2.5, sm: 3.5 }, mb: 2.5,
              }}
            >
              <SectionHeader
                icon={<PersonSearchIcon sx={{ color: 'white', fontSize: 18 }} />}
                title="Visitor Details"
                subtitle="Personal and identification information"
              />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Visitor Name"
                    placeholder="Enter full name"
                    {...register('visitorName', {
                      required: 'Visitor name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      pattern: { value: /^[a-zA-Z\s.'-]+$/, message: 'Only letters and spaces allowed' },
                    })}
                    error={!!errors.visitorName} helperText={errors.visitorName?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Mobile Number"
                    placeholder="10-digit mobile number"
                    inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: { value: /^[6-9][0-9]{9}$/, message: 'Enter a valid 10-digit mobile number (starts with 6-9)' },
                    })}
                    error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Company Name"
                    placeholder="Organisation or company name"
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
                    fullWidth type="number" label="Number of Persons" defaultValue={1}
                    inputProps={{ min: 1, max: 100 }}
                    {...register('numberOfPersons', {
                      required: 'Required',
                      min: { value: 1, message: 'Must be at least 1 person' },
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
                    {...register('idProofType', { required: 'Please select an ID proof type' })}
                    error={!!errors.idProofType} helperText={errors.idProofType?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="Aadhaar">Aadhaar Card</MenuItem>
                    <MenuItem value="PAN">PAN Card</MenuItem>
                    <MenuItem value="Company ID">Company ID</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="ID Number"
                    placeholder="Enter ID number"
                    {...register('idNumber', {
                      required: 'ID number is required',
                      minLength: { value: 4, message: 'ID number too short' },
                    })}
                    error={!!errors.idNumber} helperText={errors.idNumber?.message}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 3: Items & Vehicle ─── */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3, border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', p: { xs: 2.5, sm: 3.5 }, mb: 2.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <SectionHeader
                  icon={<DirectionsCarIcon sx={{ color: 'white', fontSize: 18 }} />}
                  title="Items & Vehicle"
                  subtitle="Optional — leave blank if not applicable"
                />
                <Chip label="Optional" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Vehicle Number" {...register('vehicleNumber')} sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#475569', mb: 1 }}>
                    Items Carrying (Select all that apply)
                  </Typography>
                  <Grid container spacing={0.5}>
                    {['Laptop', 'Mobile', 'USB', 'Pen Drive', 'Documents'].map((item) => (
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
                                color: '#cbd5e1',
                                '&.Mui-checked': {
                                  color: '#1976d2',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#334155' }}>
                              {item}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Serial Number" {...register('serialNumber')} sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Make / Brand" {...register('make')} sx={fieldSx} />
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* ─── Section 4: Photo Upload ─── */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3, border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', p: { xs: 2.5, sm: 3.5 }, mb: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a', mb: 0.5 }}>
                Visitor Photo
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                Upload a clear photo of the visitor (optional)
              </Typography>

              <Box
                sx={{
                  border: `2px dashed ${photoFile ? '#1976d2' : '#cbd5e1'}`,
                  borderRadius: '12px',
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  bgcolor: photoFile ? 'rgba(25,118,210,0.04)' : '#fafbfc',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25,118,210,0.04)' },
                  cursor: 'pointer',
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
                        width: 120, height: 120, borderRadius: '12px',
                        objectFit: 'cover',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        display: 'block',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={removePhoto}
                      sx={{
                        position: 'absolute', top: -10, right: -10,
                        bgcolor: '#ef4444', color: 'white',
                        width: 26, height: 26,
                        '&:hover': { bgcolor: '#dc2626' },
                        boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <label htmlFor="photo-upload-input" style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 56, height: 56, borderRadius: '14px',
                          bgcolor: '#dbeafe', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                        }}
                      >
                        <PhotoCamera sx={{ color: '#1976d2', fontSize: 28 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                        Upload
                      </Typography>
                    </label>
                    
                    <Box onClick={() => setCameraMode('user')} sx={{ cursor: 'pointer', textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 56, height: 56, borderRadius: '14px',
                          bgcolor: '#dbeafe', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                        }}
                      >
                        <PhotoCamera sx={{ color: '#1976d2', fontSize: 28 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                        Front Camera
                      </Typography>
                    </Box>
                    
                    <Box onClick={() => setCameraMode('environment')} sx={{ cursor: 'pointer', textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 56, height: 56, borderRadius: '14px',
                          bgcolor: '#dbeafe', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', mx: 'auto', mb: 1.5,
                        }}
                      >
                        <PhotoCamera sx={{ color: '#1976d2', fontSize: 28 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                        Back Camera
                      </Typography>
                    </Box>
                  </Box>
                )}
                {photoFile && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#1976d2', fontWeight: 600 }}>
                    ✓ {photoFile.name}
                  </Typography>
                )}
              </Box>
            </Paper>
          </motion.div>

          {/* ─── Submit Button ─── */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.6, fontSize: '1rem', fontWeight: 700,
                borderRadius: '12px', letterSpacing: 0.3,
                background: 'linear-gradient(135deg, #1565c0 0%, #7c3aed 100%)',
                boxShadow: '0 8px 24px rgba(25,118,210,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #6d28d9 100%)',
                  boxShadow: '0 12px 32px rgba(25,118,210,0.45)',
                  transform: 'translateY(-1px)',
                },
                '&:active': { transform: 'translateY(0)' },
                '&:disabled': { background: '#e2e8f0', color: '#94a3b8', boxShadow: 'none' },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Submitting...</span>
                </Box>
              ) : (
                '🚀 Submit Gate Pass Request'
              )}
            </Button>
          </motion.div>

        </form>
      </motion.div>
      <Dialog open={!!cameraMode} onClose={() => setCameraMode(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Take Photo</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0, bgcolor: '#000', minHeight: 300 }}>
          {cameraMode && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: cameraMode }}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover' }}
              onUserMediaError={(err) => {
                toast.error("Camera access denied or camera not found!");
                setCameraMode(null);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCameraMode(null)}>Cancel</Button>
          <Button variant="contained" onClick={capturePhoto}>Capture</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatePass;
