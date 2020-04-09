const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const nodemailer = require("nodemailer");
const app = express();
const helmet = require("helmet");
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let formData;
let backURL;
let sender;
let date;
let formEmail;

app.post("/:email", (req, res) => {
  formData = req.body;
  res.status(203).sendFile(__dirname + "/public/res.html");
  const referer = require("./referes");
  date = moment().format("MMMM Do YYYY, h:mm:ss a");
  backURL = new referer(req.headers.referer);
  sender = req.params.email;
});

app.get("/:email/backurl", (req, res) => {
  res.send(backURL);
});

app.get("/:email/sendmail", async (req, res) => {
  const receiver = sender;
  const backaddress = backURL;
  // attach backURL and date to email template
  formEmail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
       <td style="padding: 10px 0 30px 0;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="600"
          style="border: 1px solid #cccccc; border-collapse: collapse;"
        >
        <tr>
          <td
            align="center"
            bgcolor="#B3C3D0"
            style="
            padding: 40px 0 30px 0;
            color: black;
            font-size: 28px;
            font-weight: bold;
            font-family: Arial, sans-serif;
            "
          >
              Easy Mailer
          </td>
        </tr>
        <tr>
         <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td
            style="
            color: #153643;
            font-family: Arial, sans-serif;
            font-size: 24px;
            "
          >
              <b>You have a new message!</b>
          </td>
        </tr>
        <tr>
          <td
            style="
            padding: 20px 0 30px 0;
            color: #153643;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 20px;
            "
          >
            Someone at ${backaddress.refer} sent you a new message at ${date}. Here is what they had to say.
          </td>
        </tr>
        <!-- start of message -->
`;

  for (const a in formData) {
    formEmail += `
                  <tr>
                    <td
                      style="
                      color: #153643;
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      "
                    >
                      <hr />
                      <b> ${a}:</b>

                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                      padding: 10px 0 10px 0;
                      color: #153643;
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 20px;
                      "
                      >
                       ${formData[a]}
                    </td>
                  </tr>
                  `;
  }
  formEmail += `
                  </table>
                  </td>
                </tr>

                <tr>
                  <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td
                          style="
                            color: #ffffff;
                            font-family: Arial, sans-serif;
                            font-size: 14px;
                          "
                          width="75%"
                        >
                          You are receiving this because you confirmed this email
                          address on EasyMail. If you don't remember doing that, or
                          no longer wish to receive these emails, please remove the
                          form on ${backaddress.refer}.
                          <hr />

                          &copy; Easy Mailer, 2020 <br />
                          www.easymailer.com
                        </td>
                        <td align="right" width="25%">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td
                                style="
                                  font-family: Arial, sans-serif;
                                  font-size: 12px;
                                  font-weight: bold;
                                "
                              >
                                <a
                                  href="http://www.twitter.com/"
                                  style="color: #ffffff;"
                                >
                                  <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif"
                                    alt="Twitter"
                                    width="38"
                                    height="38"
                                    style="display: block;"
                                    border="0"
                                  />
                                </a>
                              </td>
                              <td style="font-size: 0; line-height: 0;" width="20">
                                &nbsp;
                              </td>
                              <td
                                style="
                                  font-family: Arial, sans-serif;
                                  font-size: 12px;
                                  font-weight: bold;
                                "
                              >
                                <a
                                  href="http://www.twitter.com/"
                                  style="color: #ffffff;"
                                >
                                  <img
                                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif"
                                    alt="Facebook"
                                    width="38"
                                    height="38"
                                    style="display: block;"
                                    border="0"
                                  />
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>

  `;

  // send email
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "oluwakayode.alao@gmail.com", // generated ethereal user
      pass: "OLUWAkayode19931", // generated ethereal password
    },
  });

  let mailOption = await transporter.sendMail({
    from: "oluwakayode.alao@gmail.com", // sender address
    to: `${receiver}`, // list of receivers
    subject: "New Email from Easy Mailer", // Subject line
    html: formEmail, // html body
  });

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error.response);
      res.json(
        "There was an error while sending the message, Kindly contact the website owner."
      );
    } else {
      console.log(info.response);
      res.json("Message sent successfully");
    }
  });
});

app.listen(3000, () => console.log("server started"));
