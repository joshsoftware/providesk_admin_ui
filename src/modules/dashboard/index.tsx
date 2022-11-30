import React, { useCallback, useContext, useMemo, useState } from 'react';

import TablePagination from '@mui/material/TablePagination';
import { Box, IconButton } from '@mui/material';

import { useGetRequestsList } from './dashboard.hooks';
import { CustomSelect } from 'modules/shared/Select';
import Search from 'modules/shared/Search';
import ComplaintCard from 'modules/shared/ComplaintCard';
import { UserContext } from 'App';
import { useCategories, useDepartments } from 'modules/Category/category.hook';
import { CheckBox } from '@mui/icons-material';

import { Checkbox, Typography } from '@mui/material';
import './dashboard.scss';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import { Routes, useNavigate, useRoutes } from 'react-router-dom';
import ROUTE from 'routes/constants';
import Loader from 'modules/Auth/components/Loader';
import { Button } from 'modules/shared/Button';
import { UploadImageToS3WithReactS3 } from 'apis/utils/mediaUpload/Add';

const statusOptions = [
  {
    value: 'reopen',
    label: 'reopen',
  },
  {
    value: 'assigned',
    label: 'Assigned',
  },
  {
    value: 'inprogress',
    label: 'In Progress',
  },
  {
    value: 'resolved',
    label: 'Resolved',
  },
  {
    value:"for_approval",
    label :"For Approval"
  }
];


const typeOption = [{value:"complaint",label:"Complaint"},{value:"request",label:"Request"}]

const DEFAULT_FILTERS = {
  status: '',
  type:'',
  department: '',
  title: '',
  category:'',
  page: 0,
  perPage: 10,
  assig_to_me:false,
  created_by_me:false,
};



const Dashboard = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isLoading } = useGetRequestsList(filters);
  const {userAuth}= useContext(UserContext);
  
 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [departmentId, setDepartmentId] = useState<number>(1);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, [event.target.name]: event.target.value }));
  };

  const onSearchTile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, title: event.target.value }));
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const { data: categoriesList, isLoading: listFetching } =
  useCategories(departmentId);
  const categoryOptions = useMemo(() => {
    return (
      categoriesList?.map((cate) => ({
        label: cate.name,
        value: cate.name,
      })) || []
    );
  }, [categoriesList]);
const { data: departmentsList, isLoading: departmentsFetching } =
  useDepartments(1);

const deptOptions = useMemo(() => {
  return (
    departmentsList?.map((dept) => ({
      label: dept.name,
      value: dept.name,
    })) || []
  );
}, [departmentId, departmentsList]);

  const updatedData = data?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const updateddataSearch = useMemo(()=>{
   if(filters.title.length>0){
    return updatedData.filter(item=>item.title.toLowerCase().includes(filters.title.toLowerCase()))
   }
   return updatedData
  },[updatedData,filters.title]);

  
const onClickPlus = ()=>{
  navigate(ROUTE.TICKET)
}
  return (
    <Box sx={{display: 'flex', flexDirection: 'column' ,}} >
      <Box sx={{display: 'flex', gap: '1.5rem', mb: '1.5rem'}} className='complaint-card-filters'>
        <Box sx={{display: 'grid', gap: '1.5rem'}} className='filter-input-group flex-1'>
         {userAuth.role !== "employee" && < ><CustomSelect
            label={'Status'}
            options={statusOptions}
            value={filters.status}
            onChange={handleChange}
            name='status'
          />
             <CustomSelect
            label={'departments'}
            options={deptOptions}
            value={filters.department}
            onChange={(e)=>{
              setDepartmentId((departmentsList.filter((item)=>item.name === e.target.value))[0].id)
              
              setFilters((p) => ({ ...p, "category": "" }))
              handleChange(e)}
            
            }
            name='department'
          />
           <CustomSelect
            label={'Category'}
            options={categoryOptions}
            value={filters.category}
            onChange={handleChange}
            name='category'
          /></>}
          <Box sx={{display:"flex"}}>
            <Typography>Assign to me</Typography>
          <Checkbox checked={filters.assig_to_me} onChange={()=> setFilters((p) => ({ ...p, "assig_to_me": !filters.assig_to_me }))}/>
          </Box>
          <Box sx={{display:"flex"}}>
            <Typography>Created by me</Typography>
          <Checkbox checked={filters.created_by_me} onChange={()=> setFilters((p) => ({ ...p, "created_by_me": !filters.created_by_me }))}/>
          </Box>
        
          <Search
            label={'Search'}
            value={filters.title}
            onChange={onSearchTile}
            name='title'
            placeholder='Enter Title'
          />
        </Box>
      
           <Button onClick={()=>setFilters(DEFAULT_FILTERS)}>Reset</Button>
      </Box>
      {isLoading ? <Loader isLoading={isLoading}/> : updateddataSearch?.length === 0? 
      <Typography sx={{textAlign:"center"}}>No Data</Typography> : 
      <Box sx={{display: 'grid', gap: '1.5rem'}} className='complaint-card-grid'>
        {updateddataSearch?.map((complaint) => (
          <Box className='element'>
            <ComplaintCard details={complaint} />
          </Box>
        ))}
      </Box>}
      
      <TablePagination
        component='div'
        count={Math.ceil(updatedData?.length/rowsPerPage||0)}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{fontSize: '0.75rem'}}
      />
      <Box sx={{display:"flex", flexDirection:"row-reverse", position:"sticky", bottom:0,zIndex:10000}}>
        <IconButton onClick={onClickPlus}><AddCircleSharpIcon color="primary" fontSize='large'/></IconButton>
      </Box>
      <UploadImageToS3WithReactS3/>
    </Box>
  );
};

export default Dashboard;
