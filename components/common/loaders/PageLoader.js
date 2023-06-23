import React from "react";
import styles from "@/styles/components/loaders/page-loader.module.css";

function PageLoader() {
	return (
		<div className={`${styles.box_outer}`}>
			<div className={`${styles.box_inner}`}>
				<div className={`${styles.box}`}></div>
			</div>
		</div>
	);
}

export default PageLoader;
