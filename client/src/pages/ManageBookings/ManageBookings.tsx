import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import useStyles from './useStyles';
import Booking from './Booking';
import { Typography } from '@material-ui/core';
import { BookingRequest } from '../../interface/BookingRequest';
import getBookingRequests from '../../helpers/APICalls/bookingRequests/getBookingRequests';
import { Badge } from '@material-ui/core';

export default function ManageBookings(): JSX.Element {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
  const [requestDates, setRequestDates] = useState<Date[]>();
  const [nextBookingRequest, setNextBookingRequest] = useState<BookingRequest>();
  const [pastBookingRequests, setPastBookingRequests] = useState<BookingRequest[]>();
  const [currentBookingRequests, setCurrentBookingRequests] = useState<BookingRequest[]>();
  const [nextBookingDisplay, setNextBookingDisplay] = useState<any>();
  const [currentBookingsDisplay, setCurrentBookingsDisplay] = useState<any>();
  const [pastBookingsDisplay, setPastBookingsDisplay] = useState<any>();

  const updateNextBookingDisplay = async () => {
    if (nextBookingRequest) {
      const profile = nextBookingRequest.user_id.profile;
      setNextBookingDisplay(
        <Grid key={nextBookingRequest._id}>
          <Booking
            outlined
            accepted={
              !nextBookingRequest.accepted && !nextBookingRequest.declined ? undefined : nextBookingRequest.accepted
            }
            name={`${profile && profile.firstName} ${profile && profile.lastName}`}
            avatar={profile && profile.profileImg}
            date={nextBookingRequest.start_date}
          />
        </Grid>,
      );
    }
  };

  const updateBookingDisplay = (requestName: any, time: any) => {
    const methods: any = {
      next: setNextBookingDisplay,
      current: setCurrentBookingsDisplay,
      past: setPastBookingsDisplay,
    };
    if (requestName && requestName.length >= 1) {
      methods[time](
        <>
          {requestName.map((booking: any) => {
            const profile = booking.user_id.profile;
            return (
              <Grid key={booking._id}>
                <Booking
                  outlined
                  accepted={!booking.accepted && !booking.declined ? undefined : booking.accepted}
                  name={`${profile && profile.firstName} ${profile && profile.lastName}`}
                  avatar={profile && profile.profileImg}
                  date={booking.start_date}
                />
              </Grid>
            );
          })}
        </>,
      );
    }
  };

  const getRequests = async () => {
    const data = await getBookingRequests();
    const currentRequestsList: BookingRequest[] = [];
    const pastRequestsList: BookingRequest[] = [];
    const requestDatesList: Date[] = [];
    const now = new Date().valueOf();
    if (data.requests) {
      data.requests.map((request) => {
        let newDate = request.start_date;
        newDate = newDate.split('T')[0];
        newDate = new Date(newDate);
        const formattedDate = newDate.toLocaleDateString('en-US');
        requestDatesList.push(formattedDate);
        if (newDate > now) {
          currentRequestsList.push(request);
        } else {
          pastRequestsList.push(request);
        }
      });
      setRequestDates(requestDatesList);
      setNextBookingRequest(currentRequestsList[0]);
      setCurrentBookingRequests(currentRequestsList.slice(1));
      setPastBookingRequests(pastRequestsList);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    updateNextBookingDisplay();
    updateBookingDisplay(currentBookingRequests, 'current');
    updateBookingDisplay(pastBookingRequests, 'past');
  }, [nextBookingRequest, currentBookingRequests, pastBookingRequests]);

  return (
    <Grid container justify="center" spacing={10} className={classes.root}>
      <Grid item xs={10} md={6} xl={4}>
        <Card raised className={classes.bookingCard}>
          <CardContent>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Your next booking:</Typography>
            </Grid>
            {nextBookingDisplay ? (
              nextBookingDisplay
            ) : (
              <Typography className={classes.noBookingDisplay}>No upcoming bookings</Typography>
            )}
          </CardContent>
        </Card>
        <Card raised className={classes.bookingCard}>
          <CardContent className={classes.bookingListCurrentPast}>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Current Bookings:</Typography>
            </Grid>
            {currentBookingsDisplay ? (
              currentBookingsDisplay
            ) : (
              <Typography className={classes.noBookingDisplay}>No current bookings</Typography>
            )}
          </CardContent>
        </Card>
        <Card raised className={classes.bookingCard}>
          <CardContent>
            <Grid className={classes.cardHeader}>
              <Typography className={classes.bookingTitle}>Past Bookings:</Typography>
            </Grid>
            {pastBookingsDisplay ? (
              pastBookingsDisplay
            ) : (
              <Typography className={classes.noBookingDisplay}>No past bookings</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card raised>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              fullWidth
              showTodayButton={false}
              autoOk
              orientation="landscape"
              variant="static"
              openTo="date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              disableToolbar
              renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
                const dateString: any = date && date.toLocaleDateString('en-US');
                const isSelected = date && isInCurrentMonth && requestDates && requestDates.includes(dateString);
                return <Badge badgeContent={isSelected ? '🐾' : undefined}>{dayComponent}</Badge>;
              }}
            />
          </MuiPickersUtilsProvider>
        </Card>
      </Grid>
    </Grid>
  );
}
