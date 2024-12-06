import mongoose from 'mongoose';

const modifierSchema = new mongoose.Schema({
  name: String,
  options: [{
    name: String,
    price: Number
  }]
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  modifiers: [modifierSchema],
  discounts: [{
    name: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: Number,
    startDate: Date,
    endDate: Date
  }],
  image: String
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;