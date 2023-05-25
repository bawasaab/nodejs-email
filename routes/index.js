const express = require('express');
const router = express.Router();

const fs = require('fs')
const pdf = require('html-pdf')

const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
    auth: {
      user: 'test@yopmail.com',
      pass: 'Welcome@123',
    },
  secure: true,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send-mail', function(req, res, next) {
  const body = req.body
  const data = `
  <!DOCTYPE html>
<html>
	<head>
		<meta charset='utf-8'>
		<meta http-equiv='X-UA-Compatible' content='IE=edge'>
		<title>${body.title}</title>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
	</head>
	<body>
		<div style="width: 21cm; height: 29.7cm; background-color:rgb(209, 206, 206);border: 3px solid rgb(2, 106, 167);">
			<h2 style="margin-left: 250px;color:rgb(2, 106, 167);">New Service Request</h2>
			<hr style="height: 2px;background-color: rgb(2, 106, 167);">
			<hr>
			<div style="display: flex; flex:wrap;height: 300px;">
				<img src="/src/assets/Images/logo.png" style="height: 139px;width: 300px;margin-top: 50px;">
				<div style="margin-left:75px;">
					<p style="color: rgb(2, 106, 167);">
						<strong>MODERN HVAC TECHNOLOGY</strong>
					</p>
					<p>
						<b>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;5555 N Sheridan Rd,</b>
					</p>
					<p>
						<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chicago, IL 60640,</b>
					</p>
					<p>
						<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;United States</b>
					</p>
					<p style="color: brown;">
						<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+1 312-502-9394</b>
					</p>
					<p style="color: brown;">
						<b>modernhvactech@gmail.com</b>
					</p>
					<p>
						<b>DATE:</b>(${body.service_date})
					</p>
				</div>
			</div>
			<div style="height: 200px;">
				<hr style="height: 2px;background-color: rgb(2, 106, 167);">
				<h3 style="color: rgb(2, 106, 167);padding-left: 25px;margin-top: -10px;">Discription :</h3> ${body.description}
			</div>
			<div>
				<hr style="height:3px;background-color: rgb(2, 106, 167);">
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Name:</strong> ${body.fullname}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Contact No:</strong> ${body.contact}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Email:</strong> ${body.email}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Address :</strong> ${body.address}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Service:</strong> ${body.service}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Time:</strong> ${body.service_time}
				</p>
				<p style="margin-top: 30px;">
					<strong style="color: rgb(2, 106, 167);padding-left: 25px; ">Submission Date:</strong> ${body.service_date}
				</p>
			</div>
			<hr style="height: 2px;background-color: rgb(2, 106, 167);">
			<p style="margin-left:15cm; margin-top: 15px;">
				<strong>Regards:</strong>ModernHvacTech
			</p>
			<hr>
			<hr style="height: 2px;background-color: rgb(2, 106, 167);">
		</div>
	</body>
</html>
  `
  const id = uuidv4()
  const fileName = 'C:/Users/admin/Documents/testsProjects/send-mail/views/businesscard_'+id+'.html'
  const writeD = fs.writeFileSync(fileName, data)
  const htmlIns = fs.readFileSync(fileName, 'utf8')
  const options = { format: 'Letter' }

  pdf.create(htmlIns, options).toFile('./businesscard.pdf', function(err, resl) {
    if (err) return console.log(err);
    // console.log(resl); // { filename: '/app/businesscard.pdf' }
    const mailData = {
      from: 'deepak.bawa.orionsolutions@gmail.com',  // sender address
      // to: 'vcax99@gmail.com',   // list of receivers
      to: body.to,   // list of receivers
      subject: body.subject,
      text: `That was easy!`,
      html: htmlIns,
      attachments: [
        {
          filename: 'businesscard.pdf',
          path: resl.filename,
          contentType: 'application/pdf'
        }
      ]
    };
    // console.log('mailData',mailData)
  
    transporter.sendMail(mailData, function (err, info) {
      if(err) {
        res.send({
          code: '500',
          msg: 'Mail not send',
          data: err.toString()
        })
      } else {
        res.send({
          code: '500',
          msg: 'Mail sent successfully',
          data: info.messageId.toString()
        })
      }
      fs.unlink(fileName, (err) => {
        if (err) {
          console.log('unlink err', err)
        } else {
          console.log('unlink success')
        }
      })
    });
  })
})

module.exports = router;
