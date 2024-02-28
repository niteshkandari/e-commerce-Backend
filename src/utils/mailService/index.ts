import nodemailer from "nodemailer";

export const sendMail = (htmlTemplate: any, recipient: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "500060039@upesalumni.upes.ac.in",
      pass: "lqftptpsiwjgssba",
    },
  });

  const mailOptions = {
    from: "500060039@upesalumni.upes.ac.in",
    to: recipient,
    subject: "password reset",
    html: htmlTemplate,
  };
  return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);  
        } else {
          resolve("Email sent: " + info.response);
        //   console.log("Email sent: " + info.response);
        }
      });
  })
};
