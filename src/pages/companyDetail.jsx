import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'config/custom-button.css'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { EditIcon,EyeIcon,EyeIconOne, TrashIcon } from '../icons'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import * as Yup from 'yup'
import response from '../utils/demo/tableData'
import { useContext } from 'react'
import { AuthContext } from '../hooks/authContext'
import { url } from 'config/urlConfig'
import { ErrorAlert, SuccessAlert } from "components/Alert";
import TitleChange from 'components/Title/Title'

// make a copy of the data, for the second table







function CompanyDetail(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {authState,settings} = useContext(AuthContext)
  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }


  
  const {id} = useParams()



  const [isDeleteOpen,setIsDeleteOpen] = useState({open:false,id:""})

  const closeDelete = ()=>{
    setIsDeleteOpen(false)
}
  const openDelete = (id)=>{
    setIsDeleteOpen({open:true,id:id})
}






    
    //COMAPNY DATA STATES
    const [companyData,setCompanyData] = useState([])
    const [companyFormData,setCompanyFormData] = useState({name:"",location:"",UserId:""})
    const [errorMessage,setErrorMessage] = useState('')
    const [frontErrorMessage,setFrontErrorMessage] = useState('')
    const [showModal, setShowModal] = useState({show:false,id:""});
    const [users,setUsers] = useState([])

    //ENDOF COMPANY DATA

    const [openSuccess, setOpenSuccess] = useState({ open: false, message: "" });

    const handleCloseSuccess = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenSuccess({ open: false, message: "" });
    };
  
    const [openError, setOpenError] = useState({ open: false, message: "" });
  
    const handleCloseError = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpenError({ open: false, message: "" });
    };





  useEffect(()=>{
    const companyFetch = async()=>{
        const response = await axios.get(`${url}/companies/${id}`,{withCredentials:true})
        if(response.data.error) setFrontErrorMessage(response.data.error)
        setCompanyData(response.data)
        setCompanyFormData({name:response.data.name,location:response.data.location,UserId:response.data.UserId})
        // console.log(response.data);
        // console.log('this is from params',id);
        await axios.get(`${url}/users`,{withCredentials:true}).then((resp)=>{
          if(resp.data.error){
    
          }else{
            const data = resp.data.filter((usr)=>usr.role=="client")
            setUsers(data)
          }
        })
    }

    
    companyFetch()
  },[])


  const updateCompany =async(e)=>{
    e.preventDefault()
    // console.log(e.data);
    if(companyFormData.name==="" || companyFormData.location==="" || companyFormData.UserId==="" || companyFormData.UserId==="Select a Customer"){
      setOpenError({open:true,message:'Please Provide all data'})  
    }else{
      // console.log(companyFormData);
      const response = await axios.put(`${url}/companies/${id}`,companyFormData,{withCredentials:true}).then((resp)=>{
        if(resp.data.error){
          setErrorMessage(resp.data.error)
        }else{
          setCompanyData(resp.data)
          setOpenSuccess({open:true,message:"Successfully Added"})
          closeModal()
        }
      // console.log(companyFormData);
      })
    }

} 
const deleteCompany =async()=>{
  const response = await axios.delete(`${url}/companies/${id}`,{withCredentials:true}).then((resp)=>{
    
    if(resp.data.error){
      setErrorMessage(resp.data.error)
    }else{
      setOpenSuccess({open:true,message:"Successfully Deleted"})
      closeDelete()
      props.history.goBack()
      
    }
  })
}



  return (
    <>
      <PageTitle>{companyData.name} page</PageTitle>
      <TitleChange name={`Company Detail | ${settings.name}`}/>
        {/* Notification Section */}
        <ErrorAlert
        open={openError.open}
        handleClose={handleCloseError}
        message={openError.message}
        horizontal="right"
      />
      <SuccessAlert
        open={openSuccess.open}
        handleClose={handleCloseSuccess}
        message={openSuccess.message}
        horizontal="right"
      />

      {/* Delete Confirm section */}
      <Modal isOpen={isDeleteOpen.open} onClose={closeDelete}>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to perform this action?</p>
          </ModalBody>
          <ModalFooter>
            <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600" onClick={deleteCompany}>
              Confirm
            </button>
          </ModalFooter>
      </Modal>

        {/* End of delete Section */}
     
        {authState.role==="admin" || authState.role==="hr" || authState.role==="manager" ?
      <div>
        <Button onClick={openModal} size="small" className="custom-button">Update Data</Button>
      </div>
      :<p>Read Only</p>}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Update Company Info</ModalHeader>
        <span style={{color:'red'}}>{errorMessage}</span>
        <ModalBody>
          
        <form onSubmit={e=>{updateCompany(e)}}>
        <Label>
          <span>Name</span>
            <Input type="text" className="mt-1" name="name" placeholder="Company Name" value={companyFormData.name} autoComplete='off' onChange={e=>setCompanyFormData({...companyFormData, name:e.target.value})}/>
        </Label>
        <Label>
          <span>Location</span>
          <Input type="text" className="mt-1" name="location" placeholder="Jijiga"  value={companyFormData.location} onChange={e=>setCompanyFormData({...companyFormData,location:e.target.value})}/>
        </Label>
        <Label>
            <span>Customer</span>
            <Select
              className="mt-1"
              name="contractType"
              value={companyFormData.UserId}
              onChange={(e)=>setCompanyFormData({...companyFormData,UserId:e.target.value})}
              required
            >
              <option>Select a Customer</option>
              {users.map((usr,i)=>(
                <option key={i} value={usr.id}>{usr.name}</option>
              ))}
              
            </Select>
          </Label>

        <Button className="mt-4 custom-button" type="submit">Save</Button>
        </form>
            
   
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
         
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <SectionTitle>{frontErrorMessage}</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Company Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            
              <TableRow key={companyData.id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    
                    <div>
                      <p className="font-semibold">{companyData.name}</p>
                      
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{users.map((usr)=>usr.id===companyData.UserId?usr.name:"")}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{companyData.location}</span>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-4">
                    
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>setIsDeleteOpen({open:true})}>
                      <TrashIcon style={{color:'red'}} className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
        
          </TableBody>
        </Table>
        <TableFooter>
          {/* <Pagination
            // totalResults={totalResults}
            // resultsPerPage={resultsPerPage}
            // onChange={onPageChangeTable2}
            // label="Table navigation"
          /> */}
        </TableFooter>
      </TableContainer>
    </>
  )
}

export default CompanyDetail
