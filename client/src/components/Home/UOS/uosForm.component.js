import React, { Component } from "react";
import { Grid, Button, Dialog, TextField } from "@mui/material";
import UOSDataService from "../../../services/uos.service";

export default class UOSForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      formValues: {
        code: "",
        name: "",
        goal_mark: 0,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      ...this.state,
      formValues: {
        ...this.state.formValues,
        [event.target.name]: isNaN(parseInt(event.target.value))
          ? event.target.value
          : parseInt(event.target.value),
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    UOSDataService.create(this.state.formValues, this.props.semID).then((response) => {
      this.setState(
        {
          openDialog: false,
        },
        window.location.reload()
      );
    });
  }

  render() {
    let marginSx = { margin: "1%" };
    return (
      <Grid item xs={12} container>
        <Grid item xs={3} sx={{ padding: "10px" }}>
          <Button
            variant="contained"
            onClick={() => this.setState({ openDialog: true })}
          >
            Add UOS
          </Button>
        </Grid>
        <Dialog fullScreen open={this.state.openDialog}>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Add Unit of Study</h1>
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  fullWidth
                  required
                  name="code"
                  label="UOS Code"
                  value={this.state.formValues.code}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  fullWidth
                  required
                  name="name"
                  label="UOS Name"
                  value={this.state.formValues.name}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <TextField
                  type="number"
                  required
                  name="goal_mark"
                  label="Goal Mark"
                  value={this.state.formValues.goal_mark}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={9} sx={marginSx}>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Dialog>
      </Grid>
    );
  }
}
