import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { holidaysSpain } from "../assests/holidaysSpain";
import { holidaysEurope } from "../assests/holidaysEurope";
import rigoImage from "../../img/rigo-baby.jpg";
import { Container, Grid } from "@mui/material";
import { modulesFullStack } from "../assests/modulesFullStack";
import PropTypes from "prop-types";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { TableModulesByWeeks } from "./TableModulesByWeeks";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";
import { PDF } from "./PDF";
import { PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

function createData(action, suggestDay) {
    return { action, suggestDay };
}

function createModuleData(moduleName, currentDay, suggestDay) {
    return {moduleName, currentDay , suggestDay };
}

//create your first component
const Home = () => {
    const [site, setSite] = useState("spain");
    const [weeks, setWeeks] = useState(18);
    const [additionalDays, setAdditionalDays] = useState(0);
    const [schedule, setSchedule] = useState("mwf");
    const [dateBase, setDateBase] = useState(dayjs());
    const [dates, setDates] = useState([]);
    const [modulesByWeeks, setModulesByWeeks] = useState([]);
    const [breakClasses, setBreakClasses] = useState({
        initial: dayjs("12/23/23"),
        ended: dayjs("01/07/24")
    });
    const ref = React.createRef();
    const holidays = {
        spain: holidaysSpain,
        europe: holidaysEurope
    };
    const format = "DD/MM/YYYY";

    const modules = {
        fullStack: modulesFullStack
    };

    useEffect(() => {
        if (!dateBase.isSame(dayjs(), "day")) {
            suggestingActionDates();
        }
    }, [dateBase, site, weeks, schedule, additionalDays]);

    const suggestingActionDates = () => {
        const daysCourse = weeks * 3 + additionalDays;
        const scheduleDays = schedule === "mwf" ? [1, 3, 5] : [2, 4, 6];
        const diffBreakClasses = breakClasses.ended.diff(
            breakClasses.initial,
            "days"
        );
        let currentModule = 2;
        let currentDate = dateBase;
        let day = 2;
        let suggestDays = [
            createData("Start Date", dateBase),
            createData("Create Meet Event", dateBase.subtract(15, "days")),
            createData("Create YT Playlist", dateBase.subtract(15, "days")),
            createData("Welcome Message", dateBase.subtract(7, "days")),
            createData("NPS 1", dateBase.add(9, "days")),
            createData("NPS 2", dateBase.add(39, "days")),
            createData("NPS 3", dateBase.add(69, "days"))
        ];

        let modulesByWeeksList = [];

        let auxWeekModuleList = [];

        if(schedule === "mwf"){
            auxWeekModuleList = [
                createModuleData("",0,""),
                createModuleData(modules.fullStack[currentModule-2].moduleName,modules.fullStack[currentModule-2].currentDay,currentDate)
            ];

        } else {
            auxWeekModuleList = [
                createModuleData("",0,""),
                createModuleData("",0,""),
                createModuleData(modules.fullStack[currentModule-2].moduleName,modules.fullStack[currentModule-2].currentDay,currentDate)
            ];
        }

        while (day <= daysCourse) {
            currentDate = currentDate.add(1, "day");
            if (currentDate.isSame(breakClasses.initial, "day")) {
                currentDate = currentDate.add(diffBreakClasses, "day");
                auxWeekModuleList.push(
                    createModuleData("",0,"")
                );
            }
            if (holidays[site].includes(currentDate.format(format))) {
                currentDate = currentDate.add(1, "day");
                auxWeekModuleList.push(
                    createModuleData("",0,"")
                );
            }
            if (scheduleDays.includes(currentDate.day())) {
                day++;
                auxWeekModuleList.push(
                    createModuleData(modules.fullStack[currentModule-1]?.moduleName,modules.fullStack[currentModule-1]?.currentDay,currentDate)
                );
                if (modules.fullStack[currentModule-1]?.currentDay < modules.fullStack[currentModule-1]?.duration){
                    modules.fullStack[currentModule-1].currentDay = modules.fullStack[currentModule-1]?.currentDay + 1; 
                } else {
                    currentModule++;
                }
            } else {
                auxWeekModuleList.push(
                    createModuleData("",0,"")
                );
            }
            if (auxWeekModuleList.length == 7){
                modulesByWeeksList.push(auxWeekModuleList);
                auxWeekModuleList = [];
            }
        }
        if (weeks === 18) {
            suggestDays.push(
                createData("NPS 4", currentDate.subtract(28, "days"))
            );
            suggestDays.push(
                createData("NPS 5", currentDate.subtract(7, "days"))
            );
        } else {
            suggestDays.push(
                createData("NPS 4", currentDate.subtract(7, "days"))
            );
        }
        suggestDays.push(createData("Final Presentation", currentDate));
        while (auxWeekModuleList.length !== 7){
            auxWeekModuleList.push(
                createModuleData("",0,"")
            );
        }
        modulesByWeeksList.push(auxWeekModuleList);
        setDates(suggestDays);
        setModulesByWeeks(modulesByWeeksList);
    };

    return (
        <Container>
            <Grid
                container
                justifyContent="center"
                textAlign="center"
                spacing={3}
            >
                <Grid item sm={12} display="flex" justifyContent="center">
                    <h1 className="text-center mt-5">Hello </h1>
                    <img style={{ width: "150px" }} src={rigoImage} />
                </Grid>
                <Grid item sm={12}>
                    <h2>Please select your site to know the holidays</h2>
                </Grid>
                <Grid item sm={12} display="flex" justifyContent="space-evenly">
                    <FormControl>
                        <InputLabel id="simple-select-label-site">
                            Site
                        </InputLabel>
                        <Select
                            labelId="simple-select-label-site"
                            id="simple-select-site"
                            value={site}
                            label="Site"
                            onChange={(e) => setSite(e.target.value)}
                        >
                            <MenuItem value="spain">Spain</MenuItem>
                            <MenuItem value="europe">Europe</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="simple-select-label-weeks">
                            Weeks
                        </InputLabel>
                        <Select
                            labelId="simple-select-label-weeks"
                            id="simple-select-weeks"
                            value={weeks}
                            label="Weeks"
                            onChange={(e) => setWeeks(e.target.value)}
                        >
                            <MenuItem value={18}>18 Weeks</MenuItem>
                            <MenuItem value={16}>16 Weeks</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="simple-select-label-schedule">
                            Schedule
                        </InputLabel>
                        <Select
                            labelId="simple-select-label-schedule"
                            id="simple-select-schedule"
                            value={schedule}
                            label="Schedule"
                            onChange={(e) => setSchedule(e.target.value)}
                        >
                            <MenuItem value={"mwf"}>
                                Monday-Wednesday-Friday
                            </MenuItem>
                            <MenuItem value={"tts"}>
                                Tuesday-Thursday-Saturday
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={"en"}
                    >
                        <DatePicker
                            label="Pick the start day of the cohort"
                            value={dateBase}
                            onChange={(newDate) => {
                                setDateBase(dayjs(newDate));
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <InputLabel id="simple-select-label-additional-days">
                            Additional Days
                        </InputLabel>
                        <Select
                            labelId="simple-select-label-additional-days"
                            id="simple-select-additional-days"
                            value={additionalDays}
                            label="Additional Days"
                            onChange={(e) => setAdditionalDays(e.target.value)}
                        >
                            <MenuItem value={0}>0 Additional Day</MenuItem>
                            <MenuItem value={1}>1 Additional Day</MenuItem>
                            <MenuItem value={2}>2 Additional Days</MenuItem>
                            <MenuItem value={3}>3 Additional Days</MenuItem>
                            <MenuItem value={4}>4 Additional Days</MenuItem>
                            <MenuItem value={5}>5 Additional Days</MenuItem>
                            <MenuItem value={6}>6 Additional Days</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={12} display="flex" justifyContent="center">
                    <TableContainer sx={{ maxWidth: 500 }} component={Paper}>
                        <Table
                            sx={{ maxWidth: 500 }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Action</StyledTableCell>
                                    <StyledTableCell align="right">
                                        Suggest Day
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dates.map((date) => (
                                    <StyledTableRow key={date.action}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {date.action}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {date.suggestDay.format(format)}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item sm={12} display="flex" justifyContent="center">
                    <PDF
                        PDFDocument={ () => {
                            return (
                                <div>
                                    Hola
                                </div>
                            );
                        }}
                    />
                    <TableModulesByWeeks modulesByWeeks={modulesByWeeks} format={format}/>
                    {/* <PDFViewer>
                        <TableModulesByWeeks modulesByWeeks={modulesByWeeks} format={format}/>
                    </PDFViewer> */}
                </Grid>

                <Grid item sm={12}>
                    <p>Made by Ehiber Graterol with love {"<3"}!</p>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;

TableModulesByWeeks.propTypes = {
	modulesByWeeks: PropTypes.array.isRequired,
    format: PropTypes.string.isRequired
};

PDF.propTypes = {
    PDFDocument: PropTypes.node.isRequired
};