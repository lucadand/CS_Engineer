import mongoose from 'mongoose';

const csEngineerSchema = new mongoose.Schema({
  engineerName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available',
  },
  availableAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const CSEngineer = mongoose.models.CSEngineer || mongoose.model('CSEngineer', csEngineerSchema);

export default CSEngineer; 