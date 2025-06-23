import mongoose, { Document, Schema } from 'mongoose';
// create interface
export interface IWeather extends Document {
  lat: number;
  lon: number;
  data: any; 
  createdAt: Date;
  updatedAt: Date;
}
// create schema
const weatherSchema = new Schema<IWeather>(
  {
    lat: {
type: Number,
required: true },
   
lon: {
 type: Number, 
 required: true },
   
 data: {
 type: Schema.Types.Mixed,
 required: true },
  },
  { timestamps: true }
);
// index
weatherSchema.index({ lat: 1, lon: 1 }, { unique: true });

export default mongoose.model<IWeather>('Weather', weatherSchema);
