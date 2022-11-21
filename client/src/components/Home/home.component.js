import React, { Component } from "react";
import { Grid, Button, TextField, Dialog } from "@mui/material";
import SemesterDataService from "../../services/semester.service";
import AuthService from "../../services/auth.service";
import UOSDataService from "../../services/uos.service";
import UOSForm from "./UOS/uosForm.component";
import UOS from "./UOS/uos.component";
import { finalMarkRequired } from "./UOS/util";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
      currentSemester: undefined,
      semesterName: "",
      semesterValid: false,
      openDialog: false,
      uosMarkValues: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    this.setState(
      {
        currentUser: user,
      },
      this.fetchSemesters
    );
  }

  fetchSemesters() {
    if (this.state.currentUser) {
      SemesterDataService.getAll(this.state.currentUser.username).then(
        (response) => {
          let semesters = response.data;
          if (semesters) {
            semesters.forEach((semester) => {
              if (semester.current) {
                this.setState(
                  {
                    currentSemester: semester,
                  },
                  this.setUOSMarks
                );
              }
            });
          }
        }
      );
    }
  }

  handleSemesterNameChange(event) {
    this.setState({
      semesterName: event.target.value,
      semesterValid: event.target.value ? true : false,
    });
  }

  createSemesterButton() {
    if (this.state.semesterValid) {
      SemesterDataService.create(
        { name: this.state.semesterName },
        this.state.currentUser.username
      ).then((response) => {
        this.setState({
          currentSemester: response.data,
        });
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    // Update overall marks for all units
    this.state.currentSemester.uosList.forEach((uos) => {
      let uos_data = uos;
      uos_data.overall_mark = parseFloat(
        this.state.uosMarkValues[`${uos.code}`]
      );
      uos_data.final_mark = parseFloat(
        finalMarkRequired(uos.assessmentList, uos_data.overall_mark)
      );
      UOSDataService.update(uos.id, uos_data);
    });

    // End current semester
    let curr_sem = this.state.currentSemester;
    curr_sem.current = false;
    SemesterDataService.update(curr_sem.id, curr_sem).then(() => {
      window.location.reload();
    });
  }

  setUOSMarks() {
    // Initialize the End Semester Dialog states
    let uosMarks = {};

    this.state.currentSemester.uosList.forEach((uos) => {
      uosMarks[uos.code] = 0;
    });

    this.setState({
      ...this.state,
      uosMarkValues: uosMarks,
    });
  }

  handleInputChange(event) {
    this.setState({
      ...this.state,
      uosMarkValues: {
        ...this.state.uosMarkValues,
        [event.target.name]: event.target.value,
      },
    });
  }

  render() {
    let marginSx = { margin: "1%" };
    if (this.state.currentUser) {
      if (this.state.currentSemester) {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Current Semester ({this.state.currentSemester.name})</h1>
            </Grid>
            <UOSForm semID={this.state.currentSemester.id} />
            <Grid item xs={12} container>
              {this.state.currentSemester.uosList.map((uos) => (
                <Grid item key={uos.id} xs={3} sx={{ padding: "10px" }}>
                  <UOS uos={uos} editMode={true} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3} sx={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "black",
                    color: "white",
                  }}
                  onClick={() => this.setState({ openDialog: true })}
                >
                  End Semester
                </Button>
              </Grid>
            </Grid>
            <Dialog fullScreen open={this.state.openDialog}>
              <form onSubmit={this.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <h1>End Semester: {this.state.currentSemester.name}</h1>
                  </Grid>
                  <Grid item xs={12}>
                    <h6>
                      Optional: Enter the overall mark received in each of these
                      units. This will be used to calculate the mark you
                      received in your final and also how far off you were from
                      your goal.
                    </h6>
                  </Grid>
                  {this.state.currentSemester.uosList.map((uos) => (
                    <Grid item xs={9} sx={marginSx} key={uos.id}>
                      <TextField
                        type="number"
                        name={uos.code}
                        label={uos.code}
                        value={this.state.uosMarkValues[`${uos.code}`]}
                        onChange={this.handleInputChange}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={9} sx={marginSx}>
                    <Button variant="contained" type="submit">
                      Confirm
                    </Button>
                  </Grid>
                  <Grid item xs={9} sx={marginSx}>
                    <Button
                      variant="contained"
                      sx={{
                        background: "black",
                        color: "white",
                      }}
                      onClick={() =>
                        this.setState({
                          openDialog: false,
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Dialog>
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Welcome</h1>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={9} sx={{ padding: "10px" }}>
                <TextField
                  fullWidth
                  required
                  error={!this.state.semesterValid}
                  label="Semester Name"
                  value={this.state.semesterName}
                  onChange={(e) => this.handleSemesterNameChange(e)}
                />
              </Grid>
              <Grid item xs={3} sx={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  onClick={this.createSemesterButton.bind(this)}
                  sx={{
                    background: "black",
                    color: "white",
                  }}
                >
                  Start Semester
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      }
    } else {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1>Welcome</h1>
          </Grid>
          <Grid item xs={12}>
            <h5>Please Login!</h5>
          </Grid>
        </Grid>
      );
    }
  }
}
