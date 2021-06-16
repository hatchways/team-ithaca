import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import useStyles from './useStyles';
import { Grid, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { FormEvent, useState } from 'react';
import { useSnackBar } from '../../context/useSnackbarContext';
import { PaymentMethod } from '@stripe/stripe-js';

interface Props {
  totalAmount: number;
}

type res = {
  error?: { message: string };
  success?: boolean;
};

export default function PaymentForm({ totalAmount }: Props): JSX.Element {
  const [processing, setProcessing] = useState<boolean>(false);
  const [billingDetails, setBillingDetails] = useState<{ name: string }>({
    name: '',
  });
  const stripe = useStripe();
  const elements = useElements();
  const { updateSnackBarMessage } = useSnackBar();
  const classes = useStyles();
  const CARD_OPTIONS = {
    iconStyle: 'solid' as const,
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: 'black',
        fontWeight: 500,
        fontFamily: 'Roboto, Open sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87bbfd',
        },
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee',
      },
    },
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    const cardElement = elements.getElement('card');
    if (cardElement) {
      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (payload.error) {
        updateSnackBarMessage(payload.error.message || 'Please try again');
      } else {
        await paymentAction(payload.paymentMethod);
      }
    }
    setProcessing(false);
  };

  const paymentAction = async (paymentMethod: PaymentMethod) => {
    console.log(paymentMethod.id, totalAmount);
    // const res = await fetch(`/request/${requestId}/pay`, {
    const res = await fetch(`/request/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod_id: paymentMethod.id, totalAmount }),
    });
    const paymentRes = await res.json();
    handleResponse(paymentRes);
  };

  const handleResponse = async (res: res) => {
    console.log(res);
    if (res.success) {
      updateSnackBarMessage('Payment has been made, Thank you for booking.');
      setBillingDetails({
        name: '',
      });
      setTimeout(function () {
        window.location.href = '/';
      }, 2000);
    } else {
      if (res.error) {
        updateSnackBarMessage(res.error.message);
      }
    }
  };

  return (
    <Grid container className={classes.paymentRoot}>
      <Typography variant="h3">Checkout</Typography>
      <Grid className={classes.paymentContainer}>
        <Grid item sm={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              label="Card Holder"
              value={billingDetails.name}
              variant="outlined"
              className={classes.input}
              onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
            />
            <CardElement options={CARD_OPTIONS} className={classes.cardElement} />
            <Button type="submit" variant="contained" size="large" color="primary">
              {processing ? <CircularProgress style={{ color: 'white' }} /> : 'Make a Payment'}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
