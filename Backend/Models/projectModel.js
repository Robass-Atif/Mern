const mongoose = require('mongoose');

// Define the Project schema
const projectSchema = mongoose.Schema({
    // user
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the Project model
module.exports = mongoose.model('Project', projectSchema);
