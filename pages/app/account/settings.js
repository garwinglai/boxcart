import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/account-settings.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextField from "@mui/material/TextField";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import { isAuth } from "@/helper/client/auth/isAuth";
import prisma from "@/lib/prisma";

function AccountSettings() {
	return (
		<div className={`${styles.account_settings_box} ${styles.flexCol}`}>
			<form
				className={`${styles.section_box} ${styles.user_info_box} ${styles.flexCol}`}
			>
				<div className={`${styles.section_header_box} ${styles.flex}`}>
					<h3>User Info</h3>
					<div>
						<ButtonPrimary name="Edit" />
					</div>
				</div>
				<div className={`${styles.flex} ${styles.info_name_box}`}>
					<TextField
						id="outlined-basic"
						label="First name"
						variant="standard"
						disabled
						fullWidth
					/>
					<TextField
						id="outlined-basic"
						label="Last name"
						variant="standard"
						disabled
						fullWidth
					/>
				</div>
				<TextField
					id="outlined-basic"
					label="Email"
					variant="standard"
					disabled
				/>
				<div className={`${styles.section_footer_group} ${styles.flex}`}>
					<div className={`${styles.email_verified_group} ${styles.flex}`}>
						<CheckCircleIcon fontSize="small" color="success" />
						<p>Email Verified</p>
					</div>
					<button type="button" className={`${styles.change_password_btn}`}>
						Change password
					</button>
				</div>
			</form>
			<div className={`${styles.section_left} ${styles.flex}`}>
				<form
					className={`${styles.section_box} ${styles.membership_info_box} ${styles.flexCol}`}
				>
					<div className={`${styles.section_header_box} ${styles.flex}`}>
						<h3>Membership</h3>
						<div>
							<ButtonPrimary name="Change Plan" />
						</div>
					</div>
					<div className={`${styles.membership_context_box} ${styles.flexCol}`}>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Free period:</h5>
							<p>In process</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Free period end:</h5>
							<p>June 3rd, 2023</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Current plan:</h5>
							<p>-</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Plan cost:</h5>
							<p>-</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Next payment date:</h5>
							<p>-</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Plan renews:</h5>
							<p>-</p>
						</div>
						<div className={`${styles.flex} ${styles.member_context_group}`}>
							<h5>Payment:</h5>
							<p>-</p>
						</div>
					</div>
					<div className={`${styles.section_footer_group} ${styles.flex}`}>
						<div className={`${styles.email_verified_group} ${styles.flex}`}>
							<CheckCircleIcon fontSize="small" color="disabled" />
							<p>Auto renew: Off</p>
						</div>
						<button type="button" className={`${styles.change_password_btn}`}>
							Auto Renew
						</button>
					</div>
				</form>
				<form
					className={`${styles.section_box} ${styles.payment_info_box} ${styles.flexCol}`}
				>
					<div className={`${styles.section_header_box} ${styles.flex}`}>
						<h3>Payment</h3>
						{/* <button className={`${styles.update_btn}`}>Add Payment</button> */}
						<div>
							<ButtonPrimary name="Add Payment" />
						</div>
					</div>
					<div className={`${styles.payment_context_box} ${styles.flexCol}`}>
						<div className={`${styles.flex} ${styles.payment_context_group}`}>
							<h5>Default card:</h5>
							<p></p>
						</div>
						<div className={`${styles.payment_option_box} ${styles.flexCol}`}>
							<div className={`${styles.flex} ${styles.payment_context_group}`}>
								<h5>Card:</h5>
								<p>Visa 1234</p>
							</div>
							<div className={`${styles.flex} ${styles.payment_context_group}`}>
								<h5>Cardholder name:</h5>
								<p>Garwing Lai</p>
							</div>
							<div className={`${styles.flex} ${styles.payment_context_group}`}>
								<h5>Exp:</h5>
								<p>Jun 2028</p>
							</div>
							<div className={`${styles.flex} ${styles.payment_context_group}`}>
								<h5>Payment type:</h5>
								<p>Apple Pay</p>
							</div>
						</div>
					</div>
				</form>
			</div>
			{/* <SaveCancelButtons /> */}
		</div>
	);
}

export default AccountSettings;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

AccountSettings.getLayout = function getLayout(
	page,
	pageTitle,
	pageIcon,
	pageRoute,
	mobilePageRoute
) {
	return (
		<AppLayout
			pageTitle={pageTitle}
			pageIcon={pageIcon}
			pageRoute={pageRoute}
			mobilePageRoute={mobilePageRoute}
		>
			{page}
		</AppLayout>
	);
};

AccountSettings.pageTitle = "Account Settings";
AccountSettings.pageIcon = <SettingsIcon />;
AccountSettings.pageRoute = "account-settings";
AccountSettings.mobilePageRoute = "account-settings";
