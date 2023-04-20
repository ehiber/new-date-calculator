import React, { useRef } from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";

export const TableModulesByWeeks = ({ modulesByWeeks, format }) => {
	const ref = useRef();

	return (
		<TableContainer ref={ref} sx={{ maxWidth: 1000 }} component={Paper}>
			<Table
				sx={{ maxWidth: 1000 }}
				aria-label="customized table"
			>
				<TableHead>
					<TableRow>
						<StyledTableCell>Week</StyledTableCell>
						<StyledTableCell>Sunday</StyledTableCell>
						<StyledTableCell>Monday</StyledTableCell>
						<StyledTableCell>Thursday</StyledTableCell>
						<StyledTableCell>Wednesday</StyledTableCell>
						<StyledTableCell>Tuesday</StyledTableCell>
						<StyledTableCell>Friday</StyledTableCell>
						<StyledTableCell>Saturday</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{modulesByWeeks && modulesByWeeks.map((week,index) => {
						return (
							<StyledTableRow key={index}>
								<StyledTableCell
									component="td"
									// scope="row"
								>
									{index + 1}
								</StyledTableCell>

								{week && week.map((module,index) => (
									<StyledTableCell
										key={index}
										component="td"
										// scope="row"
										align="center"
									>
										{ module?.moduleName ? (
											<>
												<p className="module">
													{module.moduleName !== "" && module.moduleName}
												</p>
												<p className="date">
													{module.suggestDay !== "" && module.suggestDay.format(format)}
												</p>
												<p className="current-day">
													{module.currentDay > 0 && `Day: ${module.currentDay}`}
												</p>
											</>
										) : (
											<i className="fa-solid fa-laptop-code table-icon"></i>                                                )
										}
									</StyledTableCell>
								))}
							</StyledTableRow>);
						})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

TableModulesByWeeks.propTypes = {
	modulesByWeeks: PropTypes.array.isRequired,
    format: PropTypes.string.isRequired
};