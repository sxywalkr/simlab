import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
// import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
// import {format, compareAsc} from 'date-fns/esm'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';


class MainSampleBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  render() {
    return (
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        <Paper style={{padding: 10}}>
          {/* <Typography variant="h5" gutterBottom>
            Master Data - Wilker 
          </Typography> */}
          <Switch>
            <Route exact path={ROUTES.WILKER_FORMUJIADD} component={SampelAdd} />
            <Route exact path={ROUTES.WILKER_FORMUJIDETAIL} component={SampelDetail} />
            <Route exact path={ROUTES.WILKER_FORMUJI} component={SampelAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}


///////////////////////////// VIEW ALL DATA
class SampelAllBase extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        items: [],
        open: false,
        formMode: [],
        }; 
    }

    componentDidMount() {
      this.setState({ loading: true });
      this.props.firebase.db.ref('samples')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idPermohonanUji: el.val().idPermohonanUji,
                kodeUnikSampel: el.val().kodeUnikSampel,
                tanggalMasukSampel: el.val().tanggalMasukSampel,
                nomorAgendaSurat: el.val().nomorAgendaSurat,
                namaPemilikSampel: el.val().namaPemilikSampel,
                alamatPemilikSampel: el.val().alamatPemilikSampel,
                asalTujuanSampel: el.val().asalTujuanSampel,
                petugasPengambilSampel: el.val().petugasPengambilSampel,
              })
            });
            this.setState({ 
              items: a,
              loading: false,
            });
          } else {
            this.setState({ items: null, loading: false });
          }
      })
    }

    componentWillUnmount() {
      this.props.firebase.db.ref('samples').off();
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('samples/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <AuthUserContext.Consumer>
        {authUser => (

          <div>
            <Button variant="outlined" color="primary" 
              component={Link} to={{
                pathname: `${ROUTES.WILKER_FORMUJIADD}`,
                data: {authUser}
              }}
            >
              Tambah Data
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kode Unik Sampel</TableCell>
                  <TableCell>Tanggal Masuk Sampel</TableCell>
                  <TableCell>Nama Pemilik Sampel</TableCell>
                  <TableCell>Asal Tujuan Sampel</TableCell>
                  <TableCell colSpan={2}>Action</TableCell>
                  {/* <TableCell>Hapus</TableCell> */}
                </TableRow>
              </TableHead>
              {!loading && !!items && items.map((el, key) => 
              <TableBody key={key}>
                  <TableRow>
                    <TableCell>{el.kodeUnikSampel}</TableCell>
                    <TableCell>{el.tanggalMasukSampel}</TableCell>
                    <TableCell>{el.namaPemilikSampel}</TableCell>
                    <TableCell>{el.asalTujuanSampel}</TableCell>
                    <TableCell>
                      <Button component={Link} 
                          to={{
                            pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                            data: { el },
                          }}
                        >
                          Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idPermohonanUji)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
              </TableBody>
              )}
            </Table>
          </div>
        )}
        </AuthUserContext.Consumer>
      )
    }

}

///////////////////////////// ADD DATA
class SampelAddBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: new Date(),
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    
    this.props.firebase.db.ref('masterData/wilker')
      .orderByChild('kodeWilker')
      .equalTo(this.props.location.data.authUser.area)
      .on('value', snap => {
        // console.log(snap.val());
          const a = [];
          // a.push(snap.val());
          snap.forEach(el => {
            a.push({
              idWilker: el.val().idWilker,
              countSampelWilker: el.val().countSampelWilker,
            })
          })
          this.setState({ 
            items: a,
            loading: false,
            // idPermohonanUji: snap.val().idPermohonanUji,
            // kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: new Date(),
            // nomorAgendaSurat: snap.val().nomorAgendaSurat,
            // namaPemilikSampel: snap.val().namaPemilikSampel,
            // alamatPemilikSampel: snap.val().alamatPemilikSampel,
            // asalTujuanSampel: snap.val().asalTujuanSampel,
            // petugasPengambilSampel: snap.val().petugasPengambilSampel,
          });
    })
  
  }

  componentWillUnmount() {
    // this.props.firebase.db.ref('samples').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    const a = this.props.firebase.db.ref('samples').push();
    this.props.firebase.db.ref('samples/' + a.key ).update({
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        nomorAgendaSurat: this.state.nomorAgendaSurat,
        namaPemilikSampel: this.state.namaPemilikSampel,
        alamatPemilikSampel: this.state.alamatPemilikSampel,
        asalTujuanSampel: this.state.asalTujuanSampel,
        petugasPengambilSampel: this.state.petugasPengambilSampel,
      })
  }

  handleDateChange = date => {
    this.setState({ tanggalMasukSampel: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
     } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '';
    return (
      <div>
          <Typography variant="h5" gutterBottom>Tambah Sample</Typography>
          <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
          </Button>
            <div>
              <TextField
                autoFocus
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  style={{width: 250}}
                  label="Tanggal Masuk Sampel" 
                  value={tanggalMasukSampel} 
                  format={'MM/dd/yyyy'}
                  onChange={this.handleDateChange} />
              </MuiPickersUtilsProvider>
              <TextField
                margin="dense"
                id="nomorAgendaSurat"
                label="Nomor Agenda Surat"
                value={nomorAgendaSurat}
                onChange={this.onChange('nomorAgendaSurat')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="namaPemilikSampel"
                label="Nama Pemilik Sampel"
                value={namaPemilikSampel}
                onChange={this.onChange('namaPemilikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="alamatPemilikSampel"
                label="Alamat Pemilik Sampel"
                value={alamatPemilikSampel}
                onChange={this.onChange('alamatPemilikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="asalTujuanSampel"
                label="Asal Tujuan Sampel"
                value={asalTujuanSampel}
                onChange={this.onChange('asalTujuanSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />
              <Button onClick={this.handleSubmit} 
                disabled={isInvalid} 
                color="primary">
                Submit
              </Button>
          </div>
      </div>
    )
  }

}

///////////////////////////// UBAH DATA
class SampelDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      // nomorAgendaSurat: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idPermohonanUji: snap.val().idPermohonanUji,
            kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        // nomorAgendaSurat: this.state.nomorAgendaSurat,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, kodeUnikSampel, tanggalMasukSampel, items } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - Wilker
          </Button>{' '}
          <Button>
            <Link 
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
            </Link>
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kode Unik Sampel</TableCell>
                <TableCell>Tanggal Masuk Sampel</TableCell>
                <TableCell>Nomor Agenda Surat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kodeUnikSampel}</TableCell>
                  <TableCell>{el.tanggalMasukSampel}</TableCell>
                  <TableCell>{el.nomorAgendaSurat}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Master Data - Pengujian</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data - Wilker
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="tanggalMasukSampel"
                label="Tanggal Masuk Sampel"
                value={ tanggalMasukSampel }
                onChange={this.onChange('tanggalMasukSampel')}
                fullWidth
              />
              {/* <TextField
                margin="dense"
                // id="nomorAgendaSurat"
                label="Nomor Agenda Surat"
                // value={nomorAgendaSurat}
                // onChange={this.onChange('nomorAgendaSurat')}
                fullWidth
              /> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} 
                disabled={isInvalid} 
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    )
  }

}


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);
const SampelAdd = withFirebase(SampelAddBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);