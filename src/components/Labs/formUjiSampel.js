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
import dateFnsFormat from 'date-fns/format';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';

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
          <Typography variant="h5" gutterBottom>
            Admin Lab Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.ADMINLAB_DETAIL} component={SampelDetail} />
            <Route exact path={ROUTES.ADMINLAB} component={SampelAll} />
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
        .orderByChild('flagActivity')
        .equalTo('Submit sampel ke admin lab')
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
                flagActivity: el.val().flagActivity,
                // zItems: el.val().zItems,
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

    handleSubmitKeAnalysis = propSample => {
      this.props.firebase.db.ref('samples/' + propSample).update({
        flagActivity: 'Submit sampel ke admin lab'
      })
    }

    render() {
      const { items, loading } = this.state;
      return (
        <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> : 
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kode Unik Sampel</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal Tujuan Sampel</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) => 
                  <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.kodeUnikSampel}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>
                          <Button component={Link} 
                              to={{
                                pathname: `${ROUTES.ADMINLAB}/${el.idPermohonanUji}`,
                                data: { el },
                              }}
                            >
                              Detail
                          </Button>
                        </TableCell>
                        {/* <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeAnalysis(el.idPermohonanUji)}
                            // disabled={el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Teruskan ke petugas analysis
                          </Button>
                        </TableCell> */}
                      </TableRow>
                  </TableBody>
                  )}
                </Table>
              </div>
            }
          </div>
        )}
        </AuthUserContext.Consumer>
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
      open2: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      ruangLingkupSampel: '',
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      tanggalTerimaSampelAdminLab: new Date(),
      PenerimaSampelAdminLab: '',
      ManajerTeknisAdminLab: '',
      ManajerAdministrasiAdminLab: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
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
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
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
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
        // kodeUnikSampel: this.state.kodeUnikSampel,
        // tanggalMasukSampel: this.state.tanggalMasukSampel,
        // nomorAgendaSurat: this.state.nomorAgendaSurat,
        // namaPemilikSampel: this.state.namaPemilikSampel,
        // alamatPemilikSampel: this.state.alamatPemilikSampel,
        // asalTujuanSampel: this.state.asalTujuanSampel,
        // petugasPengambilSampel: this.state.petugasPengambilSampel,
        flagActivity: 'Permohonan pengujian diteruskan ke analis',
        tanggalTerimaSampelAdminLab: this.state.tanggalTerimaSampelAdminLab,
        PenerimaSampelAdminLab: this.state.PenerimaSampelAdminLab,
        ManajerTeknisAdminLab: this.state.ManajerTeknisAdminLab,
        ManajerAdministrasiAdminLab: this.state.ManajerAdministrasiAdminLab,  
      })
  }

  handleDateChange = date => {
    this.setState({ tanggalTerimaSampelAdminLab: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { 
      // kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      // namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      // jenisSampel, jumlahSampel, kondisiSampel, jenisPengujianSampel, ruangLingkupSampel,
      loading, items,
      tanggalTerimaSampelAdminLab, PenerimaSampelAdminLab, ManajerTeknisAdminLab, ManajerAdministrasiAdminLab
      // selectJenisPengujian, selectMetodePengujian,
     } = this.state;
    const isInvalid = tanggalTerimaSampelAdminLab === '' || PenerimaSampelAdminLab === '' || ManajerTeknisAdminLab === '' ||
      ManajerAdministrasiAdminLab === '';

    return (
      <div>
        {loading ? <Typography>Loading...</Typography> : 
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Proses Sampel
            </Button>{' '}
            <Button component={Link}
                to={{
                  pathname: `${ROUTES.ADMINLAB}`,
                }}
              >
                BACK
            </Button>
            {!loading && items.map((el, key) => 
              <div style={{marginTop:25}} key={key}>
                <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sample : {dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Agenda Sample : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sample : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sample : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal Tujuan Sample : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Penerima Sample : {el.petugasPengambilSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Jenis Pengujian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) => 
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jenisPengujianSampel}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  </Table>
              </div>
            )}
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
              >
              <DialogTitle id="form-dialog-title">Proses Terima Sampel oleh Admin Lab</DialogTitle>
              <DialogContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{width: 350}}
                    label="Tanggal Terima Sampel oleh Admin Lab" 
                    value={tanggalTerimaSampelAdminLab} 
                    format={'MM/dd/yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="PenerimaSampelAdminLab">Petugas Penerima Sampel</InputLabel>{" "}
                  <Select
                    value={PenerimaSampelAdminLab}
                    onChange={this.onChange('PenerimaSampelAdminLab')}
                    style={{width:400}}
                    name="PenerimaSampelAdminLab"
                  >
                    <MenuItem value="AdminLab1">Admin Lab1</MenuItem>
                    <MenuItem value="AdminLab2">Admin Lab2</MenuItem>            
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="ManajerTeknisAdminLab">Manajer Teknis</InputLabel>{" "}
                  <Select
                    value={ManajerTeknisAdminLab}
                    onChange={this.onChange('ManajerTeknisAdminLab')}
                    style={{width:400}}
                    name="ManajerTeknisAdminLab"
                  >
                    <MenuItem value="ManajerTeknis1">Manajer Teknis1</MenuItem>
                    <MenuItem value="ManajerTeknis2">Manajer Teknis2</MenuItem>            
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="ManajerAdministrasiAdminLab">Manajer Administrasi</InputLabel>{" "}
                  <Select
                    value={ManajerAdministrasiAdminLab}
                    onChange={this.onChange('ManajerAdministrasiAdminLab')}
                    style={{width:400}}
                    name="ManajerAdministrasiAdminLab"
                  >
                    <MenuItem value="ManajerAdministrasi1">Manajer Administrasi1</MenuItem>
                    <MenuItem value="ManajerAdministrasi2">Manajer Administrasi2</MenuItem>            
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button 
                  variant="outlined"
                  onClick={this.handleSubmit} 
                  disabled={isInvalid} 
                  color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
      </div>
    )
  }

}


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);