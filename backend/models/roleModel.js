import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  module: {
    type: String,
    required: true,
    enum: ['sales', 'inventory', 'reports', 'users', 'settings']
  }
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  permissions: [permissionSchema],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);
export default Role;