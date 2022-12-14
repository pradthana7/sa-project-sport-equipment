import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SportEuqipmentTypeInterface } from "../model/ISport_Equipment_Type";
import { SportTypeInterface } from "../model/ISport_Type";
import { SportEquipmentInterface } from "../model/ISport_Equipment";
import { Link as RouterLink } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { StaffInterface } from "../model/IStaff";
import Snackbar from "@mui/material/Snackbar";
import { GetStaffByID } from "../services/HttpClientService";
import StaffBar from "../component/StaffBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from "../component/Home";

const Theme = createTheme({
  palette: {
    primary: {
      main: '#323232',
    },
    secondary: {
      main: '#FF8B8B',
    },
  },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CreateSportEquipment() {
  /////////////////////////////////// COMBOBOX /////////////////////////////////////
  const [sportequipmenttype, setSportEquipmentype] = useState<SportEuqipmentTypeInterface[]>([]);
  const [sporttype, setSportType] = useState<SportTypeInterface[]>([]);
  const [staff, setStaff] = useState<StaffInterface>();
  const [sportequipment, setSportEquipment] = useState<Partial<SportEquipmentInterface>>({});

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = "http://localhost:8080";
  const requestOptionsGet = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const feachSportEquipmentType = async () => {
    fetch(`${apiUrl}/sport_equipment_type`, requestOptionsGet)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.data);
        setSportEquipmentype(result.data);
      });
  };

  const fetchSportType = async () => {
    fetch(`${apiUrl}/sport_type`, requestOptionsGet)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.data);
        setSportType(result.data);
      });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof sportequipment;
    setSportEquipment({
      ...sportequipment,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof CreateSportEquipment;
    const { value } = event.target;
    console.log(id, value);
    // ??????????????????????????? ????????? staff ???????????? sportequipment
    setSportEquipment({ ...sportequipment, [id]: value });
  };

  const fetchStaffByID = async () => {
    let res = await GetStaffByID();
    sportequipment.StaffID = res.ID;
    if (res) {
      setStaff(res);
      console.log(res);
    }
  };
  // console.log(typeof sportequipment.StaffID);

  // ???????????????????????? feach
  useEffect(() => {
    feachSportEquipmentType();
    fetchSportType();
    fetchStaffByID();
  }, []);

  console.log(sportequipment);

  // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    // ?????????????????????????????????????????????????????????
    let data = {
      StaffID: convertType(sportequipment.StaffID),
      SportTypeID: convertType(sportequipment.Sport_TypeID),
      SportEquipmentTypeID: convertType(sportequipment.Sport_Equipment_TypeID),
      Sport_Equipment_Name: sportequipment.Sport_Equipment_Name,
      Sport_Equipment_Amount: convertType(sportequipment.Sport_Equipment_Amount),

      // StaffID: 1,
      // SportTypeID: 1,
      // SportEquipmentTypeID: 1,
      // Sport_Equipment_Name: "testttt",
      // Sport_Equipment_Amount: 1000,
    };

    console.log("data", data);

    const requestOptions = {
      // method: "POST",
      // headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(data),
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/Create_Sports_Equipment`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          setSuccess(true);
          window.location.href = "/sport_equipment_data";
        } else {
          setError(true);
        }
      });
    // console.log(sportequipment.StaffID);
  }

  const [token, setToken] = useState<String>("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {

    return <Home />;
  }

  return (
    <div>
      <ThemeProvider theme={Theme}>
       <StaffBar/>
    <div />

      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleClose} severity="success">
              ??????????????????????????????????????????????????????
            </Alert>
          </Snackbar>

          <Snackbar
            open={error}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleClose} severity="error">
              ???????????????????????????????????????????????????????????????
            </Alert>
          </Snackbar>
        </Box>
        <Paper>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                  m: 1,
                  width: 1,
                  height: 50,
                },
              }}
            >
              <h2>?????????????????????????????????????????????????????????????????????????????????</h2>
            </Box>
            <hr />
            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid item xs={12}>
                <p>???????????????????????????????????????????????????</p>
                <Select
                  fullWidth
                  id="SportEquipmentType"
                  onChange={handleChange}
                  native
                  value={sportequipment.Sport_Equipment_TypeID + ""}
                  inputProps={{ name: "Sport_Equipment_TypeID" }}
                >
                  <option aria-label="None" value="">
                    ?????????????????????????????????????????????????????????????????????????????????
                  </option>
                  {sportequipmenttype.map((item) => (
                    <option key={item.ID} value={item.ID}>
                      {item.SPORT_EQUIPMENT_TYPE_Name}
                    </option>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <p>??????????????????????????????</p>
                <Select
                  fullWidth
                  id="SportType"
                  onChange={handleChange}
                  native
                  value={sportequipment.Sport_TypeID + ""}
                  inputProps={{ name: "Sport_TypeID" }}
                >
                  <option aria-label="None" value="">
                    ????????????????????????????????????????????????????????????
                  </option>
                  {sporttype.map((item) => (
                    <option key={item.ID} value={item.ID}>
                      {item.Sport_Type_Name}
                    </option>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <p>?????????????????????????????????????????????</p>
                <TextField
                  fullWidth
                  id="Sport_Equipment_Name" // ?????????????????????????????????????????????????????? json (?????????????????????)
                  label="?????????????????????????????????????????????"
                  variant="outlined"
                  value={sportequipment.Sport_Equipment_Name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <p>????????????????????????????????????</p>
                <TextField
                  fullWidth
                  id="Sport_Equipment_Amount" // ?????????????????????????????????????????????????????? json (?????????????????????)
                  type="Number"
                  InputProps={{ inputProps: { min: 0, max: 20000 } }}
                  label="????????????????????????????????????"
                  variant="outlined"
                  value={sportequipment.Sport_Equipment_Amount}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component={RouterLink}
                  to="/sport_equipment_data"
                  variant="contained"
                  color="secondary"
                >
                  BACK
                </Button>

                <Button
                  onClick={submit}
                  variant="contained"
                  color="primary"
                  sx={{ float: "right" }}
                >
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      </ThemeProvider>
    </div>
  );
}

export default CreateSportEquipment;
