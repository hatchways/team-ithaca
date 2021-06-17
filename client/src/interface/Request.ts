const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

export interface Request {
  user_id: string;
  sitter_id: string;
  start_date: Date;
  end_date: Date;
  accepted: boolean;
  declined: boolean;
  paid: boolean;
}

export default interface GetRequestApiData {
  requests: Request;
}
