import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './user.model';
import { IWeather } from './weather.model';

// create interface
export interface IHistory extends Document {
  user: Types.ObjectId | IUser;
  weather: Types.ObjectId | IWeather;
  lat: number;
  lon: number;
  requestedAt: Date;
}
// schema
const historySchema = new Schema<IHistory>(
  {
    user: {
   type: Schema.Types.ObjectId,
   ref: 'User', 
  required: true },

    weather: { 
  type: Schema.Types.ObjectId, 
  ref: 'Weather',
 required: true },

    lat: { 
  type: Number, 
  required: true },

    lon: { 
  type: Number, 
  required: true },
  
    requestedAt: { 
  type: Date, default: Date.now },
  },
  { timestamps: false }
);
// index
historySchema.index({ user: 1, requestedAt: -1 });

export default mongoose.model<IHistory>('History', historySchema);
