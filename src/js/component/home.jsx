import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
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
import rigoImage from "../../img/rigo-baby.jpg";
import { Container, Grid } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0
    }
}));

function createData(action, suggestDay) {
    return { action, suggestDay };
}

//create your first component
const Home = () => {
    const [site, setSite] = useState("spain");
    const [weeks, setWeeks] = useState(16);
    const [schedule, setSchedule] = useState("mwf");
    const [dateBase, setDateBase] = useState(dayjs());
    const [dates, setDates] = useState([]);
    const [breakClasses, setBreakClasses] = useState({
        initial: dayjs("12/16/22"),
        ended: dayjs("01/03/23")
    });
    const holidays = {
        spain: holidaysSpain,
        europe: []
    };
    const format = "DD/MM/YYYY";

    useEffect(() => {
        if(!dateBase.isSame(dayjs(),'day')){
            suggestingActionDates();
        }
    }, [dateBase]);

    const suggestingActionDates = () => {
        const daysCourse = weeks * 3;
        const scheduleDays = schedule === "mwf" ? [1, 3, 5] : [2, 4, 6];
        const diffBreakClasses = breakClasses.ended.diff(
            breakClasses.initial,
            "days"
        );
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
        while (day < daysCourse) {
            currentDate = currentDate.add(1, "day");
            if (currentDate.isSame(breakClasses.initial,'day')) {
                currentDate = currentDate.add(diffBreakClasses, "day");
            }
            if (holidays[site].includes(currentDate.format(format))) {
                currentDate = currentDate.add(1, "day");
            }
            if (scheduleDays.includes(currentDate.day())) {
                day++;
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

        setDates(suggestDays);
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
                        adapterLocale={"fr"}
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

                <Grid item sm={12}>
                    <p>Made by Ehiber Graterol with love {"<3"}!</p>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
