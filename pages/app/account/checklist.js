import React from "react";
import { useRouter } from "next/router";
import { isAuth } from "@/helper/client/api/auth/isAuth";
import AppLayout from "@/components/layouts/AppLayout";
import styles from "@/styles/app/account/checklist.module.css";
import Link from "next/link";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ButtonPrimary from "@/components/designs/ButtonPrimary";
import ButtonSecondary from "@/components/designs/ButtonSecondary";

function Checklist({ userSession, pageTitle }) {
	const router = useRouter();

	return (
		<div className={`${styles.checklist_page} ${styles.flexCol}`}>
			<p>
				Complete
				<b> mandatory </b>
				tasks in order to publish your site.
			</p>
			<div
				className={`${styles.mandatory_checklist_box} ${styles.checklist_box}`}
			>
				<h3>Mandatory</h3>
				<div className={`${styles.tasks_box} ${styles.flexCol}`}>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<CheckCircleOutlineIcon fontSize="small" color="success" />
								<p style={{ textDecoration: "line-through" }}>
									Verify your email
								</p>
							</div>
							<button
								style={{
									color: "var(--gray-light-med)",
									border: "transparent",
								}}
							>
								Done
							</button>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Upload your products</p>
							</div>
							<div>
								<ButtonPrimary name="Go" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Set up delivery information</p>
							</div>
							<div>
								<ButtonPrimary name="Go" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Set up payments</p>
							</div>
							<div>
								<ButtonPrimary name="Go" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Set your hours</p>
							</div>
							<div>
								<ButtonPrimary name="Go" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Go live</p>
							</div>
							<div>
								<ButtonPrimary name="Go" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
				</div>
			</div>
			<div
				className={`${styles.suggested_checklist_box} ${styles.checklist_box}`}
			>
				<h3>Suggested</h3>
				<div className={`${styles.tasks_box} ${styles.flexCol}`}>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>Tips and tricks</p>
							</div>
							<div>
								<ButtonSecondary name="View" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>How to get support</p>
							</div>
							<div>
								<ButtonSecondary name="View" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
					<div className={`${styles.checklist}`}>
						<div className={`${styles.task_group} ${styles.flex}`}>
							<div className={`${styles.task} ${styles.flex}`}>
								<ClearIcon fontSize="small" color="disabled" />
								<p>How your subscription works</p>
							</div>
							<div>
								<ButtonSecondary name="View" />
							</div>
						</div>
						<div className={`${styles.task_group} ${styles.flex}`}></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Checklist;

export async function getServerSideProps(context) {
	return isAuth(context, (userSession) => {
		return {
			props: {
				userSession,
			},
		};
	});
}

Checklist.getLayout = function getLayout(
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

Checklist.pageTitle = "Checklist";
Checklist.pageIcon = <ChecklistIcon color="var(--primary-dark-med)" />;
Checklist.pageRoute = "checklist";
Checklist.mobilePageRoute = "checklist";
