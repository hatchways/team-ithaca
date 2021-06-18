const mongoose = require('mongoose');

export interface BookingRequest {
  user_id: string;
  sitter_id: string;
  start_date: Date;
  end_date: Date;
  accepted: boolean;
  declined: boolean;
  paid: boolean;
}

export default interface GetBookingRequestApiData {
  requests: Request;
}
