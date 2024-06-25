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

import { logoBalai, logoKan, qrAgus, qrAhmad, qrIndra, qrIntarti, qrMirah, qrNovia, qrNur, qrRizka } from '../../constants/svg';
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
      listWilker: [],
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

      this.props.firebase.db.ref('masterData/wilker')
      .orderByChild('kodeWilker')
      .on('value', snap => {
        const a = [];
        // a.push(snap.val());
        snap.forEach(el => {
          a.push({
            xkodeWilker: el.val().kodeWilker,
            xnamaWilker: el.val().namaWilker,
          })
        })

        this.setState({
          listWilker : a
        })

        // console.log('a')
        // console.log(a)

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
    console.log(name)
    this.setState({
      areaWilker: event.target.value,
    });
    
  };


  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      loading, areaWilker, listWilker
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

                  {!!listWilker && Object.keys(listWilker).map(elx1 =>
                      <MenuItem key={elx1} value={listWilker[elx1].xkodeWilker}>{listWilker[elx1].xkodeWilker} - {listWilker[elx1].xnamaWilker}</MenuItem>
                    )}

                  {/* <MenuItem key={1} value="0501">0501 - Pelabuhan Soekarno Hatta</MenuItem>
                  <MenuItem key={2} value="0502">0502 - Pelabuhan Paotere</MenuItem>
                  <MenuItem key={3} value="0503">0503 - Pelabuhan Bulukumba</MenuItem>
                  <MenuItem key={4} value="0504">0504 - Pelabuhan Jeneponto</MenuItem>
                  <MenuItem key={5} value="0505">0505 - Bandara Hasanuddin</MenuItem>
                  <MenuItem key={6} value="0506">0506 - Kantor Pos</MenuItem>
                  <MenuItem key={7} value="0507">0507 - Pelabuhan Selayar</MenuItem>
                  <MenuItem key={8} value="0508">0508 - Pelabuhan Tuju Tuju</MenuItem>
                  <MenuItem key={9} value="0509">0509 - Pelabuhan Bajoe</MenuItem> */}
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
  headerRow2: {
    padding: 4,
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
  headerTitleRow1: {
    fontSize: 14,
    fontWeight: 'heavy',
    letterSpacing: 3
  },
  headerTitleRow2: {
    fontSize: 10,
    fontWeight: 'heavy',
    letterSpacing: 3
  },
  headerTitleRow3: {
    fontSize: 6,
  },
  logoHeader: {
    // marginVertical: 3,
    // marginHorizontal: 3,
    width: 60,
    height: 60,
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
  header1Content50: {
    width: "50%",
  },
  logoHeader: {
    // marginVertical: 3,
    // marginHorizontal: 3,
    width: 60,
    height: 60,
  },
  headerTitleRow1: {
    fontSize: 14,
    fontWeight: 'heavy',
    letterSpacing: 3
  },
  headerTitleRow2: {
    fontSize: 10,
    fontWeight: 'heavy',
    letterSpacing: 3
  },
  headerTitleRow3: {
    fontSize: 6,
  },
});

const Quixote = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='landscape' style={styles.body}>
      <View style={styles.headerRow}>
      <Image
          style={styles.logoHeader}
          src={logoBalai}
        />
        <View style={{display: "flex", flexGrow:2, flexDirection: "column", marginBottom: 2}}>
          <View style={{alignItems: "center"}}>
          <Text style={styles.headerTitleRow1}>BADAN KARANTINA INDONESIA</Text>
          <Text style={styles.headerTitleRow2}>BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN</Text>
          <Text style={[styles.headerTitleRow2, {marginBottom: 2}]}>SULAWESI SELATAN</Text>
          <Text style={styles.headerTitleRow3}>JALAN PERINTIS KEMERDEKAAN KM 12, MAKASSAR 90241 TELEPON (0411) 895 8810</Text>
          <Text style={styles.headerTitleRow3}>JALAN KAPASA RAYA NO 17 KM 14 Daya, MAKASSAR 90241</Text>
          <Text style={styles.headerTitleRow3}>WEBSITE : www.karantinaindonesia.go.id</Text>
          <Text style={styles.headerTitleRow3}>EMAIL : bbkp-makassar@gmail.com</Text>
          </View>
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
  // console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='portrait' style={styles.body}>
      <View style={styles.headerRow2}>
        {/* Logo balai karantina */}
        <Image
          style={styles.logoHeader}
          src={logoBalai}
        />
        <View style={{display: "flex", flexGrow:2, flexDirection: "column", marginBottom: 2}}>
          <View style={{alignItems: "center"}}>
          <Text style={styles.headerTitleRow1}>BADAN KARANTINA INDONESIA</Text>
          <Text style={styles.headerTitleRow2}>BALAI BESAR KARANTINA HEWAN, IKAN DAN TUMBUHAN</Text>
          <Text style={[styles.headerTitleRow2, {marginBottom: 2}]}>SULAWESI SELATAN</Text>
          <Text style={styles.headerTitleRow3}>JALAN PERINTIS KEMERDEKAAN KM 12, MAKASSAR 90241 TELEPON (0411) 895 8810</Text>
          <Text style={styles.headerTitleRow3}>JALAN KAPASA RAYA NO 17 KM 14 Daya, MAKASSAR 90241</Text>
          <Text style={styles.headerTitleRow3}>WEBSITE : www.karantinaindonesia.go.id</Text>
          <Text style={styles.headerTitleRow3}>EMAIL : bbkp-makassar@gmail.com</Text>
          </View>
        </View>
        {/* <View style={styles.spaceVLogo}></View> */}
        {/* {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) => {
          if (p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND'
                || p.q.zItems[el1].metodePengujianSampel === 'RBT' 
                || p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' 
                || p.q.zItems[el1].metodePengujianSampel === 'TPC'
                || p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA'
                || p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER'  
                ) {
            return <Image
              style={styles.logo2}
              src={logoKan}
            />
          }
          }
        )} */}
      </View>
      {/* <View style={styles.headerRowRight}>
        <Text>Form No : 5.4.4.2</Text>
      </View> */}
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
        {/* <Text style={styles.headerTitle11}>Laporan / Sertifikat ini diberikan kepada :</Text> */}
      </View>
      <View style={styles.header1Table}>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Nama / Instansi Pemilik Sampel</Text>
              </View>
              <View style={styles.header1Content50}>
                <Text style={styles.header1TableCell}>: {p.q.namaPemilikSampel}</Text>
              </View>
        </View>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Alamat</Text>
              </View>
              <View style={styles.header1Content50}>
                <Text style={styles.header1TableCell}>: {p.q.alamatPemilikSampel}</Text>
              </View>
        </View>
        <View style={styles.header1TableRow}>
              <View style={styles.header1Col30}>
                <Text style={styles.header1TableCell}>Ket. Asal / Tujuan </Text>
              </View>
              <View style={styles.header1Content50}>
                <Text style={styles.header1TableCell}>: {p.q.asalTujuanSampel}</Text>
              </View>
        </View>
      </View>
      <View style={[styles.marginV10, styles.marginL15]}>
        {/* <Text style={styles.headerTitle11}>Yang telah mengirim sampel untuk pengujian Laboratorium, Identitas sampel, jenis dan hasil pengujian sebagai berikut : </Text> */}
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
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol10}>
            <Text style={styles.tableCellHeader}>Jumlah Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Metode Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Hasil Uji</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Keterangan</Text>
          </View>
        </View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View key={key1} style={styles.tableRow}>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol10}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jumlahSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>
                {
                p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND' ? 'Titer Antibodi terhadap virus Avian Influenza dan Newcastle Disease' 
                : p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' ? 'Titer Antibodi terhadap virus Rabies' 
                : p.q.zItems[el1].metodePengujianSampel === 'TPC' ? 'Angka Lempeng Total atau Total Plate Count'  // cemaran mikroba ?
                : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA' ? 'Mikroskopis Trypanosoma sp.' 
                : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER' ? 'Mikroskopis Trypanosoma sp.' 
                : p.q.zItems[el1].metodePengujianSampel === 'RBT' ? 'Deteksi antibodi virus Rabies' 
                : p.q.zItems[el1].targetPengujianSampel 
                /* {
                p.q.zItems[el1].targetPengujianSampel === 'Titer Antibodi' ? 'Titer antibodi terhadap virus Avian Influenza dan Newcastle Disease' 
                  : p.q.zItems[el1].targetPengujianSampel === 'RBT' ? 'Deteksi Antibodi terhadap bakteri Brucella sp.' 
                  // : p.q.zItems[el1].targetPengujianSampel === 'RBT' ? 'Deteksi Antibodi terhadap bakteri Brucella sp.' 
                  : p.q.zItems[el1].targetPengujianSampel
                } */}
              </Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{
              p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND' ? 'OIE 2018 Chapter 3.3.4 hal 430 – 432 dan OIE 2018 Chapter 3.3.14' 
                : p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' ? 'OIE 2018 Chapter 3.1.17 hal 596-597' 
                : p.q.zItems[el1].metodePengujianSampel === 'TPC' ? 'SNI 2897 : 2008 butir 4.2'  // cemaran mikroba ?
                : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA' ? 'OIE 2018 Chapter 3.1.21 hal 662-663' 
                : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER' ? 'OIE 2018 Chapter 3.1.21 hal 662-663' 
                // : p.q.zItems[el1].metodePengujianSampel.include('TRYPANOSOMA') ? 'OIE 2018 chapter 3.1.21. hal 662 - 663' 
                : p.q.zItems[el1].metodePengujianSampel === 'RBT' ? 'OIE 2018 Chapter 3.1.4 hal 368-369' 
                : p.q.zItems[el1].metodePengujianSampel 
              }</Text>
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
            <View style={styles.tableCol15}>
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
            <View style={{width:100}}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            {/* <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Administrasi</Text> */}
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            {/* <Text style={styles.textUnderline}>( {p.q.manajerAdministrasiAdminLab} )</Text>
            <Text>NIP. {p.q.nipManajerAdministrasiAdminLab}</Text> */}
            </View>
          </View>
          <View style={styles.spaceV150}></View>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Image
              style={styles.logo}
              src={
                p.q.manajerTeknisAdminLab === 'Drh. Rizka Indriani, M. Sc' ? qrRizka 
                  : p.q.manajerTeknisAdminLab === 'drh. Indra Dewa, M.Si' ? qrIndra 
                  : p.q.manajerTeknisAdminLab === 'drh. Nur Setyawan' ? qrNur 
                  : p.q.manajerTeknisAdminLab === 'drh. Anak Agung Istri Agung Mirah Dwija, M. Si' ? qrMirah 
                  : p.q.manajerTeknisAdminLab === 'drh. Agus Setiawan, M.Sc' ? qrAgus 
                  : p.q.manajerTeknisAdminLab === 'drh. Ahmad Nadif, M.Si' ? qrAhmad 
                  : p.q.manajerTeknisAdminLab === 'drh. Novia Anggraini' ? qrNovia 
                  : p.q.manajerTeknisAdminLab === 'drh. Intarti, M.Si' ? qrIntarti 
                  : qrRizka
            } 
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