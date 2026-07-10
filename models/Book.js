import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Roman', 'Shkencë-Fiction', 'Histori', 'Biografi', 'Fëmijë', 'Poezi', 'Tjetër'],
      default: 'Tjetër',
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    coverImage: { type: String, default: 'https://placehold.co/400x600?text=Libri' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
