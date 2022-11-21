import React, { Component } from "react";
import { Grid } from "@mui/material";

export default class About extends Component {
  render() {
        return (
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
                    <Grid item xs={3}>
                      <h1>About us</h1>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                      <h2>What we provide</h2>
                      <h5>1. Record your Score for convenient review</h5>
                      <h5>2. Calculate Score of your final according to Overall mark</h5>
                      <h5>3. Provide overview of your progress in each semester</h5>
                      <h5>4. Set a Goal mark and we provide the required Score of your final</h5>
                      <h5>5. Calculate different types of WAM by simply uploading you transcript PDF.</h5>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                      <h2>Our team</h2>
                      <h5>Aditya Sengupta</h5>
                      <h5>Aryan Bhatia</h5>
                      <h5>Chang Zhao</h5>
                      <h5>Hetush Gupta</h5>
                      <h5>Kuan Li</h5>
                    </ Grid>
                </ Grid>
        );
  }
 }