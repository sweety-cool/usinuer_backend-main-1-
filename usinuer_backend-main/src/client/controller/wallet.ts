import { Response } from "express";
import { asyncWrapper, R } from "@helpers/response-helpers";
import { UserAuthRequest } from "@middleware/auth";
import models from "@model/index";
import db from "@db/mysql";
import { uploadFile, uploadOneFile } from "@helpers/upload";
import { Pick, Validate } from "validation/utils";
import schema from "validation/schema";
import moment from "moment";
import { Op } from "sequelize";
import axios from "axios";
import { sendMail, site_mail_data } from "@helpers/mail";

import paypal from "paypal-rest-sdk";

paypal.configure({
	mode: "sandbox",
	client_id:
		"AdttYSVnm8UEVFoLjLFNdUXxpAX8DOZxpXU4QvU50_1X6lTy0lvfO99-dG921aPbbIaVddVZtLs7dcbG",
	client_secret:
		"EK6ldhLwJKJRZtSpZO7zXiMMPhFKsH8YLSzQ9kOqgUuBliotfEIt3ImUY9nacz46OQHYlCqhohlnEB8o",
});

export default {
	test: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		res.send("Hello from wallet ");
	}),
	create_order: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		// validation

		let orderId = "1KK29035TN181923N";

		var create_payment_json = {
			intent: "sale",
			payer: {
				payment_method: "paypal",
			},
			redirect_urls: {
				return_url: "http://return.url",
				cancel_url: "http://cancel.url",
			},
			transactions: [
				{
					item_list: {
						items: [
							{
								name: "item",
								sku: "item",
								price: "1.00",
								currency: "USD",
								quantity: 1,
							},
						],
					},
					amount: {
						currency: "USD",
						total: "1.00",
					},
					description: "This is the payment description.",
				},
			],
		};

		paypal.payment.create(create_payment_json, function (error, payment) {
			if (error) {
				return R(res, false, error.message, error);
			} else {
				console.log("Create Payment Response");
				return R(res, true, "Order Created", payment);
			}
		});

		// let response_data = await axios.post("",{
		// 	order_id: data.order_id
		// },)
	}),

	pay_machinist: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		// validation
		let data = await Validate(
			res,
			[],
			schema.wallet.pay_machinist,
			req.body,
			{},
		);
		console.log("req query is:---", req.query.chkstate)

		
		let project = await models.projects.findByPk(data.project_id);

		const proj_img= await models.project_images.findOne({
			where: {
				project_id: data.project_id
				},
			})
		
		if (req.query.chkstate == "true") {
			proj_img?.update({ approved: 2 })
		} else {
			proj_img?.update({ approved: 1 })
			}
		
		if (!project) {
			return R(res, false, "Invalid Project");
		}

		if (!project.programmer_id) {
			return R(res, false, "Invalid Request");
		}

		let bid = await models.bids.findOne({
			where: {
				project_id: data.project_id,
				user_id: project.programmer_id,
			},
		});

		if (!bid) return R(res, false, "Invalid	Request");
		let mach = await models.users.findOne({
			where: {
				id: project.programmer_id
			}
		})
	

		let machinist_wallet = await models.user_balance.findOne({
			where: {
				user_id: project.programmer_id,
			},
		});

		if (!machinist_wallet) {
			machinist_wallet = await models.user_balance.create({
				user_id: project.programmer_id,
				amount: 0.0,
				amount_gbp: 0.0,
			});
		}

		machinist_wallet.increment({
			amount: bid.bid_amount,
			amount_gbp: bid.bid_amount_gbp,
		});
		var today = new Date();

		project.project_status = "5";
		project.fund_release_date = today;

		await project.save();

		const cdate = new Date()
		let notifdata: any = {
			email_type: "Pay machinist",
			email_subject: "Machinist selected",
			supplier_id: project.programmer_id,
			email_body: `Dear ${mach?.user_name},

				Congratulations! Your customer is satisfied with the quality of your work for the project ${project?.project_name}. Your client has just released the funds to your account on Machining-4u.
				
				Machining-4u has taken a small commission fee as a requirement for being used as a third party service.
				
				The amount you've had added to your account is £${bid.bid_amount} (£${bid.bid_amount_gbp} minus the Machining-4u commission).
				
				To access your account on Machining-4u, click here .
				
				Regards,
				
				Machining-4u
				
				www.machining-4u.co.uk`,
			notif_date: cdate,
			message_status: "R",
			project_id: project?.id,
			customer_id: req.user?.id
			}


		let notifs = await models.notif_email_list.create(notifdata)
		
		console.log("time:--",Number(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()))

		let transaction_details = await models.transactions.findOne({
			where: {
				project_id: data.project_id,
			},
		});
		if (!transaction_details) {
			return R(res, false, "Invalid  transaction");
		}

		await transaction_details.update({
			//amount: data.amount,
			amount_gbp: transaction_details.amount_gbp,
			type: "PAID TO MACHINIST",

			//			status: "SUCCESS",
			status: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(), // as timedate
			transaction_time: 3, // as status


			description: "Paid to Machinist",
		});


		const invoicedata: any = {
			inv_no: new Date().getFullYear() + transaction_details.id.toString(),
			project_id: project.id,
			transaction_id: transaction_details.id,
			commission_rate: 14.90,
			pdf_link: "",
			created_date: Date.now()
		}

		await models.invoices.create(invoicedata)
		
		
			
	


		let machinist = await models.users.findOne({
			where: {
				id: project.programmer_id
			}
		})

		let task_id = 108;

		const api_data_rep: object = {
			"!project": project.project_name,
			"!username": machinist?.user_name,
			"!bid_amount": transaction_details.amount,
			"!withdraw_url":`http://18.169.104.118/auth/sign-in`,
			"!amount": transaction_details.amount_gbp
		}

		const mailData = await models.email_templates.findOne({
			where: {
				id: task_id,
				country_code: "en"
			},
			attributes: ["title", "mail_subject", "mail_body"],
		});

		var body = mailData?.mail_body;
		var title = mailData?.title;
		var subject = mailData?.mail_subject;

		(Object.keys(api_data_rep) as (keyof typeof api_data_rep)[]).forEach(key => {
			if (body?.includes(key)) {
				var re = new RegExp(key, 'g');
				body = body.replace(re, api_data_rep[key])
			}

			if (title?.includes(key)) {
				var re = new RegExp(key, 'g');
				title = title.replace(re, api_data_rep[key])
			}

			if (subject?.includes(key)) {
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, api_data_rep[key])
			}




		});


		(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(key => {


			if (body?.includes(key)) {

				var re = new RegExp(key, 'g');

				body = body.replace(re, site_mail_data[key])
			}

			if (title?.includes(key)) {
				var re = new RegExp(key, 'g');
				title = title.replace(re, site_mail_data[key])
			}

			if (subject?.includes(key)) {
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, site_mail_data[key])
			}
		})

		sendMail(machinist?.email, subject, body);

		let user = await models.users.findOne({
			where:{
				id: project.creator_id
			}
		})

		let task_id_cust = 97;

		const api_data_rep_cus: object = {
			"!project": project.project_name,
			"!username": user?.user_name,
			"!bid_amount": transaction_details.amount,
			"!withdraw_url":`http://18.169.104.118/auth/sign-in`,
			"!amount": transaction_details.amount_gbp,
			"!supplier_username": machinist?.user_name,
			"!feedback_url": "http://18.169.104.118/"
		}

		const mailData_cus = await models.email_templates.findOne({
			where: {
				id: task_id_cust,
				country_code: "en"
			},
			attributes: ["title", "mail_subject", "mail_body"],
		});

		var body = mailData_cus?.mail_body;
		var title = mailData_cus?.title;
		var subject = mailData_cus?.mail_subject;

		(Object.keys(api_data_rep_cus) as (keyof typeof api_data_rep_cus)[]).forEach(key => {
			if (body?.includes(key)) {
				var re = new RegExp(key, 'g');
				body = body.replace(re, api_data_rep_cus[key])
			}

			if (title?.includes(key)) {
				var re = new RegExp(key, 'g');
				title = title.replace(re, api_data_rep_cus[key])
			}

			if (subject?.includes(key)) {
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, api_data_rep_cus[key])
			}




		});


		(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(key => {


			if (body?.includes(key)) {

				var re = new RegExp(key, 'g');

				body = body.replace(re, site_mail_data[key])
			}

			if (title?.includes(key)) {
				var re = new RegExp(key, 'g');
				title = title.replace(re, site_mail_data[key])
			}

			if (subject?.includes(key)) {
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, site_mail_data[key])
			}
		})

		sendMail(user?.email, subject, body);

		return R(res, true, "Paid to Machinist", {transaction_details});
	}),
};
