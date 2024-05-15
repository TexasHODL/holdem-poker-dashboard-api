import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

export function parseStringToObjectId(id: string) {
  try {
    return new mongoose.mongo.ObjectId(id);
  } catch (e) {
    throw new BadRequestException('Invalid id string');
  }
}
