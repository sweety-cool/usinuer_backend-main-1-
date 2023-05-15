import dotenv from "dotenv";
dotenv.config();

export default {
	// App
	secret: process.env.APP_SECRET || "",
	port: process.env.APP_PORT || 3000,

	//web push
	webPushContact: process.env.WEB_PUSH_CONTACT || "",
	publicVapidKey: process.env.PUBLIC_VAPID_KEY || "",
	secretVapidKey: process.env.PRIVATE_VAPID_KEY || "",

	//google
	GoogleClientId: process.env.GOOGLE_CLIENT_ID || "",
};
