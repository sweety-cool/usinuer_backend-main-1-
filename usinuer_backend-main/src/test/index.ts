import db from "@db/mysql";

import paypal from "paypal-rest-sdk";

const Test = async () => {
	try {
		paypal.configure({
			mode: "sandbox",
			client_id:
				"AdttYSVnm8UEVFoLjLFNdUXxpAX8DOZxpXU4QvU50_1X6lTy0lvfO99-dG921aPbbIaVddVZtLs7dcbG",
			client_secret:
				"EK6ldhLwJKJRZtSpZO7zXiMMPhFKsH8YLSzQ9kOqgUuBliotfEIt3ImUY9nacz46OQHYlCqhohlnEB8o",
		});

		let orderId = "9WN50236EH272062K";

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
				throw error;
			} else {
				console.log("Create Payment Response");
				console.log(payment);
			}
		});
	} catch (err) {
		console.error(err);
	}
};

Test();
