import express, { Request, Response } from "express";
import { asyncWrapper, R } from "@helpers/response-helpers";
import { UserAuthRequest } from "@middleware/auth";
import Joi from "joi";
import models from "@model/index";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "@config/env";
import { Validate } from "@validation/utils";
import schema from "@validation/schema";
import { uploadFile, uploadOneFile } from "@helpers/upload";
import moment from "moment";
import { sendMail, site_mail_data } from "@helpers/mail";

export default {
	test: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		return R(res, true, "Test Route from Auth");
	}),

	register: asyncWrapper(async (req: UserAuthRequest, res: Response) => {

		//console.log("data 1", req.body);

		//validation
		const schema = Joi.object({
			role: Joi.number().required(),
			email: Joi.string().required(),
			check: Joi.boolean().required(),
		})
			.unknown(true)
			.validate(req.body);


		if (schema.error) {
			return R(res, false, schema.error.message);
		}

		let data = schema.value;

		let objectToBeDeleted = ["role", "check"];

		// Check if data["check"] is true
		if (data.check) {
			let role = await models.roles.findOne({
				where: {
					id: data.role,
				},
			});

			if (!role) {
				return R(res, false, "Invalid Role");
			}

			let userExist = await models.users.count({
				where: {
					email: data.email,
				},
			});

			if (userExist > 0) {
				return R(res, false, "You already have an Account");
			}

			return R(res, true, "Account can be created", {
				role: role,
			});
		} else if (data.role === 1) {
			//user is customer

			//machinist validation


			const schema = Joi.object({
				account: Joi.string().required(),
				name: Joi.string().required(),
				surname: Joi.string().required(),
				user_name: Joi.string().required(),
				email: Joi.string().required(),
				password: Joi.string()
					.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"))
					.required()
					.messages({
						"string.pattern.base":
							"Password must contains at least 6 characters, including UPPER or lowercase with numbers.",
					}),
                                        SIREN: Joi.required(),
					company_name: Joi.required(),
					pro_user: Joi.required(),
					show_modal: Joi.required(),
			})
				.unknown(true)
				.validate(req.body);

			if (schema.error) {
				return R(res, false, schema.error.message);
			}

			let data = schema.value;

			let userPassword = data.password;

			let userExist = await models.users.count({
				where: {
					[Op.or]: [
						{
							user_name: data.user_name,
						},
						{
							email: data.email,
						},
					],
				},
			});

			if (userExist > 0) {
				return R(res, false, "Username or Email already exists");
			}

			if(req.body.pro_user == 1){
				data["pro_user"] = 1
			}

			data["siren"] = req.body.SIREN

			data["role_id"] = 1;
			data["country_code"] = 74;
			data.password = bcrypt.hashSync(data.password, 10);

			objectToBeDeleted.forEach((f) => delete data[f]);

			let user = await models.users.create(data);

			const token = jwt.sign({ id: user.id }, env.secret);

			let u: any = user.toJSON();
			delete u.password;
			u["token"] = token;

			// send mail function

			const api_data_rep: object = {
				"!username": user.user_name,
				"!usertype": "customer",
				"!password": userPassword,
				"!activation_url": "http://18.169.104.118/auth/sign-in"
			};



			let task_id = 186;

			const mailData = await models.email_templates.findOne({
				where: {
					id: task_id,
					country_code: "en",
				},
				attributes: ["title", "mail_subject", "mail_body"],
			});

			var body = mailData?.mail_body;
			var title = mailData?.title;
			var subject = mailData?.mail_subject;

			(Object.keys(api_data_rep) as (keyof typeof api_data_rep)[]).forEach(
				(key) => {
					if (body?.includes(key)) {
						var re = new RegExp(key, "g");
						body = body.replace(re, api_data_rep[key]);
					}

					if (title?.includes(key)) {
						var re = new RegExp(key, "g");
						title = title.replace(re, api_data_rep[key]);
					}

					if (subject?.includes(key)) {
						var re = new RegExp(key, "g");
						subject = subject.replace(re, api_data_rep[key]);
					}
				}
			);

			(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(
				(key) => {
					if (body?.includes(key)) {
						var re = new RegExp(key, "g");

						body = body.replace(re, site_mail_data[key]);
					}

					if (title?.includes(key)) {
						var re = new RegExp(key, "g");
						title = title.replace(re, site_mail_data[key]);
					}

					if (subject?.includes(key)) {
						var re = new RegExp(key, "g");
						subject = subject.replace(re, site_mail_data[key]);
					}
				}
			);

			sendMail(data.email, subject, body);



			return R(res, true, "Registered", u);
		} else if (data.role === 2) {
			//user is machinist

			//machinist validation
			const schema = Joi.object({
				user_name: Joi.string().required(),
				email: Joi.string().required(),
				password: Joi.string()
					.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"))
					.required()
					.messages({
						"string.pattern.base":
							"Password must contains at least 6 characters, including UPPER or lowercase with numbers.",
					}),
				// password_confirmation: Joi.any()
				// 	.equal(Joi.ref("password"))
				// 	.required()
				// 	.messages({ "any.only": "{{#label}} does not match" }),
				name: Joi.string().required(),
				surname: Joi.string().required(),
				address1: Joi.string().required(),
				zcode: Joi.string().required(),
				city: Joi.string().required(),
				company_name: Joi.string().required(),
				company_number: Joi.string().required(),
				Squestion: Joi.string().required(),
				answer: Joi.string().required(),
			})
				.unknown(true)
				.validate(req.body);

			if (schema.error) {
				return R(res, false, schema.error.message);
			}

			let data = schema.value;

			const machanicPass = data.password;

			let userExist = await models.users.count({
				where: {
					[Op.or]: [
						{
							user_name: data.user_name,
						},
						{
							email: data.email,
						},
					],
				},
			});

			if (userExist > 0) {
				return R(res, false, "Username or Email already exists");
			}

			data["role_id"] = 2;
			data["country_code"] = 74;
			data.password = bcrypt.hashSync(data.password, 10);
			[...objectToBeDeleted, "password_confirmation"].forEach(
				(f) => delete data[f]
			);

			let user = await models.users.create(data);

			const token = jwt.sign({ id: user.id }, env.secret);

			let u: any = user.toJSON();
			delete u.password;
			u["token"] = token;

			// send mail function

			const api_data_rep: object = {
				"!username": user.user_name,
				"!usertype": "machanic",
				"!password": machanicPass,
				"!activation_url": "http://18.169.104.118/auth/sign-in"
			};



			let task_id = 1;

			const mailData = await models.email_templates.findOne({
				where: {
					id: task_id,
					country_code: "en",
				},
				attributes: ["title", "mail_subject", "mail_body"],
			});

			var body = mailData?.mail_body;
			var title = mailData?.title;
			var subject = mailData?.mail_subject;

			(Object.keys(api_data_rep) as (keyof typeof api_data_rep)[]).forEach(
				(key) => {
					if (body?.includes(key)) {
						var re = new RegExp(key, "g");
						body = body.replace(re, api_data_rep[key]);
					}

					if (title?.includes(key)) {
						var re = new RegExp(key, "g");
						title = title.replace(re, api_data_rep[key]);
					}

					if (subject?.includes(key)) {
						var re = new RegExp(key, "g");
						subject = subject.replace(re, api_data_rep[key]);
					}
				}
			);

			(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(
				(key) => {
					if (body?.includes(key)) {
						var re = new RegExp(key, "g");

						body = body.replace(re, site_mail_data[key]);
					}

					if (title?.includes(key)) {
						var re = new RegExp(key, "g");
						title = title.replace(re, site_mail_data[key]);
					}

					if (subject?.includes(key)) {
						var re = new RegExp(key, "g");
						subject = subject.replace(re, site_mail_data[key]);
					}
				}
			);

			sendMail(data.email, subject, body);




			return R(res, true, "Registered", u);
		}
	}),
	login: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		//validation
		const schema = Joi.object({
			email_username: Joi.string().required(),
			password: Joi.string().required(),
		}).validate(req.body);

		if (schema.error) {
			return R(res, false, schema.error.message);
		}

		let data = schema.value;

		let user = await models.users.findOne({
			where: {
				[Op.or]: [
					{
						email: data.email_username,
					},
					{
						user_name: data.email_username,
					},
				],
			},
		});

		if (!user) {
			return R(res, false, "Invalid Credentials");
		}

		if (!bcrypt.compareSync(data.password, user.password || "")) {
			return R(res, false, "Invalid Credentials.");
		}
		let current_date = new Date();
		user.last_seen = current_date;

		await user.save();

		await models.login_info.create({
			user_id: user.id,
			ip_address: `${req.headers["x-forwarded-for"]}`.split(",")[0] || "",
		});

		let user_balance = await models.user_balance.findOne({
			where: {
				user_id: user.id,
			},
		});

		if (!user_balance) {
			await models.user_balance.create({
				user_id: user.id,
				amount: 0.0,
				amount_gbp: 0.0,
			});
		}

		const token = jwt.sign({ id: user.id }, env.secret);

		let u: any = user.toJSON();
		delete u.password;
		u["token"] = token;

		return R(res, true, "Logged in successfully", u);
	}),

	me: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		let user = await models.users.findOne({
			where: {
				id: req.user?.id,
			},
			include: [
				{
					model: models.country,
					as: "country_code_country",
				},
			],
			attributes: { exclude: ["password"] },
		});

		if (!user) {
			return R(res, false, "Invalid User");
		}
		return R(res, true, "User data", user);
	}),

	delivery_contacts: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		
		console.log("req-->", req);
		let id: number = Number(req.query.id);

		let user = await models.delivery_contacts.findOne({
			where: {
				project_id: id,
				user_id: req.user?.id
				 
			},
			
			
		});

		
		return R(res, true, "delivery User data", user);
	}),

	update: asyncWrapper(async (req: UserAuthRequest, res: Response) => {


		// validation
		let data = await Validate(res, [], schema.user.editUser, req.body, {});

		let user = await models.users.findOne({
			where: {
				id: req.user?.id,
			},
		});

		if (!user) {
			return R(res, false, "Invalid user");
		}

		let country = await models.country.findOne({
			where: {
				id: data.country_code,
			},
		});

		if (!country) {
			return R(res, false, "Invalid country");
		}
		let file;

		if (req.query?.change_pic) {
			// file upload
			file = await uploadOneFile(req, res);
		}

		if (file) {
			data["prof_pic"] = file;
		}

		data["country_code"] = country.id;
		data["country_symbol"] = country.country_symbol;



		if(user?.role_id==2 && user?.pro_user==1){
			data["pro_vat"] = req.body.tva;
			data["company_name"] = req.body.company_name;
			data["siren"] = req.body.siren;
		}

		await user.update(data);
		// await user.save();

		const api_data_rep: object = {
			"!username": user.user_name,
			"!data1": String(data.name),
			"!data2": String(data.surname),
			"!data3": String(data.user_name),
			"!data4": String(data.zcode),
			"!data5": String(data.description)
		}


	

		let task_id = 21;

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

		(Object.keys(api_data_rep) as (keyof typeof api_data_rep)[]).forEach(key =>{
			if(body?.includes(key)){
				var re = new RegExp(key, 'g');
				body = body.replace(re, api_data_rep[key])
			}

			if(title?.includes(key)){
				var re = new RegExp(key, 'g');
				title = title.replace(re, api_data_rep[key])
			}

			if(subject?.includes(key)){
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, api_data_rep[key])
			}



			
		});


		(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(key =>{
			
			
			if(body?.includes(key)){
				
				var re = new RegExp(key, 'g');
				
				body = body.replace(re, site_mail_data[key])
			}

			if(title?.includes(key)){
				var re = new RegExp(key, 'g');
				title = title.replace(re, site_mail_data[key])
			}

			if(subject?.includes(key)){
				var re = new RegExp(key, 'g');
				subject = subject.replace(re, site_mail_data[key])
			}
		})

		//sendMail(user.email, subject, body);

		



		return R(res, true, "profile updated");
	}),

