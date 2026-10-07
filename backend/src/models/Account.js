import mongoose from "mongoose";
const { Schema } = mongoose;

const accountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },

  issuer: {
    type: String,
    trim: true,
  },

  secret: {
    type: String,
    required: true,
  },

  account: {
    type: String,
    trim: true,
    required: true,
  },

  algorithm: {
    type: String,
    enum: ['SHA1', 'SHA256', 'SHA512'],
    default: 'SHA1'
  },

  digits: {
    type: Number,
    enum: [6, 8],
    default: 6
  },

  period: {
    type: Number,
    default: 30
  },

  recoveryCodes: [{
    codeHash: {
      type: String,
      required: true
    },
    usedAt: {
      type: Date,
      default: null
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

accountSchema.index(
  {user: 1, serviceName: 1, account: 1},
  {unique: true}
);

const Account = mongoose.model('Account', accountSchema);

export { Account };
