import React, { Component } from 'react';
import Axios from 'axios';
import { API_URL } from '../connection/API_URL';
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import Swal from 'sweetalert2'

class Home extends Component{
    state={
        dataremedial:[],
        modalEdit:false,
        modalAdd:false,
        indexedit:-1,
        idEdit:-1,
        idDelete:-1,
    }

    componentDidMount () {
        Axios.get(`${API_URL}remedial`)
        .then((res)=>{
            this.setState({dataremedial:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    onBtnEdit=(index)=>{
        var editremedial = this.state.dataremedial
        this.setState({indexedit:index, modalEdit:true, idEdit:editremedial[index].id})
    }

    updateremedial=()=>{
        var nama = this.refs.editnama.value
        var usia = this.refs.editusia.value
        var pekerjaan = this.refs.editpekerjaan.value
        var newEdit = this.state.dataremedial

        var objnew = {nama:nama, usia:usia, pekerjaan:pekerjaan}
        newEdit.splice(this.state.indexedit,1,objnew)
        Axios.put(`${API_URL}remedial/${this.state.idEdit}`, objnew)
        this.setState({dataremedial:newEdit, modalEdit:false, indexedit:-1, idEdit:-1})
        
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        }).fire({
            icon: 'success',
            title: 'Berhasil Edit'
        })
    
    }

    onBtnAdd = () =>{
        var nama      = this.refs.nama.value
        var usia      = this.refs.usia.value
        var pekerjaan = this.refs.pekerjaan.value
        
        var data = {
            nama,
            usia,
            pekerjaan
        }

        Axios.post(`${API_URL}remedial`, data)
        .then((res)=>{
            Axios.get(`${API_URL}remedial`)
            .then((res)=>{
                this.setState({dataremedial:res.data, modalAdd:false})
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Berhasil ditambahkan!'
                })
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })

    }

    btnDelete=(index)=>{
        Swal.fire({
            title: 'Hapus data dengan nama : ' + this.state.dataremedial[index].nama + '?',
            text: '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Cancel',
        }).then((result)=>{
            if (result.value) {
                var hapusdata = this.state.dataremedial
                this.setState({idDelete:hapusdata[index]["id"]})
                Swal.fire(
                    'Deleted',
                    'Berhasil dihapus!',
                    'success'
                )
                Axios.delete(`${API_URL}remedial/${this.state.idDelete}`)
                .then(()=>{
                    Axios.get(`${API_URL}remedial`)
                    .then(res=>{
                        this.setState({dataremedial:res.data})
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
                
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Tidak Jadi',
                    'error'
                )
            }
        })
    }

    // deleteAllData = () => {
    //     Axios.delete(`${API_URL}remedial/delete-all`)
    //         .then(()=>{
    //             Axios.get(`${API_URL}remedial`)
    //             .then(res=>{
    //                 this.setState({dataremedial:res.data})
    //             })
    //             .catch(error=>{
    //                 console.log(error)
    //             })
    //         })
    //         .catch(err=>{
    //             console.log(err)
    //         })
    // }

    // filterData=()=>{
    //     Axios.get(`${API_URL}/remedial?pekerjaan=${this.state.dataremedial.pekerjaan}`)
    //     .then((res)=>{
    //     this.setState({dataremedial:res.data.pekerjaan})
    //     this.renderFilter()
    //     }).catch((err)=>{
    //         console.log(err)
    //     })
    // }

    // onFilterClick=(e)=>{
    //     var filter=e.target.value
    //     this.renderFilter()
    //     this.filterData(null,filter)
    // }

    // renderFilter = () =>{
    //     const {dataremedial,activefilter}=this.state
    //     return dataremedial.map((val,index)=>{
    //         return(
    //             <div key={index}>
    //                 <input type='button' color="grey" size='sm' value={val.id} onClick={this.onFilterClick} active={parseInt(activefilter)=== val.id}>{val.nama}</input>
    //             </div>
    //         )
    //     })
    // }

    renderData = () =>{
        return this.state.dataremedial.map((val, index)=>{
            return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.nama}</td>
                    <td>{val.usia}</td>
                    <td>{val.pekerjaan}</td>
                    <td>
                        <div className='col-md-6'> <input onClick={()=>this.onBtnEdit(index)} type='button' className='form-control btn-success' value='Edit' /> </div>
                        <div className='col-md-6'> <input onClick={()=>this.btnDelete(index)} type='button' className='form-control btn-danger' value='Delete' /> </div>
                    </td>
                </tr>
            )
        })
    }

    render(){
        const {dataremedial, indexedit} = this.state
        const {length} = dataremedial
        if(length===0){
            return (
            <div>
                Loading ...
                <Spinner color="danger" />
                <Spinner color="warning" />
                <Spinner color="success" />
            </div>
            )
        }
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        {/* {this.renderFilter()} */}
                    </div>
                </div>
                {
                    indexedit===-1 ? null :
                    <Modal centered isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})}>
                        <ModalHeader>Edit {dataremedial[indexedit].nama}</ModalHeader>
                        <ModalBody>
                            <input type="text" defaultValue={dataremedial[indexedit].nama} ref="editnama" className="form-control mt-2"/>
                            <input type="number" defaultValue={dataremedial[indexedit].usia} ref="editusia" className="form-control mt-2"/>
                            <input type="text" defaultValue={dataremedial[indexedit].pekerjaan} ref="editpekerjaan" className="form-control mt-2"/>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={this.updateremedial} className="btn btn-success p-1">save</button>
                            <button onClick={()=>this.setState({modalEdit:false})} className="btn btn-danger p-1">cancel</button>
                        </ModalFooter>
                    </Modal>
                }
                <Modal centered isOpen={this.state.modalAdd} toggle={()=>this.setState({modalAdd:false})}>
                    <ModalHeader>Tambah Data Baru</ModalHeader>
                    <ModalBody>
                        <input type="text" placeholder="Nama" ref="nama" className="form-control mt-2"/>
                        <input type="number" placeholder="Usia" ref="usia" className="form-control mt-2"/>
                        <input type="text" placeholder="Pekerjaan" ref="pekerjaan" className="form-control mt-2"/>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={this.onBtnAdd} className="btn btn-primary p-1">add</button>
                        <button onClick={()=>this.setState({modalAdd:false})} className="btn btn-secondary p-1">cancel</button>
                    </ModalFooter>
                </Modal>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <button onClick={()=>this.setState({modalAdd:true})} className="btn btn-info p-2 mt-3" style={{fontSize:'14px'}}>Add Data</button>
                        {/* <button onClick={this.deleteAllData} className="btn btn-danger p-2 mt-3" style={{fontSize:'14px'}}>Delete All </button> */}
                    </div>
                </div>
                <table className='table mb-4'>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Nama</td>
                            <td>Usia</td>
                            <td>Pekerjaan</td>
                            <td>Act</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Home