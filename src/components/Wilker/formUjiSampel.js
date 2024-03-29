import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
// import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import FormGroup from '@material-ui/core/FormGroup';
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
import getMonth from 'date-fns/getMonth';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MUIDataTable from "mui-datatables";

// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


class MainSampleBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
      // ...props.location.state,
    };
    // console.log('main sample', this)
  }

  render() {
    return (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
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
      // ...props.location.state,
    };
  }

  componentDidMount() {
    // console.log(AuthUserContext)
    // console.log('ALL DATA', this.context);
    // console.log(this)
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples')
      .orderByChild('tanggalMasuksampel')
      .limitToLast(100)
      // .orderByChild('areaWilker').equalTo(this.context.area)
      .on('value', snap => {
        if (snap.val()) {
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
              nipUser: el.val().nipUser,
              flagActivity: el.val().flagActivity,
              flagStatusProses: el.val().flagStatusProses,
              flagStatusLaporan: el.val().flagStatusLaporan,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              formLaporanKeterangan: el.val().formLaporanKeterangan,
              formLaporanKesimpulan: el.val().formLaporanKesimpulan,
              manajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
              nipManajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
              manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
              nipManajerTeknisAdminLab: el.val().nipManajerTeknisAdminLab,
              unitPengujianSampel: el.val().unitPengujianSampel,
              keteranganPengujianDitolak: el.val().keteranganPengujianDitolak,
              areaWilker: el.val().areaWilker,
              zItems: el.val().zItems,
              tanggalMasukSampelz: dateFnsFormat(new Date(el.val().tanggalMasukSampel), "dd MMM yyyy"),
              Status: [el.val().flagStatusProses, el.val().flagActivity, el.val().keteranganPengujianDitolak],
              Detail: [el.val().idPermohonanUji, el.val(), el.val().flagActivity],
              Hapus: [el.val().idPermohonanUji, el.val().flagActivity],
              Report: [el.val().flagActivity, el.val()],
              Action: [el.val().idPermohonanUji, el.val().flagActivity],
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
      flagActivityDetail: 'Menunggu konfirmasi lanjut pengujian dari Admin Lab',
    })
  }

  columns = [
    {
      name: "tanggalMasukSampel",
      label: 'Tanggal Masuk Sampel',
      options: {
        filter: true,
        sortDirection: 'desc',
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Text>{dateFnsFormat(new Date(value), "dd MMM yyyy")}</Text>
          );
        }
      }
    },
    {
      name: "nomorAgendaSurat",
      label: 'Nomor Permohonan (IQFAST)',
      options: { filter: false }
    },
    {
      name: "namaPemilikSampel",
      label: 'Nama Pemilik Sampel',
      options: { filter: false }
    },
    {
      name: "asalTujuanSampel",
      label: 'Asal/Tujuan Sampel',
      options: { filter: false }
    },
    {
      name: "Status",
      label: 'Status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          return (
            <Text>{value[0]} {value[1] === 'Sampel tidak dapat diuji' && ' Keterangan: ' + value[2]}</Text>
          )
        }
      }
    },
    {
      name: 'Detail',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return (
            <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}/${value[0]}`,
                data: value[1],
              }}
              disabled={value[2] === "Belum ada sampel uji" || value[2] === "Data sudah lengkap" ? false : true}
            >
              Detail
            </Button>
          )
        }
      }
    },
    {
      name: 'Hapus',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return (
            <Button variant="text" color="secondary" onClick={() => this.handleDelete(value[0])}
              disabled={value[1] === "Belum ada sampel uji" || value[1] === "Data sudah lengkap" ? false : true}
            >
              Hapus
            </Button>
          )
        }
      }
    },
    {
      name: 'Report',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return (
            <Text>
              {value[0] === 'Laporan Hasil Uji di Admin Lab' &&
                <PDFDownloadLink document={<PDFLHU q={value[1]} />} fileName="Laporan-Hasil-Uji.pdf">
                  {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                </PDFDownloadLink>
              }
              {value[0] !== 'Laporan Hasil Uji di Admin Lab' &&
                <PDFDownloadLink document={<Quixote q={value[1]} />} fileName="permohonan-pengujian.pdf">
                  {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Permohonan Pengujian')}
                </PDFDownloadLink>

              }
            </Text>
          )
        }
      }
    },
    {
      name: "Action",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeLab(value[0])}
              disabled={value[1] === "Data sudah lengkap" ? false : true}
            >
              Submit ke Lab
            </Button>
          );
        }
      }
    },
  ]
  options = {
    filterType: 'dropdown',
    rowsPerPage: 50,
    selectableRows: 'none',
    download: false,
    print: false,
    search: false,
    // customSort: (data, colIndex, order) => {
    //   return data.sort((a, b) => {
    //     if (colIndex === 0 || colIndex === 0) {
    //       return (
    //         new Date(a.data[colIndex]) < new Date(b.data[colIndex]) ? -1 : 1) * (order === 'desc' ? 1 : -1);
    //     } else {
    //       return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === 'desc' ? 1 : -1);
    //     }
    //   });
    // }
  };

  render() {
    // console.log(this.state);

    const { items, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> :
              <div>
                <Button variant="outlined" color="primary"
                  style={{ marginBottom: '10px' }}
                  component={Link} to={{
                    pathname: `${ROUTES.WILKER_FORMUJIADD}`,
                    data: { authUser }
                  }}
                >
                  Tambah Data
                </Button>

                <MUIDataTable
                  // title={"Daftar Sampel"}
                  data={this.state.items ? this.state.items : this.state.itemB}
                  columns={this.columns}
                  options={this.options}
                />

                {/* <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No. Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={4}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "dd MMM yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>
                          {el.flagActivity === 'Permohonan pengujian selesai di analisa' ? el.flagActivity : el.flagStatusProses}
                          {el.flagActivity === 'Sampel tidak dapat diuji' && ' Keterangan: ' + el.keteranganPengujianDitolak}
                        </TableCell>
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
                        {el.flagActivity === 'Laporan Hasil Uji di Admin Lab' ?
                          <TableCell>
                            <PDFDownloadLink document={<PDFLHU q={el} />} fileName="Laporan-Hasil-Uji.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                            </PDFDownloadLink>
                          </TableCell>
                          :
                          <TableCell>
                            <PDFDownloadLink document={<Quixote q={el} />} fileName="permohonan-pengujian.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Permohonan Pengujian')}
                            </PDFDownloadLink>
                          </TableCell>
                        }
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
                </Table> */}
                {/* <PDFViewer>
                  <Quixote pass={el.idPermohonanUji} />
                </PDFViewer> */}
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
      kodeWilker:'',
      areaWilker:'',
      // areaWilker:this.props.location.data.authUser.area,
    };
  }

  componentDidMount() {

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
            namaWilker: el.val().namaWilker,
          })
        })
        this.setState({
          items: a,
          loading: false,
          kodeUnikSampel: a[0].kodeWilker +
            ('00000' + (parseInt(a[0].countSampelWilker, 10) + 1)).slice(-5),
          tanggalMasukSampel: new Date(),
          petugasPengambilSampel: this.props.location.data.authUser.username,
          nipUser: this.props.location.data.authUser.nipUser,
        });
      })

  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/wilker').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    // this.setState({ open: false });
    // console.log(this.state.items[0]);
    const a = this.props.firebase.db.ref('samples').push();
    this.props.firebase.db.ref('samples/' + a.key).update({
      idPermohonanUji: a.key,
      kodeUnikSampel: this.state.kodeUnikSampel,
      tanggalMasukSampel: this.state.tanggalMasukSampel,
      nomorAgendaSurat: this.state.nomorAgendaSurat,
      namaPemilikSampel: this.state.namaPemilikSampel,
      alamatPemilikSampel: this.state.alamatPemilikSampel,
      asalTujuanSampel: this.state.asalTujuanSampel,
      petugasPengambilSampel: this.state.petugasPengambilSampel,
      nipUser: this.state.nipUser,
      flagActivity: 'Belum ada sampel uji',
      flagStatusProses: 'Sampel di Wilker',
      areaWilker: this.state.areaWilker,
      bulanMasukSampel: getMonth(this.state.tanggalMasukSampel) + 1,
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

  onChangeKodeWilker = name => event => {
    // console.log(name)
    this.setState({
      areaWilker: event.target.value,
    });
    
  };


  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      loading, areaWilker,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '' || areaWilker === '';
    // console.log(this.state)

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
            <Typography variant="h5" gutterBottom>Tambah Sampel</Typography>
            <div>
              {/* <TextField
                disabled
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              /> */}
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  style={{ width: 250 }}
                  label="Tanggal Masuk Sampel"
                  value={tanggalMasukSampel}
                  format={'dd MMM yyyy'}
                  onChange={this.handleDateChange} />
              </MuiPickersUtilsProvider>
              <TextField
                autoFocus
                margin="dense"
                id="nomorAgendaSurat"
                label="Nomor Permohonan (IQFAST)"
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
                label="Asal/Tujuan Media Pembawa"
                value={asalTujuanSampel}
                onChange={this.onChange('asalTujuanSampel')}
                fullWidth
              />
              <FormControl variant="standard">
                <InputLabel htmlFor="areaWilker">Kode Wilker</InputLabel>{" "}
                <Select
                  value={areaWilker}
                  onChange={this.onChangeKodeWilker('areaWilker')}
                  style={{ width: 600 }}
                  name="areaWilker"
                >
                  <MenuItem key={1} value="0501">0501 - Pelabuhan Soekarno Hatta</MenuItem>
                  <MenuItem key={2} value="0502">0502 - Pelabuhan Paotere</MenuItem>
                  <MenuItem key={3} value="0503">0503 - Pelabuhan Bulukumba</MenuItem>
                  <MenuItem key={4} value="0504">0504 - Pelabuhan Jeneponto</MenuItem>
                  <MenuItem key={5} value="0505">0505 - Bandara Hasanuddin</MenuItem>
                  <MenuItem key={6} value="0506">0506 - Kantor Pos</MenuItem>
                  <MenuItem key={7} value="0507">0507 - Pelabuhan Selayar</MenuItem>
                  <MenuItem key={8} value="0508">0508 - Pelabuhan Tuju Tuju</MenuItem>
                  <MenuItem key={9} value="0509">0509 - Pelabuhan Bajoe</MenuItem>
                </Select>
              </FormControl>
              <TextField
                disabled
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel (PPC)"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />

              <Button style={{ marginTop: 15 }} variant="outlined" onClick={this.handleSubmit}
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
      keteranganSampel: '',
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
        if (snap.val()) {
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
            nipUser: snap.val().nipUser,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
      })
    this.props.firebase.db.ref('masterData/userform')
      .on('value', snap1 => {
        if (snap1.val()) {
          const b1 = [];
          snap1.forEach((res) => {
            if (res.val().jabatanUserForm === 'Wilker') {
              b1.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            }
          })
          this.setState({
            selectUserformPenyelia: b1,
          });
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
      nipUser: this.state.nipUser,
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
      targetPengujianSampel: this.state.targetPengujianSampel,
      ruangLingkupSampel: this.state.ruangLingkupSampel,
      keteranganSampel: this.state.keteranganSampel,
    })

    this.setState({
      kategoriSample: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      metodePengujianSampel: '',
      targetPengujianSampel: '',
      ruangLingkupSampel: '',
      keteranganSampel: '',
    });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivity: 'Data sudah lengkap',
    })
  }

  handleDelete = propSample => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + propSample).remove();
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
    if (name === 'kategoriSample') {
      this.props.firebase.db.ref('masterData/sample').orderByChild("kategoriSample").equalTo(event.target.value)
        .once("value", snap => {
          // console.log(snap.val())
          const a = [];
          a.push(snap.val());
          this.setState({
            selectJenisSampel: a[0],
          })
        })
      if (event.target.value === 'Bahan Asal Hewan' || event.target.value === 'Hasil Bahan Asal Hewan') {
        this.setState({
          selectMetodePengujian: ['TPC', 'RAPID TEST KIT', 'RAPID TEST SALMONELLA', 'RAPID TEST NITRIT', 'HA-HI/AI-ND', 'SALMONELLA'],
        })
      } else if (event.target.value === 'Ulas Darah') {
        this.setState({
          selectMetodePengujian: ['MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA', 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER', 'MIKROSKOPIS ANAPLASMA SP. DENGAN PEWARNAAN GIEMSA', 'MIKROSKOPIS BABESIA SP. DENGAN PEWARNAAN GIEMSA', 'MIKROSKOPIS THEILERIA SP. DENGAN PEWARNAAN GIEMSA'],
        })
      } else if (event.target.value === 'Bahan Baku Pakan Ternak') {
        this.setState({
          selectMetodePengujian: ['PCR-DNA', 'RT-PCR', 'FEED CHECK', 'RAPID TEST SALMONELLA'],
        })
      } else if (event.target.value === 'Swab') {
        this.setState({
          selectMetodePengujian: ['RT-PCR'],
        })
      }
    } else if (name === 'jenisSampel') {
      if (event.target.value === 'Serum Darah Sapi') {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD', 'ELISA PARATB', 'ELISA PMK', 'PCR PMK'],
        })
      } else if (event.target.value === 'Serum Darah Kerbau' || event.target.value === 'Serum Darah Kambing') {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD'],
        })
      } else if (event.target.value === 'Serum Darah Anjing' || event.target.value === 'Serum Darah Kucing') {
        this.setState({
          selectMetodePengujian: ['ELISA RABIES'],
        })
      } else if (event.target.value === 'Serum Darah Ayam' || event.target.value === 'Serum Darah DOC' || event.target.value === 'Serum Darah Burung') {
        this.setState({
          selectMetodePengujian: ['HA-HI/AI-ND', 'HA/HI-AI', 'HA/HI-ND'],
        })
      } else if (event.target.value === 'Sarang Burung Walet') {
        this.setState({
          selectMetodePengujian: ['RESIDU NITRIT', 'RAPID TEST NITRIT', 'PCR AI', 'RT-PCR', 'TPC'],
        })
      } else if (event.target.value === 'Bakteri Kering') {
        this.setState({
          selectMetodePengujian: ['TPC'],
        })
      } else if (event.target.value === 'Serum Beku') {
        this.setState({
          selectMetodePengujian: ['RBT'],
        })
      } else if (event.target.value === 'Kerokan kulit') {
        this.setState({
          selectMetodePengujian: ['MIKROSKOPIS'],
        })
      } else if (event.target.value === 'Serum Beku UP') {
        this.setState({
          selectMetodePengujian: ['HI/AI-ND', 'RBT'],
        })
      }
    } else if (name === 'metodePengujianSampel') {
      if (event.target.value === 'TPC') {
        this.setState({
          selectTargetPengujian: ['Cemaran Mikroba'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'RAPID TEST KIT') {
        this.setState({
          selectTargetPengujian: ['Salmonella', 'E. Coli'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'HA-HI/AI-ND' || event.target.value === 'ELISA RABIES' || event.target.value === 'ELISA BVD' || event.target.value === 'ELISA PARATB'  || event.target.value === 'ELISA PMK' ) {
        this.setState({
          selectTargetPengujian: ['Titer Antibodi'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'RBT') {
        this.setState({
          selectTargetPengujian: ['Antibodi terhadap Brucella sp.'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA' 
                    || event.target.value === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER'
                    || event.target.value === 'MIKROSKOPIS ANAPLASMA SP. DENGAN PEWARNAAN GIEMSA'
                    || event.target.value === 'MIKROSKOPIS BABESIA SP. DENGAN PEWARNAAN GIEMSA'
                    || event.target.value === 'MIKROSKOPIS THEILERIA SP. DENGAN PEWARNAAN GIEMSA'
                    ) {
        this.setState({
          selectTargetPengujian: ['Mikroskopis Trypanosoma sp.', 'Anthrax', 'Anaplasma sp.', 'Babesia sp.', 'Theileria sp.'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'MIKROSKOPIS') {
        this.setState({
          selectTargetPengujian: ['Scabies'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'RT-PCR') {
        this.setState({
          selectTargetPengujian: ['Al', 'Anthrax', 'Avian Influenza'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'PCR-DNA') {
        this.setState({
          selectTargetPengujian: ['Porcine', 'Salmonella'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'RESIDU NITRIT') {
        this.setState({
          selectTargetPengujian: ['Kadar Nitrit'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'FEED CHECK') {
        this.setState({
          selectTargetPengujian: ['Kandungan Mamalia'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'SALMONELLA') {
        this.setState({
          selectTargetPengujian: ['Cemaran Mikroba'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'RAPID TEST SALMONELLA') {
        this.setState({
          selectTargetPengujian: ['Salmonella'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'RAPID TEST NITRIT') {
        this.setState({
          selectTargetPengujian: ['Kandungan Nitrit'],
          ruangLingkupSampel: 'Diluar Akreditasi',
        })
      } else if (event.target.value === 'HI/AI-ND') {
        this.setState({
          selectTargetPengujian: ['Antibodi AI-ND'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'HA/HI-AI') {
        this.setState({
          selectTargetPengujian: ['Titer Antibodi AI'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'HA/HI-ND') {
        this.setState({
          selectTargetPengujian: ['Titer Antibodi ND'],
          ruangLingkupSampel: 'Akreditasi',
        })
      } else if (event.target.value === 'PCR PMK') {
        this.setState({
          selectTargetPengujian: ['PMK'],
          ruangLingkupSampel: 'Akreditasi',
        })
      }
    }
  };

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      jenisSampel, jumlahSampel, kondisiSampel, metodePengujianSampel, kategoriSample, targetPengujianSampel,
      loading, items,
      selectMetodePengujian, selectJenisSampel, selectTargetPengujian, ruangLingkupSampel, keteranganSampel,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    const isInvalid2 = jenisSampel === '' || jumlahSampel === '' || kondisiSampel === '' || metodePengujianSampel === '' || kategoriSample === '' ||
      targetPengujianSampel === '';
    // console.log(items);

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
            {/* <PDFDownloadLink document={<Quixote q={items} />} fileName="permohonan-pengujian.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download PDF!')}
            </PDFDownloadLink>{' '} */}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                {/* <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampel}</Typography> */}
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sampel : {dateFnsFormat(new Date(el.tanggalMasukSampel), "dd MMM yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sampel : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sampel : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
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
                {/* <TextField
                  disabled
                  margin="dense"
                  id="kodeUnikSampel"
                  label="Kode Unik Sampel"
                  value={kodeUnikSampel}
                  onChange={this.onChange('kodeUnikSampel')}
                  fullWidth
                /> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 250 }}
                    label="Tanggal Masuk Sampel"
                    value={tanggalMasukSampel}
                    format={'dd MMM yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                <TextField
                  autoFocus
                  margin="dense"
                  id="nomorAgendaSurat"
                  label="Nomor Permohonan (IQFAST)"
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
                  label="Asal/Tujuan Media Pembawa"
                  value={asalTujuanSampel}
                  onChange={this.onChange('asalTujuanSampel')}
                  fullWidth
                />
                <TextField
                  disabled
                  margin="dense"
                  id="petugasPengambilSampel"
                  label="Petugas Pengambil Sampel (PPC)"
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
                    style={{ width: 400 }}
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
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="jenisSampel">Jenis Sampel</InputLabel>
                  <Select
                    value={jenisSampel}
                    onChange={this.onChange2('jenisSampel')}
                    style={{ width: 400 }}
                    name="jenisSampel"
                  >
                    {!!selectJenisSampel && Object.keys(selectJenisSampel).map(elx1 =>
                      <MenuItem key={elx1} value={selectJenisSampel[elx1].namaSample}>{selectJenisSampel[elx1].namaSample}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  style={{ marginTop: 15, width: 400 }}
                  margin="dense"
                  id="jumlahSampel"
                  label="Jumlah Sampel"
                  value={jumlahSampel}
                  onChange={this.onChange2('jumlahSampel')}
                  fullWidth
                />
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="kondisiSampel">Kondisi Sampel</InputLabel>{" "}
                  <Select
                    value={kondisiSampel}
                    onChange={this.onChange2('kondisiSampel')}
                    style={{ width: 400 }}
                    name="kondisiSampel"
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Tidak Normal">Tidak Normal</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="metodePengujianSampel">Metode Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={metodePengujianSampel}
                    onChange={this.onChange2('metodePengujianSampel')}
                    style={{ width: 400 }}
                    name="metodePengujianSampel"
                  >
                    {
                      !!selectMetodePengujian && selectMetodePengujian.map((elx, key) =>
                        <MenuItem key={key} value={elx}>{elx}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="targetPengujianSampel">Target Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={targetPengujianSampel}
                    onChange={this.onChange2('targetPengujianSampel')}
                    name="targetPengujianSampel"
                    style={{ width: 400 }}
                  >
                    {!!selectTargetPengujian && selectTargetPengujian.map((elx, key) =>
                      <MenuItem key={key} value={elx}>{elx}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="ruangLingkupSampel">Ruang Lingkup Sampel</InputLabel>{" "}
                  <Select
                    value={ruangLingkupSampel}
                    onChange={this.onChange2('ruangLingkupSampel')}
                    style={{ width: 400 }}
                    name="ruangLingkupSampel"
                  >
                    <MenuItem value="Akreditasi">Akreditasi</MenuItem>
                    <MenuItem value="Diluar Akreditasi">Diluar Akreditasi</MenuItem>
                    {/* <MenuItem value="Diluar Akreditasi (Wilker)">Diluar Akreditasi (Wilker)</MenuItem> */}
                  </Select>
                </FormControl>
                {/* <FormLabel style={{ marginTop: 15 }} component="legend">Kaji Ulang Permintaan</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked />} label="Ketersediaan Bahan Pengujian" />
                  <FormControlLabel control={<Checkbox checked />} label="Kesiapan Personnel" />
                  <FormControlLabel control={<Checkbox checked />} label="Kondisi Alat" />
                </FormGroup> */}
                <TextField
                  style={{ marginTop: 15, width: 400 }}
                  margin="dense"
                  id="keteranganSampel"
                  label="Keterangan Sampel"
                  value={keteranganSampel}
                  onChange={this.onChange2('keteranganSampel')}
                  fullWidth
                />
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

// *********************************************** begin PDF part
const styles = StyleSheet.create({
  body: {
    padding: 10
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    // margin: "auto",
    margin: 3,
    fontSize: 10,
    fontWeight: 300
  },
  tableCell: {
    // margin: "auto",
    margin: 3,
    fontSize: 9,
    flexDirection: "row",
  },
  headerRow: {
    margin: 5,
    flexDirection: "row",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomWidth: 2,
  },
  headerTitle10: {
    fontSize: 10,
  },
  headerTitle11: {
    fontSize: 11,
  },
  headerTitle16: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 3,
  },
  logo: {
    marginVertical: 3,
    marginHorizontal: 3,
    width: 40,
    height: 40,
  },
  logo2: {
    marginVertical: 3,
    marginHorizontal: 3,
    width: 40,
    height: 40,
  },
  headerRowRight: {
    textAlign: 'right',
    fontSize: 11,
  },
  headerRowCenter: {
    textAlign: 'center',
    marginVertical: 15,
  },
  marginV10: {
    marginVertical: 10,
  },
  marginL15: {
    marginLeft: 10,
  },
  marginL20: {
    marginLeft: 20,
  },
  marginL40: {
    marginLeft: 40,
  },
  tableHeaderCol5: {
    width: "5%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol10: {
    width: "10%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol15: {
    width: "15%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol20: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol25: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol40: {
    width: "40%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomWidth: 0
  },
  tableHeaderCol60: {
    width: "60%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableCol5: {
    width: "5%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol10: {
    width: "10%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol15: {
    width: "15%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol20: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol25: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  header1Table: {
    display: "table",
    width: "auto",
    
  },
  header1TableRow: {
    // margin: "auto",
    left: 30,
    flexDirection: "row"
  },
  header1Col30: {
    width: "30%",
    
  },
  header1TableCell: {
    // margin: "auto",
    // margin: 3,
    fontSize: 11,
    flexDirection: "row",
  },
  footerRow: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: '20%',
  },
  footerRow2: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
  footerRow100: {
    position: 'absolute',
    bottom: 100,
    marginHorizontal: '20%',
  },
  footerRow200: {
    position: 'absolute',
    bottom: 200,
    marginHorizontal: '10%',
  },
  footerCol: {
    alignItems: 'center',
    fontSize: 11,
    // marginHorizontal: 100,
  },
  spaceV400: {
    width: 400,
    height: 5,
  },
  spaceV150: {
    width: 120,
    height: 5,
  },
  spaceV50: {
    width: 50,
    height: 5,
  },
  spaceVLogo: {
    width: 130,
    height: 5,
  },
  textUnderline: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
});

const Quixote = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='landscape' style={styles.body}>
      <View style={styles.headerRow}>
        <Image
          style={styles.logo}
          src='data:image/png;base64,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'
        />
        <View>
          <Text style={styles.headerTitle10}>BALAI BESAR KARANTINA PERTANIAN MAKASSAR</Text>
          <Text style={styles.headerTitle10}>LABORATORIUM</Text>
          <Text style={styles.headerTitle10}>Jl. Kapasa Raya No. 17 Km. 14 Daya, Makassar</Text>
          <Text style={styles.headerTitle10}>Telp. : 0411-510 041 Fax : 0411-516 351, Email : labbbkpmakassar@gmail.com</Text>
        </View>
        
      </View>
      <View style={styles.headerRowRight}>
        <Text>Form No : 5.4.7.1.1</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>PERMOHONAN PENGUJIAN</Text>
        <Text style={styles.headerTitle11}>Nomor : {p.q.nomorAgendaSurat} {'   '}Tanggal : {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "dd MMM yyyy")}</Text>
      </View>
      <View style={styles.marginV10}>
        <Text style={styles.headerTitle11}>Tanggal Penerimaan Sampel : {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "dd MMM yyyy")}</Text>
        <Text style={styles.headerTitle11}>Nama Customer : {p.q.namaPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Alamat dan No Tlp Customer : {p.q.alamatPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Asal/Tujuan Sampel: {p.q.asalTujuanSampel}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol5}>
            <Text style={styles.tableCellHeader}>No</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jumlah Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Kondisi Sampel</Text>
            <View style={styles.footerRow2}>
              <View style={styles.tableHeaderCol40}>
                <Text style={styles.tableCellHeader}>Normal</Text>
              </View>
              <View style={styles.tableHeaderCol60}>
                <Text style={styles.tableCellHeader}>Tidak Normal</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jenis Pengujian / Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Ruang Lingkup</Text>
            <View style={styles.footerRow2}>
              <View style={styles.tableHeaderCol40}>
                <Text style={styles.tableCellHeader}>Akreditasi</Text>
              </View>
              <View style={styles.tableHeaderCol60}>
                <Text style={styles.tableCellHeader}>Diluar Akreditasi</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Keterangan</Text>
          </View>
        </View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View style={styles.tableRow}>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCell}>{key1 + 1}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jumlahSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].kondisiSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].ruangLingkupSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].keteranganSampel}</Text>
            </View>
          </View>
        )}

      </View>
      <View style={styles.footerRow}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>Penerima Sampel</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>(...................)</Text>
          </View>
          <View style={styles.spaceV400}></View>
          <View style={styles.footerCol}>
            <Text>Petugas Pengambil Sampel, {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "dd MMM yyyy")}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.petugasPengambilSampel} )</Text>
            <Text>NIP. {p.q.nipUser}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
}

const PDFLHU = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='portrait' style={styles.body}>
      <View style={styles.headerRow}>
        <Image
          style={styles.logo}
          src='data:image/png;base64,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'
        />
        <View>
          <Text style={styles.headerTitle10}>BALAI BESAR KARANTINA PERTANIAN MAKASSAR</Text>
          <Text style={styles.headerTitle10}>LABORATORIUM</Text>
          <Text style={styles.headerTitle10}>Jl. Kapasa Raya No. 17 Km. 14 Daya, Makassar</Text>
          <Text style={styles.headerTitle10}>Telp. : 0411-510 041 Fax : 0411-516 351, Email : labbbkpmakassar@gmail.com</Text>
        </View>
        <View style={styles.spaceVLogo}></View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) => {
          if (p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND'
                || p.q.zItems[el1].metodePengujianSampel === 'RBT' 
                || p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' 
                || p.q.zItems[el1].metodePengujianSampel === 'TPC'
                || p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA'
                || p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER'  
                ) {
            return <Image
              style={styles.logo2}
              src='data:image/png;base64,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'
            />
          }
          }
        )}
      </View>
      <View style={styles.headerRowRight}>
        <Text>Form No : 5.4.4.2</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>LAPORAN HASIL UJI</Text>
        {/* {p.q.unitPengujianSampel === 'Mikrobiologi' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI MIKROBIOLOGI</Text>}
        {p.q.unitPengujianSampel === 'Virologi' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI VIROLOGI</Text>}
        {p.q.unitPengujianSampel === 'Serologi' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI SEROLOGI</Text>}
        {p.q.unitPengujianSampel === 'Biomolekuler' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI SEROLOGI</Text>}
        {p.q.unitPengujianSampel === 'PSAH' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI SEROLOGI</Text>}
        {p.q.unitPengujianSampel === 'Parasitologi' && <Text style={styles.headerTitle16}>LAPORAN HASIL UJI PARASITOLOGI</Text>} */}
        <Text style={styles.headerTitle10}>Nomor : {p.q.nomorLhu} {'   '}Tanggal : {dateFnsFormat(new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL15]}>
        <Text style={styles.headerTitle11}>Laporan / Sertifikat ini diberikan kepada :</Text>
      </View>
      <View style={styles.header1Table}>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Nama / Instansi Pemilik Sampel</Text>
              </View>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>: {p.q.namaPemilikSampel}</Text>
              </View>
        </View>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Alamat</Text>
              </View>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>: {p.q.alamatPemilikSampel}</Text>
              </View>
        </View>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Ket. Asal / Tujuan </Text>
              </View>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>: {p.q.asalTujuanSampel}</Text>
              </View>
        </View>
      </View>
      <View style={[styles.marginV10, styles.marginL15]}>
        <Text style={styles.headerTitle11}>Yang telah mengirim sampel untuk pengujian Laboratorium, Identitas sampel, jenis dan hasil pengujian sebagai berikut : </Text>
      </View>
      {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
        <View style={styles.header1Table}>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Sampel (jenis dan jumlah)</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {p.q.zItems[el1].jenisSampel} / {p.q.zItems[el1].jumlahSampel}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>No. Identifikasi Sampel</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {p.q.kodeUnikSampelAdminLab}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>No. Surat Pengiriman</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {p.q.nomorAgendaSurat}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Tanggal Pengiriman Surat</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "dd MMM yyyy")}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Tanggal Penerimaan Sampel</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {dateFnsFormat(p.q.tanggalTerimaSampelAdminLab === undefined ? new Date() : new Date(p.q.tanggalTerimaSampelAdminLab), "dd MMM yyyy")}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Jenis Pengujian</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {p.q.unitPengujianSampel}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Tanggal Pengujian</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
                </View>
          </View>
          <View style={styles.header1TableRow}>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>Kondisi Sampel</Text>
                </View>
                <View style={styles.header1Col30}>
                  <Text style={styles.header1TableCell}>: {p.q.zItems[el1].kondisiSampel}</Text>
                </View>
          </View>
          
        </View>
      )}
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>HASIL</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol10}>
            <Text style={styles.tableCellHeader}>Jumlah Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol10}>
            <Text style={styles.tableCellHeader}>Jenis Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Metode Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Hasil Uji</Text>
          </View>
          <View style={styles.tableHeaderCol25}>
            <Text style={styles.tableCellHeader}>Keterangan</Text>
          </View>
        </View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View key={key1} style={styles.tableRow}>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol10}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jumlahSampel}</Text>
            </View>
            <View style={styles.tableCol10}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].targetPengujianSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampel}</Text>
              {!!p.q.zItems[el1].hasilUjiSampelBaris2 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris2}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris3 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris3}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris4 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris4}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris5 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris5}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris6 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris6}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris7 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris7}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris8 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris8}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris9 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris9}</Text>}
              {!!p.q.zItems[el1].hasilUjiSampelBaris10 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris10}</Text>}
            </View>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].keteranganSampel}</Text>
            </View>
          </View>
        )}
      </View>
      <Text>{' '}</Text>
      <View style={styles.headerTitle10}><Text>Keterangan: </Text></View>
      <View style={styles.headerTitle10}><Text>{p.q.formLaporanKeterangan}</Text></View>
      <Text>{' '}</Text>
      <View style={styles.headerTitle10}><Text>Kesimpulan: </Text></View>
      <View style={styles.headerTitle10}><Text>{p.q.formLaporanKesimpulan}</Text></View>
      <View style={styles.footerRow200}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Administrasi</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.manajerAdministrasiAdminLab} )</Text>
            <Text>NIP. {p.q.nipManajerAdministrasiAdminLab}</Text>
          </View>
          <View style={styles.spaceV150}></View>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Image
              style={styles.logo}
              src='data:image/png;base64,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NCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACoNCcAAAAAAAAqzQkAAAAAAIBKcwIAAAAAAKDSnAAAAAAAAKg0JwAAAAAAACrNCQAAAAAAgEpzAgAAAAAAoNKcAAAAAAAAqDQnAAAAAAAAKs0JAAAAAACASnMCAAAAAACg0pwAAAAAAACo/gGZP1l1PZHOdgAAAABJRU5ErkJggg=='

            />
          </View>
          <View style={styles.spaceV50}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11]}>Makassar, {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
            <Text>{' '}</Text>
            <Text style={[styles.headerTitle11, styles.headerRowLeft]}>Mengetahui,</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Teknis</Text>
            <Text>ttd</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.manajerTeknisAdminLab} )</Text>
            <Text>NIP. {p.q.nipManajerTeknisAdminLab}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footerRow100}>
        <View style={[styles.marginV10, styles.marginL20]}>
          <Text style={styles.headerTitle11}>Nb: Hasil hanya berlaku untuk sampel yang diuji</Text>
        </View>
        {/* <View style={[styles.marginV10, styles.marginL40]}>
          <Text style={styles.headerTitle11}>Hasil hanya berlaku untuk sampel yang diuji</Text>
        </View> */}
      </View>
    </Page>
  </Document>
}

// *********************************************** end PDF part


const condition = authUser => !!authUser;

SampelAllBase.contextType = AuthUserContext

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);
const SampelAdd = withFirebase(SampelAddBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);