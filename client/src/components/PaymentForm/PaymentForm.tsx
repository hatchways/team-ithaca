import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import clsx from 'clsx';
import useStyles from './useStyles';
import {
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioProps,
  TextField,
} from '@material-ui/core';
import { FormEvent, useState } from 'react';
import { useSnackBar } from '../../context/useSnackbarContext';
import { PaymentMethod } from '@stripe/stripe-js';
import axios from 'axios';

interface Props {
  requestId: string;
  totalAmount: number;
}

export default function PaymentForm({ requestId, totalAmount }: Props): JSX.Element {
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

  function StyledRadio(props: RadioProps) {
    return (
      <Radio
        className={classes.root}
        disableRipple
        color="default"
        checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
        icon={<span className={classes.icon} />}
        {...props}
      />
    );
  }

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
    const res = await axios.post<any>(`/requests/${requestId}/pay`, {
      totalAmount: totalAmount,
      paymentMethod_id: paymentMethod.id,
    });

  };

  

  return (
    <Grid container className={classes.paymentRoot}>
      <Typography variant="h4">Checkout</Typography>
      <Grid className={classes.paymentContainer}>
        <Grid item sm={6}>
          <TextField
            fullWidth
            label="Card Holder"
            value={billingDetails.name}
            variant="outlined"
            className={classes.input}
            onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
          />
          <form onSubmit={handleSubmit}>
            <CardElement options={CARD_OPTIONS} className={classes.cardElement} />
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
