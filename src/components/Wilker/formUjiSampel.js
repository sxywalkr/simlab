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
// import DialogContentText from '@material-ui/core/DialogContentText';
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
                flagActivity: el.val().flagActivity,
                flagStatusProses: el.val().flagStatusProses,
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

    handleSubmitKeLab = propSample => {
      this.props.firebase.db.ref('samples/' + propSample).update({
        flagActivity: 'Submit sampel ke admin lab',
        flagStatusProses: 'Sampel di Admin Lab',
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
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={3}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) => 
                  <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.kodeUnikSampel}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{ el.flagActivity === 'Permohonan pengujian selesai di analisa' ? el.flagActivity : el.flagStatusProses }</TableCell>
                        <TableCell>
                          <Button component={Link} 
                              to={{
                                pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                                data: { el },
                              }}
                              disabled={el.flagActivity === "Belum ada sampel uji" || el.flagActivity === "Data sudah lengkap" ? false : true}
                            >
                              Detail
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idPermohonanUji)}
                            disabled={el.flagActivity === "Belum ada sampel uji" || el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Hapus
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeLab(el.idPermohonanUji)}
                            disabled={el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Submit ke Lab
                          </Button>
                        </TableCell>
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
          const a = [];
          // a.push(snap.val());
          snap.forEach(el => {
            a.push({
              idWilker: el.val().idWilker,
              countSampelWilker: el.val().countSampelWilker,
              kodeWilker: el.val().kodeWilker,
            })
          })
          this.setState({ 
            items: a,
            loading: false,
            kodeUnikSampel: a[0].kodeWilker + 
              ('00000' + (parseInt(a[0].countSampelWilker, 10) + 1)).slice(-5),
            tanggalMasukSampel: new Date(),
            petugasPengambilSampel: this.props.location.data.authUser.username,
          });
    })
  
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/wilker').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    // this.setState({ open: false });
    // console.log(this.state.items[0]);
    const a = this.props.firebase.db.ref('samples').push();
    this.props.firebase.db.ref('samples/' + a.key ).update({
        idPermohonanUji: a.key,
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        nomorAgendaSurat: this.state.nomorAgendaSurat,
        namaPemilikSampel: this.state.namaPemilikSampel,
        alamatPemilikSampel: this.state.alamatPemilikSampel,
        asalTujuanSampel: this.state.asalTujuanSampel,
        petugasPengambilSampel: this.state.petugasPengambilSampel,
        flagActivity: 'Belum ada sampel uji',
        flagStatusProses: 'Sampel di Wilker',
      })
    this.props.firebase.db.ref('masterData/wilker/' + this.state.items[0].idWilker).update({
      countSampelWilker: parseInt(this.state.items[0].countSampelWilker, 10) + 1,
    })
    this.props.history.push('/wilker-formuji');
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
      loading,
     } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    return (
      <div>
        {loading ? <Typography>Loading...</Typography> : 
          <div>
            <Button component={Link}
                to={{
                  pathname: `${ROUTES.WILKER_FORMUJI}`,
                }}
              >
                BACK
            </Button>
            <Typography variant="h5" gutterBottom>Tambah Sample</Typography>
            <div>
              <TextField
                disabled
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
                autoFocus
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
                disabled
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />
              <Button style={{marginTop:15}} variant="outlined" onClick={this.handleSubmit} 
                disabled={isInvalid} 
                color="primary">
                Submit
              </Button>
              
            </div>
          </div>
        }
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
      kategoriSample: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      metodePengujianSampel: '',
      ruangLingkupSampel: '',
      targetPengujianSampel: '',
      selectJenisSampel: [],
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      selectTargetPengujian: [],
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        // console.log(snap.val());
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
    this.props.firebase.db.ref('masterData').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        nomorAgendaSurat: this.state.nomorAgendaSurat,
        namaPemilikSampel: this.state.namaPemilikSampel,
        alamatPemilikSampel: this.state.alamatPemilikSampel,
        asalTujuanSampel: this.state.asalTujuanSampel,
        petugasPengambilSampel: this.state.petugasPengambilSampel,
      })
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    const a = this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems').push();
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key).update({
      idZItems: a.key,
      kategoriSample: this.state.kategoriSample,
      jenisSampel: this.state.jenisSampel,
      jumlahSampel: this.state.jumlahSampel,
      kondisiSampel: this.state.kondisiSampel,
      metodePengujianSampel: this.state.metodePengujianSampel,
      ruangLingkupSampel: this.state.ruangLingkupSampel,
      targetPengujianSampel: this.state.targetPengujianSampel,
    })
    const b = this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/').push();
    const bahanTerpakaiUrl = 'bahanTerpakai/' + a.key;
    if ( this.state.metodePengujianSampel === 'ELISA RABIES' || this.state.metodePengujianSampel === 'ELISA BVD' || this.state.metodePengujianSampel === 'ELISA PARATB') {
      if (parseInt(this.state.jumlahSampel, 10) <= 8 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '72', PBS_TWEEN: '8', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '3,2', STOP_SOLUTION: '3,2', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '72', PBS_TWEEN: '8', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '3,2', STOP_SOLUTION: '3,2', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) > 8 && parseInt(this.state.jumlahSampel, 10) <= 16 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '81', PBS_TWEEN: '9', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '4,8', STOP_SOLUTION: '4,8', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '81', PBS_TWEEN: '9', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '4,8', STOP_SOLUTION: '4,8', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) > 16 && parseInt(this.state.jumlahSampel, 10) <= 24 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '90', PBS_TWEEN: '10', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '6,4', STOP_SOLUTION: '6,4', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '90', PBS_TWEEN: '10', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '6,4', STOP_SOLUTION: '6,4', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) > 24 && parseInt(this.state.jumlahSampel, 10) <= 32 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '99', PBS_TWEEN: '11', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '8,0', STOP_SOLUTION: '8,0', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '99', PBS_TWEEN: '11', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '8,0', STOP_SOLUTION: '8,0', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) > 32 && parseInt(this.state.jumlahSampel, 10) <= 40 ) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '108', PBS_TWEEN: '12', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '9,6', STOP_SOLUTION: '9,6', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '108', PBS_TWEEN: '12', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '9,6', STOP_SOLUTION: '9,6', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) > 40 && parseInt(this.state.jumlahSampel, 10) <= 46 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '117', PBS_TWEEN: '13', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '11,2', STOP_SOLUTION: '11,2', 
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '117', PBS_TWEEN: '13', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '11,2', STOP_SOLUTION: '11,2', 
            VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
          })
      }
    } else if ( this.state.metodePengujianSampel === 'TPC' ) {
      if (parseInt(this.state.jumlahSampel, 10) === 1 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '400', BPW: '8', PCA: '3', TABUNG_REAKSI: '3', CAWAN_PETRI: '8', KERTAS_TIMBANG: '1', PLASTIK_STOMACHER: '1', PLASTIK_SAMPEL: '1', FINTIPP: '7', SCALPEL: '1', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '400', BPW: '8', PCA: '3', TABUNG_REAKSI: '3', CAWAN_PETRI: '8', KERTAS_TIMBANG: '1', PLASTIK_STOMACHER: '1', PLASTIK_SAMPEL: '1', FINTIPP: '7', SCALPEL: '1', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '800', BPW: '16', PCA: '6', TABUNG_REAKSI: '6', CAWAN_PETRI: '14', KERTAS_TIMBANG: '2', PLASTIK_STOMACHER: '2', PLASTIK_SAMPEL: '2', FINTIPP: '14', SCALPEL: '2', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '800', BPW: '16', PCA: '6', TABUNG_REAKSI: '6', CAWAN_PETRI: '14', KERTAS_TIMBANG: '2', PLASTIK_STOMACHER: '2', PLASTIK_SAMPEL: '2', FINTIPP: '14', SCALPEL: '2', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '1200', BPW: '24', PCA: '9', TABUNG_REAKSI: '9', CAWAN_PETRI: '20', KERTAS_TIMBANG: '3', PLASTIK_STOMACHER: '3', PLASTIK_SAMPEL: '3', FINTIPP: '21', SCALPEL: '3', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '1200', BPW: '24', PCA: '9', TABUNG_REAKSI: '9', CAWAN_PETRI: '20', KERTAS_TIMBANG: '3', PLASTIK_STOMACHER: '3', PLASTIK_SAMPEL: '3', FINTIPP: '21', SCALPEL: '3', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '1600', BPW: '32', PCA: '12', TABUNG_REAKSI: '12', CAWAN_PETRI: '26', KERTAS_TIMBANG: '4', PLASTIK_STOMACHER: '4', PLASTIK_SAMPEL: '4', FINTIPP: '28', SCALPEL: '4', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
        this.props.firebase.db.ref(bahanTerpakaiUrl).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '1600', BPW: '32', PCA: '12', TABUNG_REAKSI: '12', CAWAN_PETRI: '26', KERTAS_TIMBANG: '4', PLASTIK_STOMACHER: '4', PLASTIK_SAMPEL: '4', FINTIPP: '28', SCALPEL: '4', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '2000', BPW: '40', PCA: '15', TABUNG_REAKSI: '15', CAWAN_PETRI: '32', KERTAS_TIMBANG: '5', PLASTIK_STOMACHER: '5', PLASTIK_SAMPEL: '5', FINTIPP: '35', SCALPEL: '5', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '2000', BPW: '40', PCA: '15', TABUNG_REAKSI: '15', CAWAN_PETRI: '32', KERTAS_TIMBANG: '5', PLASTIK_STOMACHER: '5', PLASTIK_SAMPEL: '5', FINTIPP: '35', SCALPEL: '5', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '2400', BPW: '48', PCA: '18', TABUNG_REAKSI: '18', CAWAN_PETRI: '38', KERTAS_TIMBANG: '6', PLASTIK_STOMACHER: '6', PLASTIK_SAMPEL: '6', FINTIPP: '42', SCALPEL: '6', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '2400', BPW: '48', PCA: '18', TABUNG_REAKSI: '18', CAWAN_PETRI: '38', KERTAS_TIMBANG: '6', PLASTIK_STOMACHER: '6', PLASTIK_SAMPEL: '6', FINTIPP: '42', SCALPEL: '6', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '2800', BPW: '56', PCA: '21', TABUNG_REAKSI: '21', CAWAN_PETRI: '44', KERTAS_TIMBANG: '7', PLASTIK_STOMACHER: '7', PLASTIK_SAMPEL: '7', FINTIPP: '49', SCALPEL: '7', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '2800', BPW: '56', PCA: '21', TABUNG_REAKSI: '21', CAWAN_PETRI: '44', KERTAS_TIMBANG: '7', PLASTIK_STOMACHER: '7', PLASTIK_SAMPEL: '7', FINTIPP: '49', SCALPEL: '7', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '3200', BPW: '64', PCA: '24', TABUNG_REAKSI: '24', CAWAN_PETRI: '50', KERTAS_TIMBANG: '8', PLASTIK_STOMACHER: '8', PLASTIK_SAMPEL: '8', FINTIPP: '56', SCALPEL: '8', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '3200', BPW: '64', PCA: '24', TABUNG_REAKSI: '24', CAWAN_PETRI: '50', KERTAS_TIMBANG: '8', PLASTIK_STOMACHER: '8', PLASTIK_SAMPEL: '8', FINTIPP: '56', SCALPEL: '8', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '3600', BPW: '72', PCA: '27', TABUNG_REAKSI: '27', CAWAN_PETRI: '56', KERTAS_TIMBANG: '9', PLASTIK_STOMACHER: '9', PLASTIK_SAMPEL: '9', FINTIPP: '63', SCALPEL: '9', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '3600', BPW: '72', PCA: '27', TABUNG_REAKSI: '27', CAWAN_PETRI: '56', KERTAS_TIMBANG: '9', PLASTIK_STOMACHER: '9', PLASTIK_SAMPEL: '9', FINTIPP: '63', SCALPEL: '9', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '4000', BPW: '80', PCA: '30', TABUNG_REAKSI: '30', CAWAN_PETRI: '62', KERTAS_TIMBANG: '10', PLASTIK_STOMACHER: '10', PLASTIK_SAMPEL: '10', FINTIPP: '70', SCALPEL: '10', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '4000', BPW: '80', PCA: '30', TABUNG_REAKSI: '30', CAWAN_PETRI: '62', KERTAS_TIMBANG: '10', PLASTIK_STOMACHER: '10', PLASTIK_SAMPEL: '10', FINTIPP: '70', SCALPEL: '10', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '4400', BPW: '88', PCA: '33', TABUNG_REAKSI: '33', CAWAN_PETRI: '68', KERTAS_TIMBANG: '11', PLASTIK_STOMACHER: '11', PLASTIK_SAMPEL: '11', FINTIPP: '77', SCALPEL: '11', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '4400', BPW: '88', PCA: '33', TABUNG_REAKSI: '33', CAWAN_PETRI: '68', KERTAS_TIMBANG: '11', PLASTIK_STOMACHER: '11', PLASTIK_SAMPEL: '11', FINTIPP: '77', SCALPEL: '11', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12 ) {
        this.props.firebase.db.ref('samples/'  + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
          AQUADEST: '4800', BPW: '96', PCA: '36', TABUNG_REAKSI: '36', CAWAN_PETRI: '74', KERTAS_TIMBANG: '12', PLASTIK_STOMACHER: '12', PLASTIK_SAMPEL: '12', FINTIPP: '84', SCALPEL: '12', 
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
          this.props.firebase.db.ref(bahanTerpakaiUrl).update({
            idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, 
            AQUADEST: '4800', BPW: '96', PCA: '36', TABUNG_REAKSI: '36', CAWAN_PETRI: '74', KERTAS_TIMBANG: '12', PLASTIK_STOMACHER: '12', PLASTIK_SAMPEL: '12', FINTIPP: '84', SCALPEL: '12', 
            TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
          })
      }

    }

    this.setState({
      kategoriSample: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      metodePengujianSampel: '',
      targetPengujianSampel: '',
    });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivity: 'Data sudah lengkap',
    })
  }

  handleDelete = propSample => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + propSample ).remove();
    this.props.firebase.db.ref('bahanTerpakai/' + propSample).remove();
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if(name === 'kategoriSample') {
      this.props.firebase.db.ref('masterData/sample').orderByChild("kategoriSample").equalTo(event.target.value)
      .once("value", snap => {
        // console.log(snap.val())
        const a = [];
        a.push(snap.val());
        this.setState({
          selectJenisSampel: a[0],
        })
      })
      if ( event.target.value === 'Bahan Asal Hewan' || event.target.value === 'Hasil Bahan Asal Hewan' ) {
        this.setState({
          selectMetodePengujian: ['TPC', 'RAPID TEST KIT'],
        })
      } else if ( event.target.value === 'Ulas Darah' ) {
        this.setState({
          selectMetodePengujian: ['PEWARNAAN GIEMSA'],
        })
      } else if ( event.target.value === 'Bahan Baku Pakan Ternak' ) {
        this.setState({
          selectMetodePengujian: ['PCR-DNA', 'RT-PCR', 'FEED CHECK'],
        })
      } else if ( event.target.value === 'Swab' ) {
        this.setState({
          selectMetodePengujian: ['RT-PCR'],
        })
      }
    } else if(name === 'jenisSampel') {
      if ( event.target.value === 'Serum Darah Sapi' ) {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD', 'ELISA PARATB'],
        })
      } else if ( event.target.value === 'Serum Darah Kerbau' || event.target.value === 'Serum Darah Kambing' ) {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD'],
        })
      } else if ( event.target.value === 'Serum Darah Anjing' || event.target.value === 'Serum Darah Kucing' ) {
        this.setState({
          selectMetodePengujian: ['ELISA RABIES'],
        })
      } else if ( event.target.value === 'Serum Darah Ayam' || event.target.value === 'Serum Darah DOC' || event.target.value === 'Serum Darah Burung' ) {
        this.setState({
          selectMetodePengujian: ['HA-HI/AI-ND'],
        })
      } else if ( event.target.value === 'Sarang Burung Walet' ) {
        this.setState({
          selectMetodePengujian: ['RESIDU NITRIT'],
        })
      } else if ( event.target.value === 'Bakteri Kering' ) {
        this.setState({
          selectMetodePengujian: ['TPC'],
        })
      } else if ( event.target.value === 'Serum Beku' ) {
        this.setState({
          selectMetodePengujian: ['RBT'],
        })
      } else if ( event.target.value === 'Kerokan kulit' ) {
        this.setState({
          selectMetodePengujian: ['MIKROSKOPIS'],
        })
      }
    } else if(name === 'metodePengujianSampel') {
      if ( event.target.value === 'TPC' ) {
        this.setState({
          selectTargetPengujian: ['Cemaran Mikroba'],
        })
      } else if ( event.target.value === 'RAPID TEST KIT' ) {
        this.setState({
          selectTargetPengujian: ['Salmonella', 'E. Coli'],
        })
      } else if ( event.target.value === 'HA-HI/AI-ND' || event.target.value === 'ELISA RABIES' || event.target.value === 'ELISA BVD' || event.target.value === 'ELISA PARATB'  ) {
        this.setState({
          selectTargetPengujian: ['Titer Antibodi'],
        })
      } else if ( event.target.value === 'RBT' ) {
        this.setState({
          selectTargetPengujian: ['Antibodi terhadap Brucella sp.'],
        })
      } else if ( event.target.value === 'PEWARNAAN GIEMSA' ) {
        this.setState({
          selectTargetPengujian: ['Trypanosoma sp.', 'Anthrax'],
        })
      } else if ( event.target.value === 'MIKROSKOPIS' ) {
        this.setState({
          selectTargetPengujian: ['Scabies'],
        })
      } else if ( event.target.value === 'RT-PCR' ) {
        this.setState({
          selectTargetPengujian: ['Al', 'Anthrax'],
        })
      } else if ( event.target.value === 'PCR-DNA' ) {
        this.setState({
          selectTargetPengujian: ['Porcine', 'Salmonella'],
        })
      } else if ( event.target.value === 'RESIDU NITRIT' ) {
        this.setState({
          selectTargetPengujian: ['Kadar Nitrit'],
        })
      } else if ( event.target.value === 'FEED CHECK' ) {
        this.setState({
          selectTargetPengujian: ['Kandungan Mamalia'],
        })
      }
    }
  };

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      jenisSampel, jumlahSampel, kondisiSampel, jenisPengujianSampel, metodePengujianSampel, kategoriSample, targetPengujianSampel,
      loading, items,
      selectJenisPengujian, selectMetodePengujian, selectJenisSampel, selectTargetPengujian,
     } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    const isInvalid2 = jenisSampel === ''  || jumlahSampel === '' || kondisiSampel === '' || metodePengujianSampel === '' || kategoriSample === '' || 
      targetPengujianSampel === '';
    return (
      <div>
        {loading ? <Typography>Loading...</Typography> : 
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Ubah Data
            </Button>{' '}
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen2}>
              Tambah Item Pengujian
            </Button>{' '}
            <Button component={Link}
                to={{
                  pathname: `${ROUTES.WILKER_FORMUJI}`,
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
                      <TableCell>Kategori Sampel</TableCell>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) => 
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].kategoriSample}</TableCell>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].metodePengujianSampel}</TableCell>
                        <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleDelete(el1)}>
                            Hapus
                          </Button>
                        </TableCell>
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
              <DialogTitle id="form-dialog-title">Ubah Data</DialogTitle>
              <DialogContent>
                <TextField
                  disabled
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
                  autoFocus
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
                  disabled
                  margin="dense"
                  id="petugasPengambilSampel"
                  label="Petugas Pengambil Sampel"
                  value={petugasPengambilSampel}
                  onChange={this.onChange('petugasPengambilSampel')}
                  fullWidth
                />
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
            <Dialog
              open={this.state.open2}
              onClose={this.handleClose2}
              // maxWidth={'md'}
              aria-labelledby="form-dialog-title1"
              >
              <DialogTitle id="form-dialog-title1">Tambah Item Pengujian</DialogTitle>
              <DialogContent>
                <FormControl variant="standard">
                  <InputLabel htmlFor="kategoriSample">Kategori Sampel</InputLabel>{" "}
                  <Select
                    value={kategoriSample}
                    onChange={this.onChange2('kategoriSample')}
                    style={{width:400}}
                    name="kategoriSample"
                  >
                    <MenuItem value="Bahan Asal Hewan">Bahan Asal Hewan</MenuItem>
                    <MenuItem value="Hasil Bahan Asal Hewan">Hasil Bahan Asal Hewan</MenuItem>
                    <MenuItem value="Serum">Serum</MenuItem>
                    <MenuItem value="Ulas Darah">Ulas Darah</MenuItem>
                    <MenuItem value="Bahan Baku Pakan Ternak">Bahan Baku Pakan Ternak</MenuItem>
                    <MenuItem value="Swab">Swab</MenuItem>
                    <MenuItem value="Lain-lain">Lain-lain</MenuItem>            
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="jenisSampel">Jenis Sampel</InputLabel>
                  <Select
                    value={jenisSampel}
                    onChange={this.onChange2('jenisSampel')}
                    style={{width:400}}
                    name="jenisSampel"
                  >
                    { !!selectJenisSampel && Object.keys(selectJenisSampel).map(elx1 => 
                        <MenuItem key={elx1} value={selectJenisSampel[elx1].namaSample}>{selectJenisSampel[elx1].namaSample}</MenuItem>
                    )}
                  </Select>
                </FormControl>              
                <TextField
                  style={{marginTop: 15, width:400}}
                  margin="dense"
                  id="jumlahSampel"
                  label="Jumlah Sampel"
                  value={jumlahSampel}
                  onChange={this.onChange2('jumlahSampel')}
                  fullWidth
                />
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="kondisiSampel">Kondisi Sampel</InputLabel>{" "}
                  <Select
                    value={kondisiSampel}
                    onChange={this.onChange2('kondisiSampel')}
                    style={{width:400}}
                    name="kondisiSampel"
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Tidak Normal">Tidak Normal</MenuItem>            
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="metodePengujianSampel">Metode Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={metodePengujianSampel}
                    onChange={this.onChange2('metodePengujianSampel')}
                    style={{width:400}}
                    name="metodePengujianSampel"
                  >
                    {
                      !! selectMetodePengujian && selectMetodePengujian.map((elx, key) => 
                        <MenuItem key={key} value={elx}>{elx}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="targetPengujianSampel">Target Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={targetPengujianSampel}
                    onChange={this.onChange2('targetPengujianSampel')}
                    name="targetPengujianSampel"
                    style={{width:400}}
                  >
                    {!! selectTargetPengujian && selectTargetPengujian.map((elx, key) => 
                        <MenuItem key={key} value={elx}>{elx}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleClose2}>
                  Cancel
                </Button>
                <Button 
                  variant="outlined"
                  onClick={this.handleSubmit2} 
                  disabled={isInvalid2} 
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
const SampelAdd = withFirebase(SampelAddBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);