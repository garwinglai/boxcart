import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

function LinearProgressWithLabel(props) {
	const { value } = props;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
				gap: "20px",
			}}
		>
			<Box sx={{ width: "100%", color: "var(--primary)" }}>
				<LinearProgress
					variant="determinate"
					{...props}
					// sx={{ background: "var(--primary-light)" }}
					sx={{
						backgroundColor: `var(--primary-light)`,
						"& .MuiLinearProgress-bar": {
							backgroundColor: `var(--primary)`,
						},
						height: "7px",
						borderRadius: "15px",
					}}
				/>
			</Box>
			<Box
				sx={{
					minWidth: 35,
				}}
			>
				<Avatar
					alt="progress percent"
					sx={{ width: 40, height: 40, backgroundColor: "var(--primary)", fontSize: "0.75rem" }}
				>{`${Math.round(value)}%`}</Avatar>
			</Box>
		</Box>
	);
}

export default LinearProgressWithLabel;