update_pro: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		let u = await models.users.findOne({
			where: {
				id: req.body.id
			}
		});

		u?.update({ siren: req.body.SIREN, company_name: req.body.company_name, pro_user: req.body.pro_user });
		return R(res, true, "You are now a PRO Customer");
	}),

	update_address: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		// validation
		let data = await Validate(res, [], schema.user.editAddress, req.body, {});
		
		let user = await models.users.findOne({
			where: {
				id: req.user?.id,
			},
		});

		if (!user) {
			return R(res, false, "Invalid user");
		}

		await user.update(data);
		// await user.save();

		return R(res, true, "profile updated");
	}),

	save_address: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		
		let data = req.body;

		let newAddress = await models.delivery_contacts.create(data);
		console.log("address gen----->>",newAddress);
		return R(res, true, "Address saved");
	}),

	

	change_password: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		// validation
		let data = await Validate(
			res,
			[],
			schema.user.change_password,
			req.body,
			{},
		);

		let user = await models.users.findOne({
			where: {
				id: req.user?.id,
			},
		});

		if (!user) {
			return R(res, false, "Invalid user");
		}

		if (!bcrypt.compareSync(data.old_password, user.password || "")) {
			return R(res, false, "Old Password is not correct.");
		}

		user.password = bcrypt.hashSync(data.new_password, 10);

		await user.save();

		const api_data_rep: object = {
		  "!username": user.user_name,
		  "!data1": String(data.name),
		  "!data2": String(data.surname),
		  "!data3": String(data.user_name),
		  "!data4": String(data.zcode),
		  "!data5": String(data.description),
		  "!url": `http://18.169.104.118/auth/sign-in`,
		  "!newpassword": data.new_password
		};
	
		let task_id = 101;
	
		const mailData = await models.email_templates.findOne({
		  where: {
			id: task_id,
			country_code: "en",
		  },
		  attributes: ["title", "mail_subject", "mail_body"],
		});
	
		var body = mailData?.mail_body;
		var title = mailData?.title;
		var subject = mailData?.mail_subject;
	
		(Object.keys(api_data_rep) as (keyof typeof api_data_rep)[]).forEach(
		  (key) => {
			if (body?.includes(key)) {
			  var re = new RegExp(key, "g");
			  body = body.replace(re, api_data_rep[key]);
			}
	
			if (title?.includes(key)) {
			  var re = new RegExp(key, "g");
			  title = title.replace(re, api_data_rep[key]);
			}
	
			if (subject?.includes(key)) {
			  var re = new RegExp(key, "g");
			  subject = subject.replace(re, api_data_rep[key]);
			}
		  }
		);
	
		(Object.keys(site_mail_data) as (keyof typeof site_mail_data)[]).forEach(
		  (key) => {
			if (body?.includes(key)) {
			  var re = new RegExp(key, "g");
	
			  body = body.replace(re, site_mail_data[key]);
			}
	
			if (title?.includes(key)) {
			  var re = new RegExp(key, "g");
			  title = title.replace(re, site_mail_data[key]);
			}
	
			if (subject?.includes(key)) {
			  var re = new RegExp(key, "g");
			  subject = subject.replace(re, site_mail_data[key]);
			}
		  }
		);
	
		//sendMail(user?.email, subject, body);

		return R(res, true, "Password Changed");
	}),

	list_countries: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		let countries = await models.country.findAll({});

		return R(res, true, "country data", countries);
	}),

	machanic_details: asyncWrapper(async (req: UserAuthRequest,res: Response)=>{

		let machanic_id: number = Number(req.query.mach_id);
		console.log("recieved id--", machanic_id);
		
		let user = await models.users.findOne({
			where: {
				id: machanic_id,
			},
			include: [
				{
					model: models.country,
					as: "country_code_country",
				},
			],
			attributes: { exclude: ["password"] },
		});

		//console.log(user);

		if (!user) {
			return R(res, false, "Invalid User");
		}
		return R(res, true, "User data", user);


	}),

	user_balance: asyncWrapper(async (req: UserAuthRequest, res: Response) => {

		let userBalance = await models.user_balance.findOne({
			where: {
				user_id: req.user?.id,
			}
		});

		console.log(userBalance);

		if (!userBalance) {
			return R(res, false, "Invalid User");
		}
		return R(res, true, "User balance data", userBalance);

	}),

	update_balance: asyncWrapper(async (req: UserAuthRequest, res: Response) => {

		let balanceData = await models.user_balance.findOne({
			where: {
				user_id: req.user?.id,
			}
		});

		if (!balanceData) {
			return R(res, false, "Invalid User");
		}

		const user = await models.users.findOne({
			where: {
				id: req.user?.id
			}
		})

		const amountWithdraw = balanceData.amount_gbp - req.body.balance;

		balanceData.amount_gbp = req.body.balance
		balanceData.amount = 0.8 * req.body.balance

		await balanceData.save();

		//const userMail = req.user?.email;

		//console.log(user?.email);


		if (req.body.method == "paypal") {

			const api_data_rep: object = {
				"!username": user?.user_name,
				"!amount": amountWithdraw

			}




			let task_id = 177;

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

			sendMail(user?.email, subject, body);

			const cdate = new Date()
			let data: any = {
				email_type: title ,
				email_subject: subject,
				supplier_id: req.user?.id,
				email_body: body,
				notif_date: cdate,
				message_status: "R",
				project_id: 0,
				customer_id: 0

			}


			let notifs = await models.notif_email_list.create(data)


		}
		else {


			const api_data_rep: object = {
				"!username": user?.user_name,
				"!amount": amountWithdraw

			}




			let task_id = 175;

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

			sendMail(user?.email, subject, body);

			const cdate = new Date()
			let data: any = {
				email_type: title ,
				email_subject: subject,
				supplier_id: req.user?.id,
				email_body: body,
				notif_date: cdate,
				message_status: "R",
				project_id: 0,
				customer_id: 0

			}


			let notifs = await models.notif_email_list.create(data)


		}



		return R(res, true, "Updated balance data", balanceData);

	}),

	user_projects: asyncWrapper(async (req: UserAuthRequest, res: Response)=>{

		let user = await models.users.findOne({
			where: {
				id: req.user?.id,
			},
		});

		if(user?.role_id ==1){
			let user_project = await models.projects.findAll({
				where: {
					creator_id: req.user?.id,
				},
				attributes: ["id"],
			});


			return R(res, true, " Projects list", user_project);

		}

		

		let mach_project = await models.projects.findAll({
			where: {
				programmer_id: req.user?.id,
			},
			attributes: ["id"],
		});

		


		return R(res, true, " Projects list", mach_project);

		


	}),
	
	user_spent: asyncWrapper(async (req: UserAuthRequest, res: Response)=>{

		let totalSpent = await models.transactions.findAll({
			where: {
				[Op.and]: [
					{
						creator_id: req.user?.id,
					},
					{
						type: 'PAID TO MACHINIST',
					},
				],
				
			},
			attributes: ["amount","amount_gbp"]

		});

		if (!totalSpent) {
			return R(res, false, "Invalid User");
		}

		return R(res, true, "Updated balance data", totalSpent);

	}),
	update_modal: asyncWrapper(async (req: UserAuthRequest, res: Response) => {
		let id = req.body.id;
		let u = await models.users.findOne({
			where: {
				id: id
			}
		})
		u?.update({ show_modal: req.body.showmodal });
		return R(res, true, "Modal hidden");
	}),

};
