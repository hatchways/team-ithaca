import { useState, ChangeEvent } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useAuth } from '../../context/useAuthContext';
import { useSnackBar } from '../../context/useSnackbarContext';
import { useUser } from '../../context/useUserContext';

import useStyles from './useStyles';
import uploadImagesAPI from '../../helpers/APICalls/uploadImages';

interface UploadImagesState {
  background: string | File;
  profile: string | File;
}

const ProfilePhoto = (): JSX.Element => {
  const [uploadImages, setUploadImages] = useState<UploadImagesState>({
    background: '',
    profile: '',
  });
  const [radioButtonValue, setRadioButtonValue] = useState<string>('Background');
  const { userState, dispatchUserContext } = useUser();
  const classes = useStyles();
  const { loggedInUser } = useAuth();
  const { updateSnackBarMessage } = useSnackBar();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    if (userState.background === '' && files?.length && radioButtonValue === 'Background') {
      const background = URL.createObjectURL(files[0]);
      dispatchUserContext({ type: 'UPLOAD_BACKGROUND', background });
      setUploadImages((prevState) => ({ ...prevState, background: files[0] }));
    }

    if (userState.profile === '' && files?.length && radioButtonValue === 'Profile') {
      const profile = URL.createObjectURL(files[0]);
      dispatchUserContext({ type: 'UPLOAD_PROFILE', profile });
      setUploadImages((prevState) => ({ ...prevState, profile: files[0] }));
    }
  };

  const handleRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue((event.target as HTMLInputElement).value);
  };

  const handleDeleteIcon = (): void => {
    if (radioButtonValue === 'Background') {
      dispatchUserContext({ type: 'REMOVE_BACKGROUND' });
      setUploadImages((prevState) => ({ ...prevState, background: '' }));
    }

    if (radioButtonValue === 'Profile') {
      dispatchUserContext({ type: 'REMOVE_PROFILE' });
      setUploadImages((prevState) => ({ ...prevState, profile: '' }));
    }
  };

  const handleImageUploads = (): void => {
    if (!uploadImages.background && !uploadImages.profile) return;
    const formData = new FormData();
    formData.set('background', uploadImages.background);
    formData.set('profile', uploadImages.profile);
    uploadImagesAPI(formData).then((data): void => {
      console.log(data);
      if (data.error) {
        updateSnackBarMessage(data.error);
      } else if (data.success) {
        updateSnackBarMessage(data.success);
      } else {
        // should not get here from backend but this catch is for an unknown issue
        console.error({ data });
        updateSnackBarMessage('An unexpected error occurred. Please try again');
      }
    });
  };

  return (
    <>
      <CardHeader title="Profile Photo" component="h1" className={classes.cardHeader} />
      <Box className={classes.mediaContainer}>
        <CardMedia
          className={classes.backgroundMedia}
          component="img"
          src={
            userState.background
              ? userState.background
              : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFJpMlEV-41ZFT8U7iUsMJzaXVIL_hAtT9A&usqp=CAU`
          }
          title="Background Picture"
          alt="Your Background"
        />
        <CardMedia
          className={classes.media}
          component="img"
          src={userState.profile ? userState.profile : `https://robohash.org/${loggedInUser?.email}.png`}
          title="User Profile Picture"
          alt="Your Profile"
        />
      </Box>
      <Typography color="textSecondary" className={classes.profileMediaInfo}>
        Be sure to use a photo that
        <Box component="span" display="block">
          clearly shows your face
        </Box>
      </Typography>
      <CardContent className={classes.cardContent}>
        <RadioGroup aria-label="Images" name="Images" value={radioButtonValue} onChange={handleRadioButtonChange}>
          <FormControlLabel
            value="Background"
            control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
            label="Background"
          />
          <FormControlLabel
            value="Profile"
            control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
            label="Profile"
          />
        </RadioGroup>
        <Box>
          <Button variant="outlined" component="label" color="primary" className={classes.upload}>
            {userState.background === '' || userState.profile === ''
              ? `Select Your ${radioButtonValue} Image`
              : `Both Files are uploaded.`}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Box>
        <Button type="button" disableFocusRipple disableRipple onClick={handleDeleteIcon}>
          <DeleteOutlineIcon />
          <Typography color="textSecondary">Delete {radioButtonValue}</Typography>
        </Button>
        <Box textAlign="center">
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleImageUploads}
          >
            Save
          </Button>
        </Box>
      </CardContent>
    </>
  );
};

export default ProfilePhoto;
