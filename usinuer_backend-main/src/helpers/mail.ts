import mail from "@config/mail";
import { any, object } from "joi";
import nodemailer from "nodemailer";

export async function sendMail(
	to: any,
	subject: any,
	html: any,
	isAsync = true,
	attachment = null,
) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: mail.mailfrom,
			pass: mail.mailuserpwd,
		},
		//tls: { ciphers: "SSLv3" },
	});

	let mailOption;
	mailOption = {
		from: mail.mailfrom,
		to: to,
		subject: subject,
		html: html,
	};

	if (isAsync) {
		await transporter.sendMail(mailOption, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent for verification: " + info.response);
			}
		});
	} else {
		return transporter.sendMail(mailOption);
	}
}

export const site_mail_data = {
	"!site_name": "machining-4u.co.uk",
	"!site_url": "http://machining-4u.co.uk/",
	"!contact_url": "admin@machining-4u.co.uk",
	"!site_title": "Machining-4u",
	

}
