
import React, { useState, useEffect,Fragment } from 'react'

import CTA from '../../components/CTA'
import InfoCard from '../../components/Cards/InfoCard'
import ChartCard from '../../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import { AuthContext } from '../../hooks/authContext'
import { useContext } from 'react'
import ChartLegend from '../../components/Chart/ChartLegend'
import PageTitle from '../../components/Typography/PageTitle'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon, TrashIcon, EditIcon } from '../../icons'
import RoundIcon from '../RoundIcon'
import response from '../../utils/demo/tableData'
import { PlusCircleIcon } from "@heroicons/react/outline";
import { DocumentAddIcon } from '@heroicons/react/outline';

import { ErrorAlert, SuccessAlert } from "components/Alert";


import {
  TableBody,
  TableContainer, 
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from '@windmill/react-ui'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../../utils/demo/chartsData'
import { Link, withRouter } from 'react-router-dom'
import { url } from 'config/urlConfig'
import axios from 'axios'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { date } from 'faker/lib/locales/az'
import TitleChange from 'components/Title/Title'




const ProcurementFilesList = () => {
    const {authState,settings} = useContext(AuthContext)
    const [prFiles,setPrFiles] = useState([])
    const [countsData,setCountsData] = useState({ projectCount:"",bidCount:"",activeProjects:"",completedProjects:""})
    const [prFileForm,setPrFileForm] = useState({name:"",file:"",ProjectId:""})
    const [timesheetData,setTimeSheetData] = useState([])
    const [projects,setProject] = useState([])

  


    // Notifications
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

    // End of notifications
    const [isOpen,setIsOpen] = useState(false)
    function closeModal(){
        setIsOpen(false)
    }
    function openModal(){
        setIsOpen(true)
    }



      useEffect(()=>{
        const getData=async()=>{


            await axios.get(`${url}/procFile`,{withCredentials:true}).then((resp)=>{
                // console.log(resp.data);
              if(resp.data.error){
                setOpenError({open:true,message:true})
              }else{
                setPrFiles(resp.data)
              }
            })

            await axios.get(`${url}/projects`,{withCredentials:true}).then((resp)=>{
                if(resp.data.error){
                  // console.log(resp.data.error);
                }
              const data = resp.data.projects.filter((pr)=>pr.approved)  
              setProject(data)
          
              })

        

        
        }

        getData()
    
    },[])

      
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        // console.log(prFileForm);
        const formData = new FormData()
        formData.append('name',prFileForm.name)
        formData.append('file',prFileForm.file)
        console.log(formData);
        await axios.post(`${url}/prFiles`,formData,{withCredentials:true}).then((resp)=>{
            if(resp.data.error){
                setOpenError({open:true,message:`${resp.data.error}`})
            }else{
                setPrFiles((prev)=>[...prev,resp.data])
                setOpenSuccess({open:true,message:"Successfully Added"})
                closeModal();
            }
          

        }).catch((error)=>{
            if (error.response && error.response.data && error.response.data.error) {
                setOpenError({open:true,message:`${error.response.data.error}`});
              } else {
                setOpenError({open:true,message:"An unknown error occurred"});
              }
        })
       
      };

      




  const [isDeleteOpen,setIsDeleteOpen] = useState({open:false,id:""})

  const closeDelete = ()=>{
    setIsDeleteOpen(false)
}
  const openDelete = (id)=>{
    setIsDeleteOpen({open:true,id:id})
}



  // Delete row
  const handleDelete = async()=>{
    await axios.delete(`${url}/procFile/${isDeleteOpen.id}`,{withCredentials:true}).then((resp)=>{
        const data = timesheetData.filter((dt)=>dt.id!==isDeleteOpen.id)
        setTimeSheetData(data)
        setOpenSuccess({open:true,message:"deleted Successfully"})
        closeDelete()
        
    }).catch((error)=>{
        if (error.response && error.response.data && error.response.data.error) {
            setOpenError({open:true,message:`${error.response.data.error}`});
          } else {
            setOpenError({open:true,message:"An unknown error occurred"});
          }
    })
}



  
    return (
      <>
        <TitleChange name={`Procurement Files | ${settings.name}`} />
        <PageTitle>Procurement | Files</PageTitle>
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

  
        {/* <CTA /> */}
        
        {/* <!-- Cards --> */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Total Projects " value={countsData.projectCount}>
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
  
          <InfoCard title="Bids Registered" value={countsData.bidCount}>
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
  
          <InfoCard title="Active Projects" value={countsData.activeProjects}>
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
  
          <InfoCard title="Completed Projects" value={countsData.completedProjects}>
            <RoundIcon
              icon={ChatIcon}
              iconColorClass="text-teal-500 dark:text-teal-100"
              bgColorClass="bg-teal-100 dark:bg-teal-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
  



        <TableContainer>
      {/* Delete Confirm section */}
        <Modal isOpen={isDeleteOpen.open} onClose={closeDelete}>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to perform this action?</p>
          </ModalBody>
          <ModalFooter>
            <button className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600" onClick={handleDelete}>
              Confirm
            </button>
          </ModalFooter>
      </Modal>

        {/* End of delete Section */}
  
      
        </TableContainer>

        <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalHeader>Register New Pr.File</ModalHeader>
      <ModalBody>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          
          <Label>
            <span>Name</span>
            <Input
            //   type="date"
              className="mt-1"
            //   value={prFileForm.date}
              name="name"
              onChange={(e)=>setPrFileForm({...prFileForm,name:e.target.value})}
              required
            />
          </Label>

          
          <Label>
            <span>Project |<span className='text-sm italic text-purple-500'>(approved projects only)</span></span>
            <Select
              className="mt-1"
              name="ContractTypeId"
            //   value={procurementForm.ContractTypeId}
              onChange={(e)=>setPrFileForm({...prFileForm,ProjectId:e.target.value})}
              required
            >
              <option value="">Select a Related Project</option>
              {projects.map((ctr,i)=>(
                <option key={i} value={ctr.id}>{ctr.name}</option>
              ))}
              
            </Select>
          </Label>




          <label htmlFor="file" className="w-full p-4 rounded-lg shadow-lg dark:text-white cursor-pointer text-center bg-gradient-to-r from-purple-400 to-pink-500 text-black hover:from-pink-500 hover:to-purple-400 transition duration-300">
                <FaCloudUploadAlt className="w-8 h-8 mx-auto mb-2" />
                <span className="text-lg font-semibold">Upload File</span>
              </label>
              <input
                type="file"
                id="file"
                className="hidden"
                name="image"
                onChange={(e)=>setPrFileForm({...prFileForm,image:e.target.files[0]})}
              />


              
        </div>
        <div className="hidden sm:block">

        <Button className="mt-6" type="submit">Submit</Button>
        </div>
           <div className=" mt-2 block  sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
      
        </form>
      </ModalBody>
      <ModalFooter>
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

          {/* <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div> */}
      </ModalFooter>
    </Modal>


  
        


        <TableContainer className="bg-white rounded-lg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-semibold">Name</TableCell>
            <TableCell className="font-semibold">FileUrl</TableCell>
            <TableCell className="font-semibold">Project</TableCell>
            <TableCell className="font-semibold text-center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prFiles?prFiles.map((row, i) => (
            <Fragment key={i}>
              <TableRow>
                <TableCell><span className="text-sm font-semibold">{row?.Name}</span></TableCell>
                <TableCell><span className="text-sm font-semibold">
                <div className="flex items-center text-sm">
                    <div>
                      <img style={{ width: 30 }} src={row?.image} />
                    </div>
                  </div>
                  
                  </span></TableCell>
                <TableCell><span className="text-sm font-semibold">{row?.position}</span></TableCell>
               
                <TableCell className="flex justify-center space-x-2">
                  <Link to={`/app/prFiles/${row.id}`}>
                  <Button layout="link" size="small">
                    <EditIcon className="h-5 w-5 text-blue-600" />
                  </Button>
                  </Link>
                  <Button layout="link" size="small" onClick={() => openDelete(row.id)}>
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            </Fragment>
          )):""}
        </TableBody>
      </Table>
    </TableContainer>

      </>
    )


   

}




export default ProcurementFilesList