import mongoose from "mongoose";

const Schema = mongoose.Schema;

const opportunitySchema = new Schema({
  companyId: {
    type: String,
    required: [true, "Please select a company."],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Role is required."],
    minlength: [5, "Role must be at least 5 characters."],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Please select job type."],
    enum: {
      values: ["full-time", "internship"],
      message: "Type must be either 'full-time' or 'internship'",
    },
  },
  location: {
    type: String,
    required: [true, "Please select a location."],
    trim: true,
  },
  stipend: {
    type: String,
    trim: true,
  },
  applicationDeadline: {
    type: Date,
    required: [true, "Please select a deadline."],
  },
  applyLink: {
    type: String,
    required: [true, "Please enter a valid URL."],
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: "Please enter a valid URL.",
    },
  },
  eligibility: {
    type: String,
    required: [true, "Eligibility is required."],
    minlength: [10, "Eligibility must be at least 10 characters."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    minlength: [20, "Description must be at least 20 characters."],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;