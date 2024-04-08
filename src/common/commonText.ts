/**
 * common messages which used in app
 */
const commonStatement = {
  //Api Call Related Messages
  noNetworkAlert: 'No Internet Connection',
  requestTimeoutMessage:
    'It looks like the request is taking longer than expected time. Please check your internet connectivity and try again',
  serverErrorMessage:
    "it looks like we're encountering server errors. We'll be back up soon. Sorry!",
  connectWithText: 'Connect With',
  forgotPasswordText: 'Forgot Password?',
  passwordInstructions:
    'Password with one capital alphabet, one small alphabet, one digit and one special character. Min 6 and Max 18 characters only',
};

/**
 * routenames of each screen used in app
 */
const routeNames = {
  welcomeRoute: 'WelcomeContainer',
  loginRoute: 'LoginContainer',
};

/**
 * page title which used in Header of Perticular screen
 */
const pageTitles = {
  forgotPassword: 'Forgot Password?',
  forgotPasswordWithoutQ: 'Forgot Password',
  signUp: 'Sign Up',
};

/**
 * Common Button title
 */
const buttons = {
  submit: 'Submit',
  male: 'Male',
  female: 'Female',
  resend: 'Resend',
  getStarted: 'Get Started',
  continue: 'Continue',
  next: 'Next',
  done: 'Done',
};

/**
 * set of all messages and text
 */
const commonText = {
  ...routeNames,
  ...commonStatement,
  ...pageTitles,
  ...buttons,
};

export default commonText;
