import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import useStyles from './useStyles';
import Booking from './Booking';
import { Typography } from '@material-ui/core';
import BookingRequest from '../../interface/BookingRequest';
import getBookingRequests from '../../helpers/APICalls/bookingRequests/getBookingRequests';

export default function ManageBookings(): JSX.Element {
  const classes = useStyles();
  const [date, setDate] = useState<Date | null>(new Date());
  const [bookingReqData, setBookingReqData] = useState<BookingRequest | null>(null);

  const getRequests = () => {
    getBookingRequests().then((data) => {
      setBookingReqData(data);
      console.log(data);
    });
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <Grid container justify="center" spacing={10} className={classes.root}>
      <Grid item xs={10} md={6} xl={4}>
        <Card raised={true} className={classes.bookingCard}>
          <CardContent>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Your next booking:</Typography>
            </Grid>
            <Booking large={true} />
          </CardContent>
        </Card>
        <Card raised={true} className={classes.bookingCard}>
          <CardContent className={classes.bookingListCurrentPast}>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Current Bookings:</Typography>
            </Grid>
            <Grid>
              <Booking outlined={true} accepted={true} />
              <Booking outlined={true} accepted={false} />
            </Grid>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Past Bookings:</Typography>
            </Grid>
            <Grid>
              <Booking outlined={true} accepted={true} />
              <Booking outlined={true} accepted={true} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card raised={true}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              fullWidth
              showTodayButton={false}
              autoOk
              orientation="landscape"
              variant="static"
              openTo="date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              disableToolbar={true}
            />
          </MuiPickersUtilsProvider>
        </Card>
      </Grid>
    </Grid>
  );
}
