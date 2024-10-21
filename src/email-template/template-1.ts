// import "./style-template-1.css";

export const template1 = (
  name: string,
  FRONTEND_URL: string,
  verificationToken: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        padding: 20px;
        background-color: #ffffff;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .logo {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
      }
      h1 {
        color: #333;
        font-size: 24px;
        text-align: center;
      }
      p {
        color: #555;
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
      }
      a.button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #aaa;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img
          src="https://res.cloudinary.com/dm2k40ije/image/upload/v1728494587/ufm9ymrxb5pvcmpywd4z.png"
          alt="clickOrder Logo"
          width="250px"
          height="30px"
          style="display: block"
          title="clickOrderLogo"
        />
      </div>
      <h1>${name}, Please Confirm Your Email Address</h1>
      <p>
        Thank you for signing up with us! To complete your registration, please
        click the button below to verify your email address:
      </p>
      <p>
        <a
          href="${FRONTEND_URL}/auth/validate-email/${verificationToken}"
          class="button"
          >Verify Email</a
        >
      </p>
      <p>If you did not create an account, please ignore this email.</p>
      <div class="footer">
        <p>&copy; 2024 clickOrder. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
 `;
};
