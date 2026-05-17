import { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Grid, Paper, TextField, MenuItem,
  Button, IconButton, CircularProgress, Card, CardContent, Divider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const CreatePass = () => {
  const { register, handleSubmit, formState: { errors } } = useReactHookForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (photoFile) {
        formData.append('visitorPhoto', photoFile);
      }

      await axios.post('/api/gatepass', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Gate Pass request created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating pass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
            }}
          >
            <AssignmentTurnedInIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #1976d2, #9c27b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create Gate Pass
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">Fill in the details for the new visitor pass request</Typography>
          </Box>
        </Box>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'visible' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* General Details Section */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Visit Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth label="Date & Time" type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      {...register("date", { required: "Date is required" })}
                      error={!!errors.date} helperText={errors.date?.message}
                      variant="outlined"
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth select label="Unit" defaultValue=""
                      {...register("unit", { required: "Unit is required" })}
                      error={!!errors.unit} helperText={errors.unit?.message}
                    >
                      <MenuItem value="Sugar">Sugar</MenuItem>
                      <MenuItem value="Distillery">Distillery</MenuItem>
                    </TextField>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth select label="Visit Type" defaultValue=""
                      {...register("visitType", { required: "Visit Type is required" })}
                      error={!!errors.visitType} helperText={errors.visitType?.message}
                    >
                      <MenuItem value="Official">Official</MenuItem>
                      <MenuItem value="Non-Official">Non-Official</MenuItem>
                    </TextField>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth select label="Purpose" defaultValue=""
                      {...register("purpose", { required: "Purpose is required" })}
                      error={!!errors.purpose} helperText={errors.purpose?.message}
                    >
                      <MenuItem value="Meeting">Meeting</MenuItem>
                      <MenuItem value="Interview">Interview</MenuItem>
                      <MenuItem value="Govt Officials">Govt Officials</MenuItem>
                      <MenuItem value="Contractors">Contractors</MenuItem>
                      <MenuItem value="Quotation Submission">Quotation Submission</MenuItem>
                    </TextField>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Person To Meet" {...register("personToMeet", { required: "Person to meet is required" })} error={!!errors.personToMeet} helperText={errors.personToMeet?.message} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Department" {...register("department", { required: "Department is required" })} error={!!errors.department} helperText={errors.department?.message} />
                  </motion.div>
                </Grid>

                {/* Visitor Details Section */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Visitor Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Visitor Name" {...register("visitorName", { required: "Name is required" })} error={!!errors.visitorName} helperText={errors.visitorName?.message} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Mobile Number" {...register("mobileNumber", { required: "Mobile Number is required" })} error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Company Name" {...register("companyName", { required: "Company Name is required" })} error={!!errors.companyName} helperText={errors.companyName?.message} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth type="number" label="Number of Persons" defaultValue={1} {...register("numberOfPersons", { required: true, min: 1 })} error={!!errors.numberOfPersons} />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth select label="ID Proof Type" defaultValue=""
                      {...register("idProofType", { required: "ID Proof Type is required" })}
                      error={!!errors.idProofType} helperText={errors.idProofType?.message}
                    >
                      <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                      <MenuItem value="PAN">PAN</MenuItem>
                      <MenuItem value="Company ID">Company ID</MenuItem>
                    </TextField>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="ID Number" {...register("idNumber", { required: "ID Number is required" })} error={!!errors.idNumber} helperText={errors.idNumber?.message} />
                  </motion.div>
                </Grid>

                {/* Additional Items */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Items & Vehicle (Optional)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Vehicle Number" {...register("vehicleNumber")} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Items Carrying" {...register("itemsCarrying")} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Serial Number" {...register("serialNumber")} />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div variants={itemVariants}>
                    <TextField fullWidth label="Make" {...register("make")} />
                  </motion.div>
                </Grid>

                {/* Photo Upload Section */}
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Box 
                      sx={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: 2, 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: '#fafafa',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: 'primary.main', bgcolor: '#f0f7ff' }
                      }}
                    >
                      <input hidden accept="image/*" type="file" id="icon-button-file" onChange={handlePhotoChange} />
                      <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span" size="large">
                          <PhotoCamera fontSize="large" />
                        </IconButton>
                      </label>
                      <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                        {photoFile ? photoFile.name : 'Click to Upload Visitor Photo'}
                      </Typography>
                      {photoPreview && (
                        <Box mt={2}>
                          <Box component="img" src={photoPreview} alt="Preview" sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover', boxShadow: 2 }} />
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large" 
                      fullWidth 
                      disabled={loading}
                      sx={{ 
                        py: 1.5, 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold', 
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: '0 8px 16px rgba(25, 118, 210, 0.24)'
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Gate Pass Request'}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default CreatePass;
