const mongoose = require('mongoose');

export interface BookingRequest {
  _id: string;
  user_id: string;
  sitter_id: string;
  start_date: any;
  end_date: any;
  accepted?: boolean;
  declined?: boolean;
  paid?: boolean;
}

export interface GetBookingRequestApiData {
  requests: BookingRequest[];
}
