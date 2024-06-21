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
import MUIDataTable from "mui-datatables";
import Box from '@material-ui/core/Box';
// import CustomToolbarSelect from "../AppSetting/CustomToolbarSelect";
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
// import exportCSV from '../Labs/exportCSV';
// import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import * as jsonexport from "jsonexport/dist";
// import { CSVLink } from "react-csv";
// import { Parser } from 'json2csv';

import { logoBalai, logoKan, qrAgus, qrAhmad, qrIndra, qrIntarti, qrMirah, qrNovia, qrNur, qrRizka } from '../../constants/svg';

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFLHU } from '../Wilker/formUjiSampel';


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
      itemsB: null,
      open: false,
      formMode: [],
      selectBulan: '',
      selectTahun: '',
      bahanOut: null,
      namaWilkerxxx: 'loading...',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    // const bb = '--';
    const a = [];
    this.props.firebase.db.ref('samples')
      .orderByChild('tanggalMasuksampel')
      .limitToLast(100)
      // .orderByChild('flagActivity')
      // .equalTo('Submit sampel ke admin lab')
      .on('value', snap => {
        if (snap.val()) {
          
          snap.forEach(el => {            
            
            // console.log(el.val())
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
              flagActivityDetail: el.val().flagActivityDetail,
              flagStatusProses: el.val().flagStatusProses,
              tanggalTerimaSampelAdminLab: el.val().tanggalTerimaSampelAdminLab,
              unitPengujianSampel: el.val().unitPengujianSampel,
              tanggalUjiSampelAnalis: el.val().tanggalUjiSampelAnalis,
              kondisiSampel: el.val().kondisiSampel,
              manajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
              nipManajerAdministrasiAdminLab: el.val().nipManajerAdministrasiAdminLab,
              manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
              nipManajerTeknisAdminLab: el.val().nipManajerTeknisAdminLab,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              // nomorAgendaSurat: el.val().nomorAgendaSurat,
              formLaporanKeterangan: el.val().formLaporanKeterangan,
              formLaporanKesimpulan: el.val().formLaporanKesimpulan,
              keteranganPengujianDitolak: el.val().keteranganPengujianDitolak,
              zItems: el.val().zItems,
              // kodeUnikSampel: el.val().kodeUnikSampel,
              // tanggalMasukSampel: dateFnsFormat(new Date(el.val().tanggalMasukSampel), "dd MMM yyyy"),
              // nomorAgendaSurat: el.val().nomorAgendaSurat,
              // namaPemilikSampel: el.val().namaPemilikSampel,
              // asalTujuanSampel: el.val().asalTujuanSampel,
              flagStatusProses2: [el.val().flagStatusProses, el.val().flagActivity, el.val().keteranganPengujianDitolak],
              Detail: [el.val().idPermohonanUji, el.val()],
              Report: [el.val().flagActivity, el.val()],
              Action: [el.val().idPermohonanUji, el.val().flagActivityDetail],
              kodeAreaWilker: el.val().areaWilker,
              namaAreaWilker: el.val().areaWilker === '0501' ? 'Pelabuhan Laut Soekarno Hatta' 
                : el.val().areaWilker === '0502' ? 'Pelabuhan Paotere'
                : el.val().areaWilker === '0503' ? 'Pelabuhan Bulukumba' 
                : el.val().areaWilker === '0504' ? 'Pelabuhan Jeneponto' 
                : el.val().areaWilker === '0505' ? 'Bandara Hasanuddin' 
                : el.val().areaWilker === '0508' ? 'Pelabuhan Tuju Tuju' 
                : el.val().areaWilker === '0509' ? 'Pelabuhan Bajoe' 
                : '--',
            })
          });
          
          // // console.log(a);
          // const aba = a;
          // a.forEach(xx => {
          //   // xx.namaAreaWilker = xx.idPermohonanUji
          //   this.props.firebase.db.ref(`masterData/wilker`)
          //   .orderByChild('kodeWilker').equalTo(xx.kodeAreaWilker)
          //   .on('value', snap => {
          //     if (snap.val()) {
          //       snap.forEach(el => {
          //         console.log(el.val().namaWilker);
          //         xx.namaAreaWilker = el.val().namaWilker;
          //       })
          //       this.setState({
          //         items: aba,
          //         // itemsB: b,
          //         loading: false,
          //       });
          //     }            
          //   })
          // })

          // console.log(a);

          this.setState({
            items: a,
            // itemsB: b,
            loading: false,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
      })

      // const ccc = a;
      // if (a) {
      //   console.log(ccc);
      //   ccc.forEach(xl => {
      //     const ok = '--x--';
      //     console.log(xl.val())
      //     // this.props.firebase.db.ref(`masterData/wilker`)
      //     //   .orderByChild('kodeWilker').equalTo(xl.val().kodeAreaWilker)
      //     //   .once('value', snap => {
      //     //     if (snap.val()) {
      //     //       snap.forEach(el => {
      //     //         // console.log(xl.val().kodeAreaWilker)
      //     //         // ccc.namaAreaWilker = el.val().namaWilker;
      //     //       })
      //     //       // this.setState({
      //     //       //   items: ccc,
      //     //       //   loading: false,
      //     //       // });
      //     //     }            
      //     //   })
        
  
      //   })
      // }
      

      


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
      flagActivity: 'Permohonan pengujian diteruskan ke analis',
      flagActivityDetail: 'Permohonan pengujian diteruskan ke analis',
      flagStatusProses: 'Sampel di Analis'
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
      name: "namaAreaWilker",
      label: 'Area Wilker',
      options: { filter: false }
    },
    // {
    //   name: "namaAreaWilker",
    //   label: 'Area Wilker',
    //   options: { 
    //     filter: false,
    //     customBodyRender: (value) =>  {
    //       // const bbb = 'loading...';
    //       // this.props.firebase.db.ref(`masterData/wilker`)
    //       //   .orderByChild('kodeWilker').equalTo(value)
    //       //   .once('value', snap => {
    //       //     // console.log((snap.val()).val().namaWilker);
    //       //     if (snap.val()) {
    //       //       snap.forEach(el => {
    //       //         // console.log(el.val().namaWilker);
    //       //         // bbb.push( {namaWilkerx : el.val().namaWilker})
    //       //         // return el.val().namaWilker;
    //       //         this.setState({
    //       //           namaWilkerxxx: el.val().namaWilker,
    //       //         });
                  
    //       //       })
    //       //     } 
    //       //   })
    //       // // console.log(ccc);
    //       return (
    //         <Text>{value}</Text>
    //       )
    //     }}
    // },
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
      name: "flagStatusProses2",
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
                pathname: `${ROUTES.ADMINLAB}/${value[0]}`,
                data: value[1],
              }}
            >
              Detail
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
              {
                value[0] === 'Laporan Hasil Uji di Admin Lab' ?
                  <PDFDownloadLink document={<PDFLHUAdminLab q={value[1]} />} fileName="laporan-hasil-uji.pdf">
                    {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                  </PDFDownloadLink>
                  :
                  'Laporan Hasil Uji belum tersedia.'
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
            // console.log({value})
            <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeAnalysis(value[0])}
              disabled={value[1] === "Update detail by admin lab done" ? false : true}
            >
              Submit ke Analis
            </Button>
          );
        }
      }
    },
  ]
  options = {
    filterType: 'dropdown',
    rowsPerPage: 50,
    selectableRows: false,
    download: false,
    print: false,
    search: false,
    // customSort: (data, colIndex, order) => {
    //   return data.sort((a, b) => {
    //     return (a.data[colIndex].length < b.data[colIndex].length ? -1: 1 ) * (order === 'desc' ? 1 : -1);
    //   });
    // }
  };

  onChange = name => event => {
    // console.log(event.target.value)
    this.setState({
      [name]: event.target.value,
    });
    // if (name === 'selectBulan') {
    //   this.proses(event.target.value)
    // }
  };

  onChangeTahun = name => event => {
    // console.log(name)
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'selectTahun') {
      this.proses(this.state.selectBulan, event.target.value)
    }
  };

  handleShowNameWilker = (qKodeWilker) => {
    this.props.firebase.db.ref(`masterData/wilker`)
      .orderByChild('kodeWilker').equalTo(qKodeWilker)
      .once('value', snap => {
        // print(snap);
      })
  }


  proses = (a, bb) => {
    // console.log(a,bb);
    this.props.firebase.db.ref(`samples`)
      .orderByChild('bulanMasukSampel').equalTo(a)
      .once('value', snap => {
        // console.log(a)
        if (snap.val()) {
          // console.log(snap.hasChild('zItems'))
          const b = [];
          // if (snap.hasChild('zItems')) {
          snap.forEach(el => {
            // console.log(el.hasChild('zItems'))
            if (el.hasChild('zItems')) {
              // console.log(Object.keys(el.val().zItems).map((key) => el.val().zItems[key].hasilUjiSampel))
              b.push({
                // idPermohonanUji: el.val().idPermohonanUji,
                // kodeUnikSampel: el.val().kodeUnikSampel,
                tanggalMasukSampel: el.val().tanggalMasukSampel,
                tanggalTerimaSampelAdminLab: el.val().tanggalTerimaSampelAdminLab,
                tanggalUjiSampelAnalis: el.val().tanggalUjiSampelAnalis,
                nomorAgendaSurat: el.val().nomorAgendaSurat,
                namaPemilikSampel: el.val().namaPemilikSampel,
                alamatPemilikSampel: el.val().alamatPemilikSampel,
                asalTujuanSampel: el.val().asalTujuanSampel,
                flagActivity: el.val().flagActivity,
                flagActivityDetail: el.val().flagActivityDetail,
                flagStatusProses: el.val().flagStatusProses,
                unitPengujianSampel: el.val().unitPengujianSampel,
                // kondisiSampel: el.val().kondisiSampel,
                formLaporanKesimpulan: el.val().formLaporanKesimpulan,
                formLaporanKeterangan: el.val().formLaporanKeterangan,
                kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
                // nomorAgendaSurat: el.val().nomorAgendaSurat,
                // formLaporanKeterangan: el.val().formLaporanKeterangan,
                // formLaporanKesimpulan: el.val().formLaporanKesimpulan,
                keteranganPengujianDitolak: el.val().keteranganPengujianDitolak,
                statusLaporanSPP: el.val().statusLaporanSPP,
                manajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
                nipManajerAdministrasiAdminLab: el.val().nipManajerAdministrasiAdminLab,
                manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
                nipManajerTeknisAdminLab: el.val().nipManajerTeknisAdminLab,
                penerimaSampelAdminLab: el.val().penerimaSampelAdminLab,
                nipPenerimaSampelAdminLab: el.val().nipPenerimaSampelAdminLab,
                penerimaSampelAnalisLab: el.val().penerimaSampelAnalisLab,
                nipPenerimaSampelAnalisLab: el.val().nipPenerimaSampelAnalisLab,
                penyeliaAnalis: el.val().penyeliaAnalis,
                nipPenyeliaAnalis: el.val().nipPenyeliaAnalis,
                petugasPengambilSampel: el.val().petugasPengambilSampel,
                nipUser: el.val().nipUser,
                // zItems: Object.keys(el.val().zItems).map((key) => el.val().zItems[key]),
                zHasilUjiSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].hasilUjiSampel),
                zJenisSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].jenisSampel),
                zJumlahSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].jumlahSampel),
                zKategoriSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].kategoriSample),
                zMetodePengujianSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].metodePengujianSampel),
                zRuangLingkupSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].ruangLingkupSampel),
                zTargetPengujianSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].targetPengujianSampel),
                zKondisiSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].kondisiSampel),
                zKeteranganSampel: Object.keys(el.val().zItems).map((key) => el.val().zItems[key].keteranganSampel),
              })
            }
          });
          // b.filter((val,ind,arr) => 
          //   val.tanggalMasukSampel.substring(0,4) === this.state.selectTahun 
          //   // console.log(val.tanggalMasukSampel.substring(0,4))
          //   );
          // console.log(b.length)
            const filB = b.filter((val) => {
              return val.tanggalMasukSampel.substring(0,4) === bb;
            });
          // console.log(filB)
          this.setState({
            itemsB: filB,
            // loading: false,
          });
          // }
        } else {
          this.setState({
            itemsB: null,
            // loading: false,
          });
        }
      })

      this.props.firebase.db.ref('bahanOut')
            .orderByChild('bahanBulanMasukSampel').equalTo(a)
            .on('value', snap3 => {
              if (snap3.val()) {
                const b3 = [];
                snap3.forEach((res) => {
                  b3.push({
                    // bahanId: res.key,
                    TanggalUjiSampelAnalis: res.val().bahanTanggalUjiSampelAnalis,
                    KodeUnikSampelAdminLab: res.val().bahanKodeUnikSampelAdminLab,
                    NamaAnalis: res.val().bahanNamaAnalis,
                    Nama: res.val().bahanNama,
                    Jumlah: res.val().bahanJumlah,
                    Satuan: res.val().bahanSatuan,
                    // bahanIdPermohonanUji: res.val().bahanIdPermohonanUji,
                    // bahanBulanMasukSampel: res.val().bahanBulanMasukSampel,
                  })
                })
                this.setState({
                  bahanOut: b3,
                  loading: false,
                });
              } else {
                this.setState({
                  bahanOut: null,
                  loading: false,
                });
              }
            })
    // console.log(this.state.itemsB)
  }

  exportFile = () => {
    if (this.state.itemsB !== null) {
      const ws = XLSX.utils.json_to_sheet(this.state.itemsB);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "master data");
      XLSX.writeFile(wb, "Simlab2019.xlsx")
    }
  };

  exportBahan = () => {
    if (this.state.bahanOut !== null) {
      const ws = XLSX.utils.json_to_sheet(this.state.bahanOut);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bahan");
      XLSX.writeFile(wb, "Simlab2019 - Bahan.xlsx")
    }
  };

  render() {
    const { items, loading, selectBulan, selectTahun } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> :
              <div>
                <div style={{ marginBottom: 25 }}>
                  <Grid container spacing={24}>
                    <Grid item xs={12}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="bottom"
                    >
                      <FormControl variant="standard">
                        <InputLabel htmlFor="selectBulan">Bulan</InputLabel>{" "}
                        <Select
                          value={selectBulan}
                          onChange={this.onChange('selectBulan')}
                          style={{ width: 200 }}
                          name="selectBulan"
                        >
                          <MenuItem key={1} value={1}>Januari</MenuItem>
                          <MenuItem key={2} value={2}>Februari</MenuItem>
                          <MenuItem key={3} value={3}>Maret</MenuItem>
                          <MenuItem key={4} value={4}>April</MenuItem>
                          <MenuItem key={5} value={5}>Mei</MenuItem>
                          <MenuItem key={6} value={6}>Juni</MenuItem>
                          <MenuItem key={7} value={7}>Juli</MenuItem>
                          <MenuItem key={8} value={8}>Agustus</MenuItem>
                          <MenuItem key={9} value={9}>September</MenuItem>
                          <MenuItem key={10} value={10}>Oktober</MenuItem>
                          <MenuItem key={11} value={11}>November</MenuItem>
                          <MenuItem key={12} value={12}>Desember</MenuItem>
                        </Select>
                      </FormControl>
                      <div style={{ width: 5 }} />
                      <FormControl variant="standard">
                        <InputLabel htmlFor="selectTahun">Tahun</InputLabel>{" "}
                        <Select
                          value={selectTahun}
                          onChange={this.onChangeTahun('selectTahun')}
                          style={{ width: 200 }}
                          name="selectTahun"
                        >
                          <MenuItem key={1} value={'2020'}>2020</MenuItem>
                          <MenuItem key={2} value={'2021'}>2021</MenuItem>
                          <MenuItem key={3} value={'2022'}>2022</MenuItem>
                          <MenuItem key={4} value={'2023'}>2023</MenuItem>
                          <MenuItem key={5} value={'2024'}>2024</MenuItem>
                        </Select>
                      </FormControl>
                      <div style={{ width: 5 }} />
                      <Button variant="outlined" color="primary" onClick={this.exportFile}
                        disabled={this.state.itemsB === null ? true : false}
                      >
                        Export Sampels
                      </Button>
                      <div style={{ width: 5 }} />
                      <Button variant="outlined" color="primary" onClick={this.exportBahan}
                        disabled={this.state.bahanOut === null ? true : false}
                      >
                        Export Bahan
                      </Button>
                    </Grid>
                  </Grid>
                </div>

                <MUIDataTable
                  // title={"Daftar Sampel"}
                  // data={items ? items : this.state.itemsZ}
                  data={items}
                  columns={this.columns}
                  options={this.options}
                />

                {/* <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nomor Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={3}>Action</TableCell>
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
                          {el.flagStatusProses} {el.flagActivity === 'Sampel tidak dapat diuji' && ' Keterangan: ' + el.keteranganPengujianDitolak}
                        </TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.ADMINLAB}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                          // disabled={el.flagStatusProses === "Sampel di Admin Lab" ? false : true}
                          >
                            Detail
                          </Button>
                        </TableCell>
                        <TableCell>
                          {el.flagActivity === 'Laporan Hasil Uji di Admin Lab' ?
                            <PDFDownloadLink document={<PDFLHU q={el} />} fileName="laporan-hasil-uji.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                            </PDFDownloadLink>
                            :
                            'Laporan Hasil Uji belum tersedia.'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeAnalysis(el.idPermohonanUji)}
                            disabled={el.flagActivityDetail === "Update detail by admin lab done" ? false : true}
                          >
                            Submit ke Analis
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table> */}
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
      openAlert: false,
      openAlertKodeUnik: false,
      openAlertNomorLhu: false,
      openAlertUnitPengujianSampel: false,
      openAlertTanggalMasukSampel: false,
      openAlertManajerAdministrasiAdminLab: false,
      openAlertNamaWilker: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      kodeUnikSampelAdminLab: '',
      nomorAgendaSurat: '',
      nomorLhu: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      ruangLingkupSampel: '',
      unitPengujian: '',
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      selectUnitPengujian: [],
      // tanggalMasukSampel: dateFnsFormat(new Date(), "dd MMM yyyy"),
      tanggalTerimaSampelAdminLab: dateFnsFormat(new Date(), "dd MMM yyyy"),
      tanggalUjiSampelAnalis: '',
      penerimaSampelAdminLab: '',
      penerimaSampelAnalisLab: '',
      manajerTeknisAdminLab: '',
      manajerAdministrasiAdminLab: '',
      thisP: '',
      thisQ: '',
      statusLaporanSPP: false,
      loadingReport: true,
      keteranganPengujianDitolak: '',
      
    };
  }

  componentDidMount() {
    // console.log(this.props);
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
            kodeAreaWilker: snap.val().areaWilker,
            kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
            nomorLhu: snap.val().nomorLhu,
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
            kodeUnikSampelAdminLab: snap.val().kodeUnikSampelAdminLab === undefined ? '' : snap.val().kodeUnikSampelAdminLab,
            tanggalTerimaSampelAdminLab: snap.val().tanggalTerimaSampelAdminLab === undefined ? dateFnsFormat(new Date(), "dd MMM yyyy") : snap.val().tanggalTerimaSampelAdminLab,
            tanggalUjiSampelAnalis: snap.val().tanggalUjiSampelAnalis === undefined ? dateFnsFormat(new Date(), "dd MMM yyyy") : snap.val().tanggalUjiSampelAnalis,
            unitPengujianSampel: snap.val().unitPengujianSampel === undefined ? '' : snap.val().unitPengujianSampel,
            penerimaSampelAdminLab: snap.val().penerimaSampelAdminLab === undefined ? '' : snap.val().penerimaSampelAdminLab,
            penerimaSampelAnalisLab: snap.val().penerimaSampelAnalisLab === undefined ? '' : snap.val().penerimaSampelAnalisLab,
            manajerAdministrasiAdminLab: snap.val().manajerAdministrasiAdminLab === undefined ? '' : snap.val().manajerAdministrasiAdminLab,
            manajerTeknisAdminLab: snap.val().manajerTeknisAdminLab === undefined ? '' : snap.val().manajerTeknisAdminLab,
            nipPenerimaSampelAdminLab: snap.val().nipPenerimaSampelAdminLab === undefined ? '' : snap.val().nipPenerimaSampelAdminLab,
            nipPenerimaSampelAnalisLab: snap.val().nipPenerimaSampelAnalisLab === undefined ? '' : snap.val().nipPenerimaSampelAnalisLab,
            nipManajerAdministrasiAdminLab: snap.val().nipManajerAdministrasiAdminLab === undefined ? '' : snap.val().nipManajerAdministrasiAdminLab,
            nipManajerTeknisAdminLab: snap.val().nipManajerTeknisAdminLab === undefined ? '' : snap.val().nipManajerTeknisAdminLab,
            statusLaporanSPP: snap.val().statusLaporanSPP,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
      })
    this.props.firebase.db.ref('masterData/userform')
      .on('value', snap1 => {
        if (snap1.val()) {
          const b1 = [];
          const b2 = [];
          const b3 = [];
          const b4 = [];
          snap1.forEach((res) => {
            if (res.val().jabatanUserForm === 'Admin Lab') {
              b1.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Administrasi') {
              b2.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Teknis') {
              b3.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Analis') {
              b4.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            }
          })
          this.setState({
            selectUserformAdminLab: b1,
            selectUserformManajerAdministrasi: b2,
            selectUserformManajerTeknis: b3,
            selectUserformAnalis: b4,
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

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false, unitPengujianSampel: '' });
  };

  handleOpenAlert = () => {
    this.setState({ openAlert: true });
  };

  handleCloseAlert = () => {
    this.setState({ openAlert: false });
  };

  handleOpenAlertKodeUnik = () => {
    this.setState({ openAlertKodeUnik: true });
  };

  handleCloseAlertKodeUnik = () => {
    this.setState({ openAlertKodeUnik: false });
  };

  handleOpenAlertNomorLhu = () => {
    this.setState({ openAlertNomorLhu: true });
  };

  handleCloseAlertNomorLhu = () => {
    this.setState({ openAlertNomorLhu: false });
  };

  handleOpenAlertUnitPengujianSampel = () => {
    this.setState({ openAlertUnitPengujianSampel: true });
  };

  handleOpenAlertNamaWilker = () => {
    this.setState({ openAlertNamaWilker: true });
  };

  handleCloseAlertNamaWilker = () => {
    this.setState({ openAlertNamaWilker: false });
  };

  handleCloseAlertUnitPengujianSampel = () => {
    this.setState({ openAlertUnitPengujianSampel: false });
  };

  handleOpenAlertTanggalMasukSampel = () => {
    this.setState({ openAlertTanggalMasukSampel: true });
  };

  handleCloseAlertTanggalMasukSampel = () => {
    this.setState({ openAlertTanggalMasukSampel: false });
  };

  handleOpenAlertManajerAdministrasiAdminLab = () => {
    this.setState({ openAlertManajerAdministrasiAdminLab: true });
  };

  handleCloseAlertManajerAdministrasiAdminLab = () => {
    this.setState({ openAlertManajerAdministrasiAdminLab: false });
  };

  handleOpenAlertKesediaanBahanPengujian = () => {
    this.setState({ openAlertKesediaanBahanPengujian: true });
  };

  handleCloseAlertKesediaanBahanPengujian = () => {
    this.setState({ openAlertKesediaanBahanPengujian: false });
  };

  handleOpenAlertKesiapanPersonel = () => {
    this.setState({ openAlertKesiapanPersonel: true });
  };

  handleCloseAlertKesiapanPersonel = () => {
    this.setState({ openAlertKesiapanPersonel: false });
  };

  handleOpenAlertKondisiAlat = () => {
    this.setState({ openAlertKondisiAlat: true });
  };

  handleCloseAlertKondisiAlat = () => {
    this.setState({ openAlertKondisiAlat: false });
  };

  handleLanjutPengujian = () => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivityDetail: 'Lanjut Pengujian',
    });
    this.setState({ openAlert: false });
  };

  handleTolakPengujian = () => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagStatusProses: 'Sampel tidak dapat diuji',
      flagActivity: 'Sampel tidak dapat diuji',
      flagActivityDetail: 'Sampel tidak dapat diuji',
      keteranganPengujianDitolak: this.state.keteranganPengujianDitolak,
    });
    this.setState({ openAlert: false });
  };

  handleEditKodeUnik = () => {
    this.setState({ openAlertKodeUnik: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      kodeUnikSampelAdminLab: this.state.kodeUnikSampelAdminLab,
    })
  };

  handleEditNomorLhu = () => {
    this.setState({ openAlertNomorLhu: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      nomorLhu: this.state.nomorLhu,
    })
  };

  handleEditUnitPengujianSampel = () => {
    this.setState({ openAlertUnitPengujianSampel: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      unitPengujianSampel: this.state.unitPengujianSampel,
    })
  };

  handleEditNamaWilker = () => {
    this.setState({ openAlertNamaWilker: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      areaWilker: this.state.kodeAreaWilker,
    })
  };

  handleEditTanggalMasukSampel = () => {
    this.setState({ openAlertTanggalMasukSampel: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      tanggalUjiSampelAnalis: this.state.tanggalUjiSampelAnalis.toString(),
    })
  };

  handleEditManajerAdministrasiAdminLab = () => {
    this.setState({ openAlertManajerAdministrasiAdminLab: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      manajerAdministrasiAdminLab: this.state.manajerAdministrasiAdminLab,
      nipManajerAdministrasiAdminLab: this.state.nipManajerAdministrasiAdminLab,
    })
  };

  handleEditKesediaanBahanPengujian = () => {
    this.setState({ openAlertKesediaanBahanPengujian: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      kesediaanBahanPengujian: this.state.kesediaanBahanPengujian,
    })
  };

  handleEditKesiapanPersonel = () => {
    this.setState({ openAlertKesiapanPersonel: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      kesiapanPersonel: this.state.kesiapanPersonel,
    })
  };

  handleEditKondisiAlat = () => {
    this.setState({ openAlertKondisiAlat: false });

    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      kondisiAlat: this.state.kondisiAlat,
    })
  };

  handleSubmit = () => {
    this.setState({ open: false, loadingReport: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      tanggalTerimaSampelAdminLab: this.state.tanggalTerimaSampelAdminLab.toString(),   //=== undefined ? dateFnsFormat(new Date(), "dd MMM yyyy") : this.state.tanggalTerimaSampelAdminLab.toString(),
      kodeUnikSampelAdminLab: this.state.kodeUnikSampelAdminLab,
      nomorLhu: this.state.nomorLhu,
      penerimaSampelAdminLab: this.state.penerimaSampelAdminLab,
      manajerAdministrasiAdminLab: this.state.manajerAdministrasiAdminLab,
      manajerTeknisAdminLab: this.state.manajerTeknisAdminLab,
      penerimaSampelAnalisLab: this.state.penerimaSampelAnalisLab,
      unitPengujianSampel: this.state.unitPengujianSampel,
      statusLaporanSPP: true,
      nipManajerAdministrasiAdminLab: this.state.nipManajerAdministrasiAdminLab,
      nipManajerTeknisAdminLab: this.state.nipManajerTeknisAdminLab,
      nipPenerimaSampelAdminLab: this.state.nipPenerimaSampelAdminLab,
      nipPenerimaSampelAnalisLab: this.state.nipPenerimaSampelAnalisLab,
      flagActivityDetail: 'Update detail by admin lab done',
      // keteranganPengujianDitolak: this.state.keteranganPengujianDitolak,
    });
    // this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
    // });

    // console.log(this.state);
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ).update({
      unitPengujianSampel: this.state.unitPengujianSampel,
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP).update({
      flagActivityDetail: 'Update detail by admin lab done',
    })
  }

  handleUbah2 = (p, q, r) => {
    this.setState({ open2: true });
    if (r === 'TPC' || r === 'RAPID TEST KIT') {
      this.setState({
        selectUnitPengujian: ['Mikrobiologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'HA-HI/AI-ND') {
      this.setState({
        selectUnitPengujian: ['Virologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'ELISA RABIES' || r === 'ELISA BVD' || r === 'ELISA PARATB' || r === 'RBT') {
      this.setState({
        selectUnitPengujian: ['Serologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'PEWARNAAN GIEMSA' || r === 'MIKROSKOPIS') {
      this.setState({
        selectUnitPengujian: ['Parasitologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RT-PCR' || r === 'RT-DNA') {
      this.setState({
        selectUnitPengujian: ['Biomolekuler'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RESIDU NITRIT' || r === 'FEED CHECK') {
      this.setState({
        selectUnitPengujian: ['PSAH'],
        thisP: p, thisQ: q
      })
    }
  }

  handleDateChange = date => {
    this.setState({ tanggalTerimaSampelAdminLab: date });
  };

  handleDateChangeTanggalMasukSampel = date => {
    // console.log(this.state.tanggalMasukSampel, typeof this.state.tanggalMasukSampel, date, typeof date, date.toString())
    this.setState({ tanggalUjiSampelAnalis: date });
  };

  

  // onChange = id => event => {
  //   this.setState({
  //     [id]: event.target.value,
  //   });
  // };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'penerimaSampelAdminLab') {
      const filtered = this.state.selectUserformAdminLab.filter(str => {
        return str.namaUserForm === event.target.value;
      });
      // console.log(filtered);
      this.setState({ nipPenerimaSampelAdminLab: filtered[0].nipUserForm });
    } else if (name === 'penerimaSampelAnalisLab') {
      const filtered = this.state.selectUserformAnalis.filter(str => {
        return str.namaUserForm === event.target.value;
      });
      // console.log(filtered);
      this.setState({ nipPenerimaSampelAnalisLab: filtered[0].nipUserForm });
    } else if (name === 'manajerAdministrasiAdminLab') {
      const filtered = this.state.selectUserformManajerAdministrasi.filter(str => {
        return str.namaUserForm === event.target.value;
      });
      // console.log(filtered);
      this.setState({ nipManajerAdministrasiAdminLab: filtered[0].nipUserForm });
    } else if (name === 'manajerTeknisAdminLab') {
      const filtered = this.state.selectUserformManajerTeknis.filter(str => {
        return str.namaUserForm === event.target.value;
      });
      // console.log(filtered);
      this.setState({ nipManajerTeknisAdminLab: filtered[0].nipUserForm });
    } 
  };



  render() {
    const {
      selectUnitPengujian, unitPengujianSampel, loading, items, kodeUnikSampelAdminLab, kodeAreaWilker,
      tanggalTerimaSampelAdminLab, PenerimaSampelAdminLab, ManajerTeknisAdminLab, ManajerAdministrasiAdminLab,
      penerimaSampelAdminLab, manajerTeknisAdminLab, manajerAdministrasiAdminLab, nipManajerAdministrasiAdminLab, penerimaSampelAnalisLab,
      selectUserformAdminLab, selectUserformManajerAdministrasi, selectUserformManajerTeknis, selectUserformAnalis,
      // selectNipUserformAdminLab, selectNipUserformManajerAdministrasi, selectNipUserformManajerTeknis, selectNipUserformAnalis,
      statusLaporanSPP, loadingReport, keteranganPengujianDitolak, nomorAgendaSurat, tanggalMasukSampel, tanggalUjiSampelAnalis,
      openAlert, openAlertKodeUnik, openAlertNomorLhu, nomorLhu, openAlertManajerAdministrasiAdminLab, openAlertTanggalMasukSampel,
      openAlertUnitPengujianSampel, openAlertNamaWilker, openAlertKesediaanBahanPengujian, kesediaanBahanPengujian, openAlertKesiapanPersonel, 
      kesiapanPersonel, openAlertKondisiAlat, kondisiAlat,
    } = this.state;
    const isInvalid = tanggalTerimaSampelAdminLab === '' || PenerimaSampelAdminLab === '' || ManajerTeknisAdminLab === '' ||
      ManajerAdministrasiAdminLab === '' || kodeUnikSampelAdminLab === '' || kodeUnikSampelAdminLab.length < 20 || nomorLhu === '';
    const isInvalid2 = unitPengujianSampel === '';
    // console.log(this.state)

    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            {this.state.items[0].flagActivityDetail !== 'Lanjut Pengujian' &&
              <Button variant="contained" color="primary" onClick={this.handleOpenAlert}
                disabled={
                  ((this.state.items[0].flagActivityDetail === 'Menunggu konfirmasi lanjut pengujian dari Admin Lab'
                    || this.state.items[0].flagActivityDetail !== 'Sampel tidak dapat diuji'
                    || this.state.items[0].flagActivityDetail !== 'Hasil analisa perlu direvisi'
                  )
                    && this.state.items[0].flagStatusProses === 'Sampel di Admin Lab')
                    ? false : true}
              >
                Lanjut Pengujian ?
            </Button>}{' '}
            <Button variant="contained" color="primary" onClick={this.handleClickOpen}
              disabled={this.state.items[0].flagActivityDetail === 'Lanjut Pengujian' ? false : true}
            >
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
              <div style={{ marginTop: 25 }} key={key}>
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sampel : {dateFnsFormat(new Date(el.tanggalMasukSampel), "dd MMM yyyy")}</Typography>
                {!!el.tanggalUjiSampelAnalis && <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertTanggalMasukSampel}>Edit Tanggal LHU : {dateFnsFormat(new Date(el.tanggalUjiSampelAnalis), 'dd MMM yyyy')}</Button> {'  '}
                </Typography>}
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                {/* <Typography variant="subtitle1" gutterBottom>Kode Area Wilker : {el.areaWilker}</Typography> */}
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertNamaWilker}>Edit Area Wilker : {el.areaWilker}</Button> {'  '}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Wilker: {
                    el.areaWilker === '0501' ? 'Pelabuhan Laut Soekarno Hatta' 
                  : el.areaWilker === '0502' ? 'Pelabuhan Paotere'
                  : el.areaWilker === '0503' ? 'Pelabuhan Bulukumba' 
                  : el.areaWilker === '0504' ? 'Pelabuhan Jeneponto' 
                  : el.areaWilker === '0505' ? 'Bandara Hasanuddin' 
                  : el.areaWilker === '0506' ? 'Kantor Pos' 
                  : el.areaWilker === '0507' ? 'Pelabuhan Selayar' 
                  : el.areaWilker === '0508' ? 'Pelabuhan Tuju Tuju' 
                  : el.areaWilker === '0509' ? 'Pelabuhan Bajoe' 
                  : '--'}
                </Typography>
                               
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sampel : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sampel : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertUnitPengujianSampel}>Edit Unit Pengujian Sampel : {el.unitPengujianSampel}</Button> {'  '}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertNomorLhu}>Edit Nomor LHU : {el.nomorLhu}</Button> {'  '}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertKodeUnik}>Edit Kode Unik Sampel AdminLab : {el.kodeUnikSampelAdminLab}</Button>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertManajerAdministrasiAdminLab}>Edit Pelaksana Fungsi Manajer Admin : {el.manajerAdministrasiAdminLab}</Button>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertKesediaanBahanPengujian}>Edit Kesediaan Bahan Pengujian : {el.kesediaanBahanPengujian}</Button>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertKesiapanPersonel}>Edit Kesiapan Personel : {el.kesiapanPersonel}</Button>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Button variant='contained' onClick={this.handleOpenAlertKondisiAlat}>Edit Kondisi Alat : {el.kondisiAlat}</Button>
                </Typography>
                {/* {console.log(el)} */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Target Pengujian</TableCell>
                      {/* <TableCell>Unit Pengujian</TableCell> */}
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
                        {/* <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleUbah2(el.idPermohonanUji, el1, el.zItems[el1].metodePengujianSampel)}>
                            Ubah
                          </Button>
                        </TableCell> */}
                        <TableCell>
                          {(statusLaporanSPP === false || statusLaporanSPP === undefined) && loadingReport === true ?
                            'Data Surat Pengantar Pengujian belum lengkap' :
                            <PDFDownloadLink document={<Quixote q={el} />} fileName="surat-pengantar-pengujian.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Surat Pengantar Pengujian')}
                            </PDFDownloadLink>
                          }
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
              <DialogTitle id="form-dialog-title">Proses Terima Sampel oleh Admin Lab</DialogTitle>
              <DialogContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 350, marginBottom: 20 }}
                    label="Tanggal Terima Sampel oleh Admin Lab"
                    value={tanggalTerimaSampelAdminLab}
                    format={'dd MMM yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                <TextField
                  id="nomorLhu"
                  value={nomorLhu}
                  label="Nomor LHU"
                  style={{ width: "100%", marginBottom: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                <TextField
                  id="kodeUnikSampelAdminLab"
                  value={kodeUnikSampelAdminLab}
                  label="Kode Sampel"
                  style={{ width: "100%", marginBottom: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    <MenuItem value="Mikrobiologi">Mikrobiologi</MenuItem>
                    <MenuItem value="Virologi">Virologi</MenuItem>
                    <MenuItem value="Serologi">Serologi</MenuItem>
                    <MenuItem value="Parasitologi">Parasitologi</MenuItem>
                    <MenuItem value="Biomolekuler">Biomolekuler</MenuItem>
                    <MenuItem value="PSAH">PSAH</MenuItem>
                  </Select>
                </FormControl>
                {/* <TextField
                  id="penerimaSampelAdminLab"
                  label="Admin Lab"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAdminLab">Admin Lab</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAdminLab}
                    onChange={this.onChange2('penerimaSampelAdminLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAdminLab"
                  >
                    {!!selectUserformAdminLab && Object.keys(selectUserformAdminLab).map((el) =>
                      <MenuItem key={el} value={selectUserformAdminLab[el].namaUserForm}>{selectUserformAdminLab[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                {/* <TextField
                  id="manajerAdministrasiAdminLab"
                  label="Manajer Administrasi"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerAdministrasiAdminLab">Pelaksana Fungsi Manajer Administrasi</InputLabel>{" "}
                  <Select
                    value={manajerAdministrasiAdminLab}
                    onChange={this.onChange2('manajerAdministrasiAdminLab')}
                    style={{ width: 400 }}
                    name="manajerAdministrasiAdminLab"
                  >
                    {!!selectUserformManajerAdministrasi && Object.keys(selectUserformManajerAdministrasi).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerAdministrasi[el].namaUserForm}>{selectUserformManajerAdministrasi[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                {/* <TextField
                  id="manajerTeknisAdminLab"
                  label="Manajer Teknis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerTeknisAdminLab">Pelaksana Fungsi Manajer Teknis</InputLabel>{" "}
                  <Select
                    value={manajerTeknisAdminLab}
                    onChange={this.onChange2('manajerTeknisAdminLab')}
                    style={{ width: 400 }}
                    name="manajerTeknisAdminLab"
                  >
                    {!!selectUserformManajerTeknis && Object.keys(selectUserformManajerTeknis).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerTeknis[el].namaUserForm}>{selectUserformManajerTeknis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                {/* <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAnalisLab">Analis</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAnalisLab}
                    onChange={this.onChange2('penerimaSampelAnalisLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAnalisLab"
                  >
                    {!!selectUserformAnalis && Object.keys(selectUserformAnalis).map((el) =>
                      <MenuItem key={el} value={selectUserformAnalis[el].namaUserForm}>{selectUserformAnalis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl>
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
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Update Unit Pengujian Sampel</DialogTitle>
              <DialogContent>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    {!!selectUnitPengujian && selectUnitPengujian.map((elx, key) =>
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
                  variant="contained"
                  onClick={this.handleSubmit2}
                  disabled={isInvalid2}
                  color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlert}
              onClose={this.handleCloseAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'md'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Konfirmasi Pengujian'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <TextField
                    id="keteranganPengujianDitolak"
                    value={keteranganPengujianDitolak}
                    label="Keterangan Pengujian Jika Ditolak"
                    style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                    variant="outlined"
                    onChange={this.onChange}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleTolakPengujian} color="primary">
                  Tidak Lanjut
                </Button>
                <Button variant="contained" onClick={this.handleLanjutPengujian} color="primary" autoFocus>
                  Lanjut
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertKodeUnik}
              onClose={this.handleCloseAlertKodeUnik}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Kode Unik'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <TextField
                    id="kodeUnikSampelAdminLab"
                    value={kodeUnikSampelAdminLab}
                    label="Kode Unik"
                    style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                    variant="outlined"
                    onChange={this.onChange}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertKodeUnik}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditKodeUnik} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertNomorLhu}
              onClose={this.handleCloseAlertNomorLhu}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Nomor Lhu'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <TextField
                    id="nomorLhu"
                    value={nomorLhu}
                    label="Nomor Lhu"
                    style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                    variant="outlined"
                    onChange={this.onChange}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertNomorLhu}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditNomorLhu} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertManajerAdministrasiAdminLab}
              onClose={this.handleCloseAlertopenAlertManajerAdministrasiAdminLab}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Pelaksana Fungsi Manajer Admin'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <TextField
                    id="manajerAdministrasiAdminLab"
                    value={manajerAdministrasiAdminLab}
                    label="Manajer Administrasi Admin Lab"
                    style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                    variant="outlined"
                    onChange={this.onChange}
                  />
                  <TextField
                    id="nipManajerAdministrasiAdminLab"
                    value={nipManajerAdministrasiAdminLab}
                    label="NIP Manajer Administrasi Admin Lab"
                    style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                    variant="outlined"
                    onChange={this.onChange}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertManajerAdministrasiAdminLab}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditManajerAdministrasiAdminLab} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertKesediaanBahanPengujian}
              onClose={this.handleCloseAlertKesediaanBahanPengujian}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Kesediaan Bahan Pengujian'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormControl style={{ marginBottom: 20 }} variant="standard">
                    <InputLabel htmlFor="kesediaanBahanPengujian">Kesediaan Bahan Pengujian</InputLabel>{" "}
                    <Select
                      value={kesediaanBahanPengujian}
                      onChange={this.onChange2('kesediaanBahanPengujian')}
                      name="kesediaanBahanPengujian"
                      style={{ width: 400 }}
                    >
                      <MenuItem value="Ya">Ya</MenuItem>
                      <MenuItem value="Tidak">Tidak</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertKesediaanBahanPengujian}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditKesediaanBahanPengujian} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertKesiapanPersonel}
              onClose={this.handleCloseAlertKesiapanPersonel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Kesiapan Personel'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormControl style={{ marginBottom: 20 }} variant="standard">
                    <InputLabel htmlFor="kesiapanPersonel">Kesiapan Personel</InputLabel>{" "}
                    <Select
                      value={kesiapanPersonel}
                      onChange={this.onChange2('kesiapanPersonel')}
                      name="kesiapanPersonel"
                      style={{ width: 400 }}
                    >
                      <MenuItem value="Ya">Ya</MenuItem>
                      <MenuItem value="Tidak">Tidak</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertKesiapanPersonel}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditKesiapanPersonel} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertKondisiAlat}
              onClose={this.handleCloseAlertKondisiAlat}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Kondisi Alat'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormControl style={{ marginBottom: 20 }} variant="standard">
                    <InputLabel htmlFor="kondisiAlat">Kondisi Alat</InputLabel>{" "}
                    <Select
                      value={kondisiAlat}
                      onChange={this.onChange2('kondisiAlat')}
                      name="kondisiAlat"
                      style={{ width: 400 }}
                    >
                      <MenuItem value="Ya">Ya</MenuItem>
                      <MenuItem value="Tidak">Tidak</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertKondisiAlat}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditKondisiAlat} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertTanggalMasukSampel}
              onClose={this.handleCloseAlertTanggalMasukSampel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Tanggal LHU'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      margin="normal"
                      style={{ width: 250 }}
                      label="Tanggal LHU"
                      value={tanggalUjiSampelAnalis}
                      format={'dd MMM yyyy'}
                      onChange={this.handleDateChangeTanggalMasukSampel} />
                  </MuiPickersUtilsProvider>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertTanggalMasukSampel}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditTanggalMasukSampel} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertUnitPengujianSampel}
              onClose={this.handleCloseAlertUnitPengujianSampel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Unit Pengujian Sampel'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormControl style={{ marginBottom: 20 }} variant="standard">
                    <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                    <Select
                      value={unitPengujianSampel}
                      onChange={this.onChange2('unitPengujianSampel')}
                      name="unitPengujianSampel"
                      style={{ width: 400 }}
                    >
                      <MenuItem value="Mikrobiologi">Mikrobiologi</MenuItem>
                      <MenuItem value="Virologi">Virologi</MenuItem>
                      <MenuItem value="Serologi">Serologi</MenuItem>
                      <MenuItem value="Parasitologi">Parasitologi</MenuItem>
                      <MenuItem value="Biomolekuler">Biomolekuler</MenuItem>
                      <MenuItem value="PSAH">PSAH</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertUnitPengujianSampel}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditUnitPengujianSampel} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openAlertNamaWilker}
              onClose={this.handleCloseAlertNamaWilker}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={'sm'}
              fullWidth={true}
            >
              <DialogTitle id="alert-dialog-title">{'Edit Nama Wilker'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormControl style={{ marginBottom: 20 }} variant="standard">
                    <InputLabel htmlFor="kodeAreaWilker">Nama Wilker</InputLabel>{" "}
                    <Select
                      value={kodeAreaWilker}
                      onChange={this.onChange2('kodeAreaWilker')}
                      name="kodeAreaWilker"
                      style={{ width: 400 }}
                    >
                      <MenuItem value="0501">0501 - Pelabuhan Soekarno Hatta</MenuItem>
                      <MenuItem value="0502">0502 - Pelabuhan Paotere</MenuItem>
                      <MenuItem value="0503">0503 - Pelabuhan Bulukumba</MenuItem>
                      <MenuItem value="0504">0504 - Pelabuhan Jeneponto</MenuItem>
                      <MenuItem value="0505">0505 - Bandara Hasanuddin</MenuItem>
                      <MenuItem value="0506">0506 - Kantor Pos</MenuItem>
                      <MenuItem value="0507">0507 - Pelabuhan Selayar</MenuItem>
                      <MenuItem value="0508">0508 - Pelabuhan Tuju Tuju</MenuItem>
                      <MenuItem value="0509">0509 - Pelabuhan Bajoe</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseAlertNamaWilker}>
                  Batal
                </Button>
                <Button variant="contained" onClick={this.handleEditNamaWilker} color="primary" autoFocus>
                  OK
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
  tableColUncheck: {
    width: "11px",
    height: '11px',
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1.5,
    marginRight: '5px',
  },
  tableDirectionRow: {
    flexDirection: "row"
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
  headerTitle13: {
    fontSize: 13,
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
  logoChecklist: {
    marginVertical: 0,
    marginRight: 3,
    width: 13,
    height: 13,
  },
  headerRowRight: {
    textAlign: 'right',
    fontSize: 11,
  },
  headerRowLeft: {
    textAlign: 'left',
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
  header1Content50: {
    width: "50%",
  },
  header1TableCell: {
    // margin: "auto",
    // margin: 3,
    fontSize: 11,
    flexDirection: "row",
  },
  footerRow100: {
    position: 'absolute',
    bottom: 100,
    marginHorizontal: '20%',
  },
  footerRow200: {
    position: 'absolute',
    bottom: 200,
    marginHorizontal: '15%',
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
  spaceV150: {
    width: 150,
    height: 5,
  },
  spaceV80: {
    width: 80,
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
  // console.log(p);

  return <Document>
    <Page size='A4' orientation='portrait' style={styles.body}>
      <View style={styles.headerRowRight}>
        <Text>Form No : 5.8.1.2</Text>
      </View>
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
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>SURAT PENGANTAR PENGUJIAN</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL20]}>
        <Text style={styles.headerTitle11}>Kepada Yth.</Text>
        <Text style={styles.headerTitle11}>Pelaksana Fungsi Manajer Teknis</Text>
        <Text style={styles.headerTitle11}>Di</Text>
        <Text style={styles.headerTitle11}>Tempat</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL20]}>
        <Text style={styles.headerTitle11}>Bersama ini disampaikan sampel :</Text>
        <Text style={styles.headerTitle11}>Kode Sampel : {p.q.kodeUnikSampelAdminLab}</Text>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View>
            <Text style={styles.headerTitle11}>Jenis Sampel : {p.q.zItems[el1].jenisSampel}</Text>
            <Text style={styles.headerTitle11}>Jumlah Sampel : {p.q.zItems[el1].jumlahSampel}</Text>
            <Text style={styles.headerTitle11}>{' '}</Text>
            <View style={styles.tableDirectionRow}>
              {p.q.zItems[el1].ruangLingkupSampel === 'Akreditasi' ?
                <Image
                  style={styles.logoChecklist}
                  src='data:image/png;base64,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lO9kpAAgQCHuyEYBQICCu+HfuC3AzWoKAAIU3g2/7HL+M0VNAUCAwhz+V3fzX6yqACBACH03u5q/ugKAAGGcvsfN/D9VVwAQIJSRTu6GVRYABAjnxrQXAAQowgM+FYAFAQIo3w3Pdy3/wgUg9uehIUAIbZc4VgC6KS0ACFCUbmv8KABt6xFADydud6gAfLPgl9khQABNnLvX/QKAADoZ60r+MwQBrPBTRwpAJQJYYrrbBQABdNPq9w4UgAGCANY47B2HCwACGKDPJssC/EQQwCqD7O6GZwgCWGZEo8X8F1UigHX+zdUCgACGuN/RAoAAhsg/ZakAjBQEcIKqN5wsAAhgjK6rLeT/G0EAZzj+EwcLAAIYZJjp3fBH3QQBXOJK9woAAhjlVucKAAKY5X8MCjBREMA5ASpecKwAIIBhOqx0qwAggGl6bTRTALoKAjgpgJz2qYkCcIoggKMCyEX6d8OlFwAEsMAPHCoACGCDe90pAAhgg/wcrfm/XokAbgsgVYtcKQAIYIfOHzhSABDAEv+wTVcBuFgQwAMB5B/r9QjwY0EALwSQ0Vryf1wQwBMB5CcuFAAEsMg0BwoAAlikYqH9AoAANmm/Qmn+cQoAAlil53rbBQAB7DJgt+UCgACW+ecGuwUAAWxzvaL8/9ZVEMBHAWJ9Tseh7O4vCOCnAPknVRSAbwgCeCqAtPljcgEmCAJ4K4AcsSpp/o8JAngsgBz7sbUCgABOcHadrQKAAG5weYKPmEpUABDAESZYKgAI4AqP2ikACOAK5f9rpQAggDPULI/zDf6xNQKkRADpsS5GAegiCJAWAaT/LvMFAAFc4oIG4wUAAZziWuMFAAHcYorpAoAAbpF7wnABQADHqHzVbAFAANfo9F6JBeBkQYA0CiD9tpZUAEYIAqRTABlcym74R4IAaRVAvlV8NzxdECC9Ash/misACOAkD4d/V2u6CAKkWoDyZ00VAARwk3ZvGioACOAoR641UwAQwFVO3mmkACCAs3x1X4vf0WutESAbAsh3TRQABHCYSQYKAAI4TG6m/gKAAC7T+pVm3854QYAsCSAd3z3ou/m1IEC2BJCjt2guAAjgOGfU6i0ACOA63/xiN7zrZEGADAog//F5Afi6IEAmBZAHdRYABHCfsgUaCwACeED1Un0FAAF8oPsrnQUBMiyAbhAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAAXQLMBdKYEF6BQDNIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAKAzwKMAGe5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBv8P4MEpJXxK5GbAAAAAElFTkSuQmCC'
                />
                :
                <View style={styles.tableColUncheck}></View>
              }
              <Text style={styles.headerTitle11}> Untuk dilakukan pengujian dari ruang lingkup {p.q.zItems[el1].ruangLingkupSampel === 'Akreditasi' ? p.q.zItems[el1].metodePengujianSampel : ''}</Text></View>
            <View style={styles.tableDirectionRow}>
              {p.q.zItems[el1].ruangLingkupSampel === 'Diluar Akreditasi' ?
                <Image
                  style={styles.logoChecklist}
                  src='data:image/png;base64,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lO9kpAAgQCHuyEYBQICCu+HfuC3AzWoKAAIU3g2/7HL+M0VNAUCAwhz+V3fzX6yqACBACH03u5q/ugKAAGGcvsfN/D9VVwAQIJSRTu6GVRYABAjnxrQXAAQowgM+FYAFAQIo3w3Pdy3/wgUg9uehIUAIbZc4VgC6KS0ACFCUbmv8KABt6xFADydud6gAfLPgl9khQABNnLvX/QKAADoZ60r+MwQBrPBTRwpAJQJYYrrbBQABdNPq9w4UgAGCANY47B2HCwACGKDPJssC/EQQwCqD7O6GZwgCWGZEo8X8F1UigHX+zdUCgACGuN/RAoAAhsg/ZakAjBQEcIKqN5wsAAhgjK6rLeT/G0EAZzj+EwcLAAIYZJjp3fBH3QQBXOJK9woAAhjlVucKAAKY5X8MCjBREMA5ASpecKwAIIBhOqx0qwAggGl6bTRTALoKAjgpgJz2qYkCcIoggKMCyEX6d8OlFwAEsMAPHCoACGCDe90pAAhgg/wcrfm/XokAbgsgVYtcKQAIYIfOHzhSABDAEv+wTVcBuFgQwAMB5B/r9QjwY0EALwSQ0Vryf1wQwBMB5CcuFAAEsMg0BwoAAlikYqH9AoAANmm/Qmn+cQoAAlil53rbBQAB7DJgt+UCgACW+ecGuwUAAWxzvaL8/9ZVEMBHAWJ9Tseh7O4vCOCnAPknVRSAbwgCeCqAtPljcgEmCAJ4K4AcsSpp/o8JAngsgBz7sbUCgABOcHadrQKAAG5weYKPmEpUABDAESZYKgAI4AqP2ikACOAK5f9rpQAggDPULI/zDf6xNQKkRADpsS5GAegiCJAWAaT/LvMFAAFc4oIG4wUAAZziWuMFAAHcYorpAoAAbpF7wnABQADHqHzVbAFAANfo9F6JBeBkQYA0CiD9tpZUAEYIAqRTABlcym74R4IAaRVAvlV8NzxdECC9Ash/misACOAkD4d/V2u6CAKkWoDyZ00VAARwk3ZvGioACOAoR641UwAQwFVO3mmkACCAs3x1X4vf0WutESAbAsh3TRQABHCYSQYKAAI4TG6m/gKAAC7T+pVm3854QYAsCSAd3z3ou/m1IEC2BJCjt2guAAjgOGfU6i0ACOA63/xiN7zrZEGADAog//F5Afi6IEAmBZAHdRYABHCfsgUaCwACeED1Un0FAAF8oPsrnQUBMiyAbhAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAAXQLMBdKYEF6BQDNIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAKAzwKMAGe5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBv8P4MEpJXxK5GbAAAAAElFTkSuQmCC'
                />
                :
                <View style={styles.tableColUncheck}></View>
              }
              <Text style={styles.headerTitle11}> Untuk dilakukan pengujian dari ruang lingkup {p.q.zItems[el1].ruangLingkupSampel === 'Akreditasi' ? '' : p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.headerRowCenter}>
              <Text style={styles.headerTitle13}>KAJI ULANG PERMINTAAN</Text>
            </View>
            <View style={styles.tableDirectionRow}>
              {p.q.kesediaanBahanPengujian === "Ya" ?
                <Image
                  style={styles.logoChecklist}
                  src='data:image/png;base64,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lO9kpAAgQCHuyEYBQICCu+HfuC3AzWoKAAIU3g2/7HL+M0VNAUCAwhz+V3fzX6yqACBACH03u5q/ugKAAGGcvsfN/D9VVwAQIJSRTu6GVRYABAjnxrQXAAQowgM+FYAFAQIo3w3Pdy3/wgUg9uehIUAIbZc4VgC6KS0ACFCUbmv8KABt6xFADydud6gAfLPgl9khQABNnLvX/QKAADoZ60r+MwQBrPBTRwpAJQJYYrrbBQABdNPq9w4UgAGCANY47B2HCwACGKDPJssC/EQQwCqD7O6GZwgCWGZEo8X8F1UigHX+zdUCgACGuN/RAoAAhsg/ZakAjBQEcIKqN5wsAAhgjK6rLeT/G0EAZzj+EwcLAAIYZJjp3fBH3QQBXOJK9woAAhjlVucKAAKY5X8MCjBREMA5ASpecKwAIIBhOqx0qwAggGl6bTRTALoKAjgpgJz2qYkCcIoggKMCyEX6d8OlFwAEsMAPHCoACGCDe90pAAhgg/wcrfm/XokAbgsgVYtcKQAIYIfOHzhSABDAEv+wTVcBuFgQwAMB5B/r9QjwY0EALwSQ0Vryf1wQwBMB5CcuFAAEsMg0BwoAAlikYqH9AoAANmm/Qmn+cQoAAlil53rbBQAB7DJgt+UCgACW+ecGuwUAAWxzvaL8/9ZVEMBHAWJ9Tseh7O4vCOCnAPknVRSAbwgCeCqAtPljcgEmCAJ4K4AcsSpp/o8JAngsgBz7sbUCgABOcHadrQKAAG5weYKPmEpUABDAESZYKgAI4AqP2ikACOAK5f9rpQAggDPULI/zDf6xNQKkRADpsS5GAegiCJAWAaT/LvMFAAFc4oIG4wUAAZziWuMFAAHcYorpAoAAbpF7wnABQADHqHzVbAFAANfo9F6JBeBkQYA0CiD9tpZUAEYIAqRTABlcym74R4IAaRVAvlV8NzxdECC9Ash/misACOAkD4d/V2u6CAKkWoDyZ00VAARwk3ZvGioACOAoR641UwAQwFVO3mmkACCAs3x1X4vf0WutESAbAsh3TRQABHCYSQYKAAI4TG6m/gKAAC7T+pVm3854QYAsCSAd3z3ou/m1IEC2BJCjt2guAAjgOGfU6i0ACOA63/xiN7zrZEGADAog//F5Afi6IEAmBZAHdRYABHCfsgUaCwACeED1Un0FAAF8oPsrnQUBMiyAbhAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAAXQLMBdKYEF6BQDNIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAKAzwKMAGe5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBv8P4MEpJXxK5GbAAAAAElFTkSuQmCC'
                />
                :
                <View style={styles.tableColUncheck}></View>
              }
              <Text style={styles.headerTitle11}> Kesediaan Bahan Pengujian</Text>
            </View>
            <View style={styles.tableDirectionRow}>
              {p.q.kesiapanPersonel === "Ya" ?
                <Image
                  style={styles.logoChecklist}
                  src='data:image/png;base64,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lO9kpAAgQCHuyEYBQICCu+HfuC3AzWoKAAIU3g2/7HL+M0VNAUCAwhz+V3fzX6yqACBACH03u5q/ugKAAGGcvsfN/D9VVwAQIJSRTu6GVRYABAjnxrQXAAQowgM+FYAFAQIo3w3Pdy3/wgUg9uehIUAIbZc4VgC6KS0ACFCUbmv8KABt6xFADydud6gAfLPgl9khQABNnLvX/QKAADoZ60r+MwQBrPBTRwpAJQJYYrrbBQABdNPq9w4UgAGCANY47B2HCwACGKDPJssC/EQQwCqD7O6GZwgCWGZEo8X8F1UigHX+zdUCgACGuN/RAoAAhsg/ZakAjBQEcIKqN5wsAAhgjK6rLeT/G0EAZzj+EwcLAAIYZJjp3fBH3QQBXOJK9woAAhjlVucKAAKY5X8MCjBREMA5ASpecKwAIIBhOqx0qwAggGl6bTRTALoKAjgpgJz2qYkCcIoggKMCyEX6d8OlFwAEsMAPHCoACGCDe90pAAhgg/wcrfm/XokAbgsgVYtcKQAIYIfOHzhSABDAEv+wTVcBuFgQwAMB5B/r9QjwY0EALwSQ0Vryf1wQwBMB5CcuFAAEsMg0BwoAAlikYqH9AoAANmm/Qmn+cQoAAlil53rbBQAB7DJgt+UCgACW+ecGuwUAAWxzvaL8/9ZVEMBHAWJ9Tseh7O4vCOCnAPknVRSAbwgCeCqAtPljcgEmCAJ4K4AcsSpp/o8JAngsgBz7sbUCgABOcHadrQKAAG5weYKPmEpUABDAESZYKgAI4AqP2ikACOAK5f9rpQAggDPULI/zDf6xNQKkRADpsS5GAegiCJAWAaT/LvMFAAFc4oIG4wUAAZziWuMFAAHcYorpAoAAbpF7wnABQADHqHzVbAFAANfo9F6JBeBkQYA0CiD9tpZUAEYIAqRTABlcym74R4IAaRVAvlV8NzxdECC9Ash/misACOAkD4d/V2u6CAKkWoDyZ00VAARwk3ZvGioACOAoR641UwAQwFVO3mmkACCAs3x1X4vf0WutESAbAsh3TRQABHCYSQYKAAI4TG6m/gKAAC7T+pVm3854QYAsCSAd3z3ou/m1IEC2BJCjt2guAAjgOGfU6i0ACOA63/xiN7zrZEGADAog//F5Afi6IEAmBZAHdRYABHCfsgUaCwACeED1Un0FAAF8oPsrnQUBMiyAbhAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAAXQLMBdKYEF6BQDNIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAKAzwKMAGe5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBv8P4MEpJXxK5GbAAAAAElFTkSuQmCC'
                />
                :
                <View style={styles.tableColUncheck}></View>
              }
              <Text style={styles.headerTitle11}> Kesiapan Personel</Text>
            </View>
            <View style={styles.tableDirectionRow}>
              {p.q.kondisiAlat === "Ya" ?
                <Image
                  style={styles.logoChecklist}
                  src='data:image/png;base64,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lO9kpAAgQCHuyEYBQICCu+HfuC3AzWoKAAIU3g2/7HL+M0VNAUCAwhz+V3fzX6yqACBACH03u5q/ugKAAGGcvsfN/D9VVwAQIJSRTu6GVRYABAjnxrQXAAQowgM+FYAFAQIo3w3Pdy3/wgUg9uehIUAIbZc4VgC6KS0ACFCUbmv8KABt6xFADydud6gAfLPgl9khQABNnLvX/QKAADoZ60r+MwQBrPBTRwpAJQJYYrrbBQABdNPq9w4UgAGCANY47B2HCwACGKDPJssC/EQQwCqD7O6GZwgCWGZEo8X8F1UigHX+zdUCgACGuN/RAoAAhsg/ZakAjBQEcIKqN5wsAAhgjK6rLeT/G0EAZzj+EwcLAAIYZJjp3fBH3QQBXOJK9woAAhjlVucKAAKY5X8MCjBREMA5ASpecKwAIIBhOqx0qwAggGl6bTRTALoKAjgpgJz2qYkCcIoggKMCyEX6d8OlFwAEsMAPHCoACGCDe90pAAhgg/wcrfm/XokAbgsgVYtcKQAIYIfOHzhSABDAEv+wTVcBuFgQwAMB5B/r9QjwY0EALwSQ0Vryf1wQwBMB5CcuFAAEsMg0BwoAAlikYqH9AoAANmm/Qmn+cQoAAlil53rbBQAB7DJgt+UCgACW+ecGuwUAAWxzvaL8/9ZVEMBHAWJ9Tseh7O4vCOCnAPknVRSAbwgCeCqAtPljcgEmCAJ4K4AcsSpp/o8JAngsgBz7sbUCgABOcHadrQKAAG5weYKPmEpUABDAESZYKgAI4AqP2ikACOAK5f9rpQAggDPULI/zDf6xNQKkRADpsS5GAegiCJAWAaT/LvMFAAFc4oIG4wUAAZziWuMFAAHcYorpAoAAbpF7wnABQADHqHzVbAFAANfo9F6JBeBkQYA0CiD9tpZUAEYIAqRTABlcym74R4IAaRVAvlV8NzxdECC9Ash/misACOAkD4d/V2u6CAKkWoDyZ00VAARwk3ZvGioACOAoR641UwAQwFVO3mmkACCAs3x1X4vf0WutESAbAsh3TRQABHCYSQYKAAI4TG6m/gKAAC7T+pVm3854QYAsCSAd3z3ou/m1IEC2BJCjt2guAAjgOGfU6i0ACOA63/xiN7zrZEGADAog//F5Afi6IEAmBZAHdRYABHCfsgUaCwACeED1Un0FAAF8oPsrnQUBMiyAbhAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAARAAAXQLMBdKYEF6BQDNIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACIAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAKAzwKMAGe5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBv8P4MEpJXxK5GbAAAAAElFTkSuQmCC'
                />
                :
                <View style={styles.tableColUncheck}></View>
              }
              <Text style={styles.headerTitle11}> Kondisi Alat</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.footerRow100}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
          </View>
          <View style={styles.spaceV80}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11]}>Makassar, {dateFnsFormat(p.q.tanggalTerimaSampelAdminLab === undefined ? new Date() : new Date(p.q.tanggalTerimaSampelAdminLab), "dd MMM yyyy")}</Text>
            <Text>{' '}</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Teknis</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.manajerTeknisAdminLab} )</Text>
            <Text>NIP. {p.q.nipManajerTeknisAdminLab}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document >
}

const PDFLHUAdminLab = (p) => {
  // console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='portrait' style={styles.body}>
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
        {/* <View style={styles.spaceVLogo}></View> */}
        {/* {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) => {
          if (p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND'
                || p.q.zItems[el1].metodePengujianSampel === 'RBT' 
                || p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' 
                || p.q.zItems[el1].metodePengujianSampel === 'TPC'
                || p.q.zItems[el1].metodePengujianSampel === 'PEWARNAAN GIEMSA'
                || p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA'  
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
          <View style={styles.tableRow}>
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
                }
              </Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>
                {
                  p.q.zItems[el1].metodePengujianSampel === 'HA-HI/AI-ND' ? 'OIE 2018 Chapter 3.3.4 hal 430 – 432 dan OIE 2018 Chapter 3.3.14' 
                  : p.q.zItems[el1].metodePengujianSampel === 'ELISA RABIES' ? 'OIE 2018 Chapter 3.1.17 hal 596-597' 
                  : p.q.zItems[el1].metodePengujianSampel === 'TPC' ? 'SNI 2897 : 2008 butir 4.2'  // cemaran mikroba ?
                  : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA' ? 'OIE 2018 Chapter 3.1.21 hal 662-663' 
                  : p.q.zItems[el1].metodePengujianSampel === 'MIKROSKOPIS TRYPANOSOMA SP. DENGAN PEWARNAAN GIEMSA WILKER' ? 'OIE 2018 Chapter 3.1.21 hal 662-663' 
                  // : p.q.zItems[el1].metodePengujianSampel.include('TRYPANOSOMA') ? 'OIE 2018 chapter 3.1.21. hal 662 - 663' 
                  : p.q.zItems[el1].metodePengujianSampel === 'RBT' ? 'OIE 2018 Chapter 3.1.4 hal 368-369' 
                  : p.q.zItems[el1].metodePengujianSampel 
                }
                </Text>
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
            <Text style={[styles.headerTitle11]}>Makassar, {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "dd MMM yyyy")}</Text>
            <Text>{' '}</Text>
            <Text style={[styles.headerTitle11, styles.headerRowLeft]}>Mengetahui,</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Teknis</Text>
            <Text>{' '}</Text>
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

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);