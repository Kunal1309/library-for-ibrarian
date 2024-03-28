import nodemailer from "nodemailer"; // Import nodemailer for email sending
import Mailgen from "mailgen"; // Import Mailgen for generating email templates
import "dotenv/config"; // Import dotenv for environment variables

export default async function getMail(req, res) {
  // Extract OTP and configure email service
  const otp = req.body.otp;
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Use environment variable for email
      pass: process.env.PASSWORD, // Use environment variable for email password
    },
  };

  let transporter = nodemailer.createTransport(config); // Create transporter for sending emails

  let Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Kunal Titare",
      link: "https://mailgen.js/", // Placeholder link for email template
    },
  });

  // Email message content
  let message = {
    from: process.env.EMAIL, // Sender email
    to: "titarekunal@gmail.com", // Receiver email (in this case, hardcoded for demonstration)
    subject: "New Registration", // Email subject
    html: `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <title>CodePen - OTP Email Template</title>
          
        
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Library</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Greeting from Library. Someone with below details want to register in your Library. If you want to allow him/her then share the following OTP to complete His/her Registration Procedure. OTP is valid for 5 minutes</p>
            <p>Name: ${req.body.name} </p>
            <p>Email: ${req.body.email} </p>
            <p>Mobile: ${req.body.mobile} </p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">OTP:- ${otp}</h2>
            <p style="font-size:0.9em;">Regards,<br />Kunal Titare</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Kunal Titare</p>
              <p>Nagpur, Maharashtra</p>
              <p>India</p>
              <p>+91 6202745560</p>
            </div>
          </div>
        </div>
        <!-- partial -->
          
        </body>
        </html>`,
  };

  // Send email using transporter
  transporter
    .sendMail(message)
    .then(() => {
      // Send success response
      res.setHeader("Content-Type", "application/json");
      return res.status(201).send({
        msg: "You should recieve a  mail",
      });
    })
    .catch((error) => {
      return res.status(500).send({ error }); // Send error response if email sending fails
    });
}
