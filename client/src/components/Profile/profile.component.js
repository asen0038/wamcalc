import React, { Component } from "react";
import { Grid } from "@mui/material";
import AuthService from "../../services/auth.service";
import SemesterDataService from "../../services/semester.service";
import WAMDataService from "../../services/wam.service";
import UOS from "../Home/UOS/uos.component";
import ProfileWAMTable from "./table.component";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
      lastSemester: undefined,
      lastCalculatedWAM: undefined,
    };
  }

  fetchSemestersUnits() {
    if (this.state.currentUser) {
      SemesterDataService.getAll(this.state.currentUser.username).then(
        (response) => {
          let semesters = response.data;
          let lastSemester = undefined;

          if (semesters) {
            semesters
              .slice()
              .reverse()
              .forEach((semester) => {
                if (!semester.current) {
                  lastSemester = semester;
                }
              });
          }

          this.setState({
            lastSemester: lastSemester,
          });
        }
      );
    }
  }

  fetchAllWAMs() {
    WAMDataService.getAll(this.state.currentUser.username).then((response) => {
      let wams = response.data;

      if (wams) {
        this.setState({
          lastCalculatedWAM: wams[wams.length - 1],
        });
      }
    });
  }

  fetchData() {
    this.fetchSemestersUnits();
    this.fetchAllWAMs();
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    this.setState(
      {
        currentUser: user,
      },
      this.fetchData
    );
  }

  render() {
    if (this.state.currentUser) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1>{this.state.currentUser.username}</h1>
          </Grid>
          <Grid item xs={12}>
            <h6>{this.state.currentUser.email}</h6>
          </Grid>
          {this.state.lastCalculatedWAM ? (
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <h3>Last Calculated WAM:</h3>
              </Grid>
              <Grid item xs={12}>
                <ProfileWAMTable wam={this.state.lastCalculatedWAM} />
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {this.state.lastSemester ? (
            <Grid item xs={12} container>
              <Grid item xs={12}>
                <h3>Last Semester Record ({this.state.lastSemester.name}):</h3>
              </Grid>
              {this.state.lastSemester.uosList.map((uos) => (
                <Grid item key={uos.id} xs={3} sx={{ padding: "10px" }}>
                  <UOS uos={uos} editMode={false} />
                </Grid>
              ))}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      );
    }
  }
}
