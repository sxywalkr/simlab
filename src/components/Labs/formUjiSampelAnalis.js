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
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { logoBalai, logoKan, qrAgus, qrAhmad, qrIndra, qrIntarti, qrMirah, qrNovia, qrNur, qrRizka } from '../../constants/svg';

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
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Analis Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.ANALIS_DETAIL} component={SampelDetail} />
            <Route exact path={ROUTES.ANALIS} component={SampelAll} />
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
      .orderByChild('tanggalMasuksampel')
      .limitToLast(600)
      // .equalTo('Sampel di Analis')
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          snap.forEach(el => {
            console.log(el.val());
            if (
              el.val().flagActivity === 'Permohonan pengujian diteruskan ke analis'
              || el.val().flagActivity === 'Sampel selesai diuji oleh Analis'
              || el.val().flagActivity === 'Laporan Hasil Uji di Admin Lab'
              // && el.val().flagStatusProses !== 'Laporan Hasil Uji di Admin Lab'
            ) {
              a.push({
                idPermohonanUji: el.val().idPermohonanUji,
                kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
                tanggalMasukSampel: el.val().tanggalMasukSampel,
                nomorAgendaSurat: el.val().nomorAgendaSurat,
                namaPemilikSampel: el.val().namaPemilikSampel,
                alamatPemilikSampel: el.val().alamatPemilikSampel,
                asalTujuanSampel: el.val().asalTujuanSampel,
                petugasPengambilSampel: el.val().petugasPengambilSampel,
                flagActivity: el.val().flagActivity,
                flagStatusProses: el.val().flagStatusProses,
                tanggalUjiSampelAnalis: el.val().tanggalUjiSampelAnalis,
                penyeliaAnalis: el.val().penyeliaAnalis,
                nipPenyeliaAnalis: el.val().nipPenyeliaAnalis,
                penerimaSampelAnalisLab: el.val().penerimaSampelAnalisLab,
                nipPenerimaSampelAnalisLab: el.val().nipPenerimaSampelAnalisLab,
                zItems: el.val().zItems,
              })
            }
          });
          const sortedItems = a.slice().sort((a, b) => new Date(b.tanggalMasukSampel) - new Date(a.tanggalMasukSampel))
          // const sortedItems = a.sort((a, b) => a.tanggalMasukSampel - b.tanggalMasukSampel)

          this.setState({
            items: sortedItems,
            // items: a,
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
      flagActivity: 'Proses ke pelaksana teknis'
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
                      <TableCell>Nomor Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={2}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "dd MMM yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{el.flagActivity}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.ANALIS}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                          >
                            Detail
                          </Button>
                        </TableCell>
                        <TableCell>
                          {
                            (el.flagActivity === 'Laporan Hasil Uji di Admin Lab'
                              || el.flagActivity === 'Sampel selesai diuji oleh Analis')
                              // (el.flagActivity === 'Sampel selesai diuji oleh Analis') 
                              ?
                              <PDFDownloadLink document={<Quixote q={el} />} fileName="laporan-hasil-pengujian.pdf">
                                {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Pengujian')}
                              </PDFDownloadLink>
                              :
                              'Laporan Hasil Pengujian belum tersedia.'
                          }
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

///////////////////////////// UBAH DATA
class SampelDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      open2: false,
      openBahan: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampelAdminLab: '',
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
      tanggalUjiSampelAnalis: new Date(),
      managerTeknisAnalis: '',
      managerAdministrasiAnalis: '',
      penyeliaAnalis: '',
      namaAnalis: '',
      metodePengujianSampel: '',
      metodePemeriksaanSampel: '',
      targetPengujianSampel: '',
      hasilUjiSampel: '',
      hasilUjiSampelBaris2: '',
      hasilUjiSampelBaris3: '',
      hasilUjiSampelBaris4: '',
      hasilUjiSampelBaris5: '',
      hasilUjiSampelBaris6: '',
      hasilUjiSampelBaris7: '',
      hasilUjiSampelBaris8: '',
      hasilUjiSampelBaris9: '',
      hasilUjiSampelBaris10: '',
      keteranganSampel: '',
      selectMetodePemeriksaanSampel: '',
      selectTargetPengujianSampel: '',
      selectBahan: '',
      thisP: '',
      thisQ: '',
      thisR: '',
      thisS: '',
      namaBahan: '',
      jumlahBahan: '',
      satuanBahan: '',
      bahanOut: '',
      //tanggalBahanTerpakai: '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({
            items: a,
            loading: false,
            idPermohonanUji: snap.val().idPermohonanUji,
            kodeUnikSampelAdminLab: snap.val().kodeUnikSampelAdminLab,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
            penerimaSampelAnalisLab: snap.val().penerimaSampelAnalisLab,
            nipPenerimaSampelAnalisLab: this.state.nipPenerimaSampelAnalisLab,
            tanggalUjiSampelAnalis: snap.val().tanggalUjiSampelAnalis,
            penyeliaAnalis: snap.val().penyeliaAnalis,
            nipPenyeliaAnalis: snap.val().nipPenyeliaAnalis,
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
            if (res.val().jabatanUserForm === 'Penyelia') {
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
    this.props.firebase.db.ref('masterData/bahan')
      .once('value', snap2 => {
        if (snap2.val()) {
          const b2 = [];
          snap2.forEach((res) => {
            b2.push({
              idBahan: res.val().idBahan,
              kodeBahan: res.val().kodeBahan,
              namaBahan: res.val().namaBahan,
              satuanBahan: res.val().satuanBahan,
            })
          })
          this.setState({
            selectBahan: b2,
          });
        }
      })
    this.props.firebase.db.ref('bahanOut').orderByChild('bahanIdPermohonanUji').equalTo(this.props.match.params.id)
      .on('value', snap3 => {
        if (snap3.val()) {
          const b3 = [];
          snap3.forEach((res) => {
            b3.push({
              bahanId: res.key,
              bahanTanggalUjiSampelAnalis: res.val().bahanTanggalUjiSampelAnalis,
              bahanNama: res.val().bahanNama,
              bahanJumlah: res.val().bahanJumlah,
              bahanSatuan: res.val().bahanSatuan,
              bahanNamaAnalis: res.val().bahanNamaAnalis,
              bahanIdPermohonanUji: res.val().bahanIdPermohonanUji,
              bahanBulanMasukSampel: res.val().bahanBulanMasukSampel,
              bahanKodeUnikSampelAdminLab: res.val().bahanKodeUnikSampelAdminLab,
            })
          })
          this.setState({
            bahanOut: b3,
          });
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

  handleClickOpenBahan = () => {
    this.setState({ openBahan: true });
  };

  handleCloseBahan = () => {
    this.setState({ openBahan: false });
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      tanggalUjiSampelAnalis: this.state.tanggalUjiSampelAnalis === undefined ? dateFnsFormat(new Date(), "dd MMM yyyy") : this.state.tanggalUjiSampelAnalis.toString(),
      managerTeknisAnalis: this.state.managerTeknisAnalis,
      managerAdministrasiAnalis: this.state.managerAdministrasiAnalis,
      penyeliaAnalis: this.state.penyeliaAnalis,
      nipPenyeliaAnalis: this.state.nipPenyeliaAnalis,
      namaAnalis: this.state.namaAnalis,
      flagActivity: 'Sampel selesai diuji oleh Analis',
      flagStatusProses: 'Proses di Pelaksana Teknis',
    })
  }

  handleSubmitBahan = () => {
    this.setState({ openBahan: false });
    this.props.firebase.db.ref('bahanOut/').push({
      bahanTanggalUjiSampelAnalis: this.state.tanggalUjiSampelAnalis === undefined ? dateFnsFormat(new Date(), "yyyy-MMM-dd") : this.state.tanggalUjiSampelAnalis.toString(),
      bahanNama: this.state.namaBahan,
      bahanJumlah: this.state.jumlahBahan,
      bahanSatuan: this.state.satuanBahan,
      bahanNamaAnalis: this.state.items[0].penerimaSampelAnalisLab,
      bahanIdPermohonanUji: this.state.idPermohonanUji,
      bahanBulanMasukSampel: this.state.items[0].bulanMasukSampel,
      bahanKodeUnikSampelAdminLab: this.state.items[0].kodeUnikSampelAdminLab,
    })
  }

  handleDeleteBahan = (a) => {
    this.props.firebase.db.ref('bahanOut/' + a).remove()
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.thisP).update({
      flagActivityDetail: 'Sampel selesai diuji oleh Analis'
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ).update({
      hasilUjiSampel: this.state.hasilUjiSampel,
      hasilUjiSampelBaris2: this.state.hasilUjiSampelBaris2,
      hasilUjiSampelBaris3: this.state.hasilUjiSampelBaris3,
      hasilUjiSampelBaris4: this.state.hasilUjiSampelBaris4,
      hasilUjiSampelBaris5: this.state.hasilUjiSampelBaris5,
      hasilUjiSampelBaris6: this.state.hasilUjiSampelBaris6,
      hasilUjiSampelBaris7: this.state.hasilUjiSampelBaris7,
      hasilUjiSampelBaris8: this.state.hasilUjiSampelBaris8,
      hasilUjiSampelBaris9: this.state.hasilUjiSampelBaris9,
      hasilUjiSampelBaris10: this.state.hasilUjiSampelBaris10,
      keteranganSampel: this.state.keteranganSampel,
    })

    this.setState({
      hasilUjiSampel: '',
      hasilUjiSampelBaris2: '',
      hasilUjiSampelBaris3: '',
      hasilUjiSampelBaris4: '',
      hasilUjiSampelBaris5: '',
      hasilUjiSampelBaris6: '',
      hasilUjiSampelBaris7: '',
      hasilUjiSampelBaris8: '',
      hasilUjiSampelBaris9: '',
      hasilUjiSampelBaris10: '',
      keteranganSampel: '',
    })

  }

  updateHasilPengujian = (p, q, r, s) => {
    this.setState({ open2: true });
    this.setState({
      thisP: p, thisQ: q, thisR: r, thisS: s
    })
  };

  handleDateChange = date => {
    this.setState({ tanggalUjiSampelAnalis: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'penyeliaAnalis') {
      const filtered = this.state.selectUserformPenyelia.filter(str => {
        return str.namaUserForm === event.target.value;
      });
      this.setState({ nipPenyeliaAnalis: filtered[0].nipUserForm });
    }
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });

  };

  onChange3 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'namaBahan') {
      this.props.firebase.db.ref('masterData/bahan').orderByChild('namaBahan').equalTo(event.target.value).once('value', snap => {
        const b3 = [];
          snap.forEach((res) => {
            b3.push({
              satuanBahan: res.val().satuanBahan,
            })
          })
          // console.log(b3[0].satuanBahan)
          this.setState({
            satuanBahan: b3[0].satuanBahan,
          });
      })
    }
  }

  render() {
    // console.log(this.state);
    const {
      loading, items,
      tanggalTerimaSampelAdminLab, PenerimaSampelAdminLab, ManajerTeknisAdminLab, ManajerAdministrasiAdminLab,
      tanggalUjiSampelAnalis, penyeliaAnalis,
      hasilUjiSampel, hasilUjiSampelBaris2, hasilUjiSampelBaris3, hasilUjiSampelBaris4, hasilUjiSampelBaris5, hasilUjiSampelBaris6, hasilUjiSampelBaris7, hasilUjiSampelBaris8,
      hasilUjiSampelBaris9, hasilUjiSampelBaris10,
      keteranganSampel, penerimaSampelAnalisLab, selectUserformPenyelia, namaBahan, selectBahan, jumlahBahan, satuanBahan, bahanOut,
    } = this.state;
    const isInvalid = tanggalTerimaSampelAdminLab === '' || PenerimaSampelAdminLab === '' || ManajerTeknisAdminLab === '' ||
      ManajerAdministrasiAdminLab === '';
    const isInvalid2 = hasilUjiSampel === '';
    const isInvalidBahan = namaBahan === '' || jumlahBahan === '' || penerimaSampelAnalisLab === ''
    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
              Proses Sampel
            </Button>{' '}
            <Button variant="contained" onClick={this.handleClickOpenBahan}>
              Input Bahan
            </Button>{' '}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.ANALIS}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampelAdminLab}</Typography>
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sample : {dateFnsFormat(new Date(el.tanggalMasukSampel), "dd MMM yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sample : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sample : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Target Pengujian</TableCell>
                      {/* <TableCell>Unit Pengujian</TableCell> */}
                      <TableCell>Hasil Pengujian</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) =>
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].metodePengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].targetPengujianSampel}</TableCell>
                        {/* <TableCell>{el.zItems[el1].unitPengujianSampel}</TableCell> */}
                        <TableCell>
                          <div style={{ display: "flex", flexDirection: "column" }} >
                            <Typography>{el.zItems[el1].hasilUjiSampel}</Typography>
                            {!!el.zItems[el1].hasilUjiSampelBaris2 && <Typography>{el.zItems[el1].hasilUjiSampelBaris2}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris3 && <Typography>{el.zItems[el1].hasilUjiSampelBaris3}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris4 && <Typography>{el.zItems[el1].hasilUjiSampelBaris4}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris5 && <Typography>{el.zItems[el1].hasilUjiSampelBaris5}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris6 && <Typography>{el.zItems[el1].hasilUjiSampelBaris6}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris7 && <Typography>{el.zItems[el1].hasilUjiSampelBaris7}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris8 && <Typography>{el.zItems[el1].hasilUjiSampelBaris8}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris9 && <Typography>{el.zItems[el1].hasilUjiSampelBaris9}</Typography>}
                            {!!el.zItems[el1].hasilUjiSampelBaris10 && <Typography>{el.zItems[el1].hasilUjiSampelBaris10}</Typography>}
                          </div>
                        </TableCell>

                        {/* {!!p.q.zItems[el1].hasilUjiSampelBaris2 && <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampelBaris2}</Text>} */}
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.updateHasilPengujian(el.idPermohonanUji, el1, el.zItems[el1].metodePengujianSampel, el.zItems[el1].targetPengujianSampel)}>
                            Update hasil
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            <div>
              {loading ? <Typography>Loading...</Typography> :
                <div style={{ marginTop: 30 }}>
                  <Typography variant='h6' gutterBottom>Bahan Terpakai</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Bahan</TableCell>
                        <TableCell>Jumlah Bahan</TableCell>
                        <TableCell>Satuan Bahan</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    {!loading && !!bahanOut && bahanOut.map((el, key) =>
                      <TableBody key={key}>
                        <TableRow>
                          <TableCell>{el.bahanNama}</TableCell>
                          <TableCell>{el.bahanJumlah}</TableCell>
                          <TableCell>{el.bahanSatuan}</TableCell>
                          <TableCell>
                            <Button variant="text" color="secondary" onClick={() => this.handleDeleteBahan(el.bahanId)}
                            // disabled={value[1] === "Belum ada sampel uji" || value[1] === "Data sudah lengkap" ? false : true}
                            >
                              Hapus
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </div>
              }
            </div>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Proses Uji Sampel oleh Analis</DialogTitle>
              <DialogContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 350 }}
                    label="Tanggal Uji Sampel oleh Analis"
                    value={tanggalUjiSampelAnalis}
                    format={'dd MMM yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penyeliaAnalis">Penyelia</InputLabel>{" "}
                  <Select
                    value={penyeliaAnalis}
                    onChange={this.onChange('penyeliaAnalis')}
                    style={{ width: 400 }}
                    name="penyeliaAnalis"
                  >
                    {!!selectUserformPenyelia && Object.keys(selectUserformPenyelia).map((el) =>
                      <MenuItem key={el} value={selectUserformPenyelia[el].namaUserForm}>{selectUserformPenyelia[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "50%", marginBottom: 10 }}
                  variant="outlined"
                  // onChange={this.onChange}
                  disabled={true}
                  value={penerimaSampelAnalisLab}
                />
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
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
              aria-labelledby="form-dialog-title2"
            >
              <DialogTitle id="form-dialog-title2">Hasil Uji Sampel oleh Analis</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="hasilUjiSampel"
                  label="Hasil Uji Sampel"
                  value={hasilUjiSampel}
                  onChange={this.onChange2('hasilUjiSampel')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris2"
                  label="Hasil Uji Sampel Baris 2"
                  value={hasilUjiSampelBaris2}
                  onChange={this.onChange2('hasilUjiSampelBaris2')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris3"
                  label="Hasil Uji Sampel Baris 3"
                  value={hasilUjiSampelBaris3}
                  onChange={this.onChange2('hasilUjiSampelBaris3')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris4"
                  label="Hasil Uji Sampel Baris 4"
                  value={hasilUjiSampelBaris4}
                  onChange={this.onChange2('hasilUjiSampelBaris4')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris5"
                  label="Hasil Uji Sampel Baris 5"
                  value={hasilUjiSampelBaris5}
                  onChange={this.onChange2('hasilUjiSampelBaris5')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris6"
                  label="Hasil Uji Sampel Baris 6"
                  value={hasilUjiSampelBaris6}
                  onChange={this.onChange2('hasilUjiSampelBaris6')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris7"
                  label="Hasil Uji Sampel Baris 7"
                  value={hasilUjiSampelBaris7}
                  onChange={this.onChange2('hasilUjiSampelBaris7')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris8"
                  label="Hasil Uji Sampel Baris 8"
                  value={hasilUjiSampelBaris8}
                  onChange={this.onChange2('hasilUjiSampelBaris8')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris9"
                  label="Hasil Uji Sampel Baris 9"
                  value={hasilUjiSampelBaris9}
                  onChange={this.onChange2('hasilUjiSampelBaris9')}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="hasilUjiSampelBaris10"
                  label="Hasil Uji Sampel Baris 10"
                  value={hasilUjiSampelBaris10}
                  onChange={this.onChange2('hasilUjiSampelBaris10')}
                  fullWidth
                />
                <TextField
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
                  variant="contained"
                  onClick={this.handleSubmit2}
                  disabled={isInvalid2}
                  color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.openBahan}
              onClose={this.handleCloseBahan}
              aria-labelledby="form-dialog-title2"
            >
              <DialogTitle id="form-dialog-title2">Bahan Yang Digunakan</DialogTitle>
              <DialogContent>
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="namaBahan">Nama Bahan</InputLabel>{" "}
                  <Select
                    value={namaBahan}
                    onChange={this.onChange3('namaBahan')}
                    style={{ width: 400 }}
                    name="namaBahan"
                  >
                    {!!selectBahan && Object.keys(selectBahan).map((el) =>
                      <MenuItem key={el} value={selectBahan[el].namaBahan}>{selectBahan[el].namaBahan}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  id="jumlahBahan"
                  label="Jumlah Bahan"
                  value={jumlahBahan}
                  type='number'
                  onChange={this.onChange3('jumlahBahan')}
                  fullWidth
                />
                {/* <TextField
                  margin="dense"
                  id="satuanBahan"
                  label="Satuan Bahan"
                  value={satuanBahan}
                  disabled={true}
                  onChange={this.onChange2('satuanBahan')}
                  fullWidth
                /> */}
                <Typography style={{ marginTop: 20 }} variant="subtitle1" gutterBottom>Satuan Bahan : {satuanBahan}</Typography>
                <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "50%", marginTop: 20 }}
                  variant="outlined"
                  // onChange={this.onChange}
                  disabled={true}
                  value={penerimaSampelAnalisLab}
                />
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleCloseBahan}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={this.handleSubmitBahan}
                  disabled={isInvalidBahan}
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
    margin: 5,
    fontSize: 10
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
  tableHeaderCol5: {
    width: "5%",
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
  tableHeaderCol15: {
    width: "15%",
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
  footerRow: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: '20%',
  },
  footerRow2: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
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
        <Text>Form No : 5.4.4.1</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>LAPORAN HASIL PENGUJIAN</Text>
      </View>
      <View style={styles.marginV10}>
        <Text style={styles.headerTitle11}>Tanggal Pengujian Sampel : {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol5}>
            <Text style={styles.tableCellHeader}>No</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Kode Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Target Pest / Parameter Uji</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Hasil Pengujian</Text>
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
              <Text style={styles.tableCell}>{p.q.kodeUnikSampelAdminLab}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
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
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].keteranganSampel}</Text>
            </View>
          </View>
        )}

      </View>
      <View style={styles.footerRow}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>Penyelia</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.penyeliaAnalis} )</Text>
            <Text>NIP. {p.q.nipPenyeliaAnalis}</Text>
          </View>
          <View style={styles.spaceV400}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11, styles.headerRowRight]}>Makassar, {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
            <Text>{' '}</Text>
            <Text>Analis</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.penerimaSampelAnalisLab} )</Text>
            <Text>NIP. {p.q.nipPenerimaSampelAnalisLab}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
}

// *********************************************** end PDF part


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);