import express, { Request, Response } from "express";
import cn from "@client/controller/project";
import upload from "express-fileupload";

const router = express.Router();

router.get("/test", cn.test);

router.get("/list", cn.list);

router.get("/my", cn.my);

router.get("/detail", cn.show);

router.post("/ask-question", cn.askQuestion);

router.post("/add-answer", cn.addAnswer);

router.post("/get-temp", cn.get_temp);

router.get("/get-my-temp", cn.get_my_temp);

router.get("/select-machinist", cn.select_machinist);

router.post("/deposit-fund", cn.add_payment);

router.post("/review-machinist", cn.review_machinist);

router.get("/list-msgs", cn.list_msgs);

router.get("/list-bid-msgs", cn.list_bid_msgs);

router.get("/my-inbox-msgs", cn.my_msgs);

router.get("/all-reviews", cn.allreviews);

router.get("/steps_completed_supplier", cn.steps_completed_supplier);

router.get("/customer_releasepayment_checkbox", cn.customer_releasepayment_checkbox)



/*FILE UPLOAD APIs */
router.use(upload());

router.post("/add", cn.add);
router.post("/invoice-list", cn.invoice_machinist);
router.get("/invoice-list", cn.invoice_machinist);


router.post("/add-temp", cn.add_temp);

router.post("/add-bid", cn.add_bid);

router.post("/update-bid", cn.update_bid);

router.post("/send-msg", cn.send_msg);

router.post("/send-bid-msg", cn.send_bid_msg);

router.post("/update_release_payment", cn.update_release_payment);

router.post("/machinist_confirmation_message", cn.machinist_confirmation_message);

router.post("/shipping_message_send", cn.shipping_message_send);

router.post("/request_release_funds", cn.request_release_funds);

router.post("/update_read_my_msg", cn.update_read_my_msgs);

router.post("/update_unread_my_msg", cn.update_unread_my_msgs);

router.post("/update_remove_my_msg", cn.update_remove_my_msgs);


router.get("/reviews", cn.user_reviews);
router.get("/customer_review", cn.customer_reviews);
router.get("/my-projects", cn.my_project);
router.get("/review-proj", cn.review_projects);

router.get("/image-list", cn.image_list);
router.get("/notifs", cn.notifs);
router.get("/project-review", cn.project_review);
router.get("/all-lists", cn.all_lists);
router.get("/project-gallery", cn.project_gallery);






router.get("/public-profile-api", cn.public_profile_api);

router.get("/public-me", cn.public_me);

router.get("/public-profile-total-jobs", cn.public_profile_total_jobs);

router.get("/public-user-reviews", cn.public_user_reviews);
export default router;
