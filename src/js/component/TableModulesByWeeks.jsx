import React, { useRef, useId } from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";
import { jsPDF } from "jspdf";

export const TableModulesByWeeks = ({ modulesByWeeks, format }) => {
	const reportTemplateRef = useRef(null);
    const columns = [
        { title: "Week", field: "Week" },
        { title: "Sunday", field: "Sunday" },
        { title: "Monday", field: "Monday" },
        { title: "Tuesday", field: "Tuesday" },
        { title: "Wednesday", field: "Wednesday" },
        { title: "Thursday", field: "Thursday" },
        { title: "Friday", field: "Friday" },
        { title: "Saturday", field: "Saturday" }
    ];

    const downloadPdf = () => {
        const doc = new jsPDF({
			format: [1000, 1000],
			unit: 'px'
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');
		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			}
		});
    };

    return (
		<div style={{display:'flex',flexDirection:'column'}}>

			<Grid>
				<Button onClick={()=> downloadPdf()}>Download PDF</Button>
			</Grid>

			<TableContainer ref={reportTemplateRef} sx={{ maxWidth: 1000 }} component={Paper}>
				<Table sx={{ maxWidth: 1000 }} aria-label="customized table">
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<StyledTableCell key={useId()}>
									{col.title}
								</StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{modulesByWeeks &&
							modulesByWeeks.map((week, index) => {
								return (
									<StyledTableRow key={index}>
										<StyledTableCell
											component="td"
											scope="row"
										>
											{index + 1}
										</StyledTableCell>
										{console.log(week)}
										{week &&
											week.map((module, index) => (
												<StyledTableCell
													key={index}
													component="td"
													scope="row"
													align="center"
												>
													{module?.moduleName ? (
														<>
															<p className="module">
																{module.moduleName !==
																	"" &&
																	module.moduleName}
															</p>
															<p className="date">
																{module.suggestDay !==
																	"" &&
																	module.suggestDay.format(
																		format
																	)}
															</p>
															<p className="current-day">
																{module.currentDay >
																	0 &&
																	`Day: ${module.currentDay}`}
															</p>
														</>
													) : (
														// <i className="fa-solid fa-laptop-code table-icon"/>
														<p> - </p>
													)}
												</StyledTableCell>
											))}
									</StyledTableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>


    );
};

TableModulesByWeeks.propTypes = {
    modulesByWeeks: PropTypes.array.isRequired,
    format: PropTypes.string.isRequired
};
