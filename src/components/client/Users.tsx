'use client';
import React, { useEffect, useState } from 'react';
import Input from "../utils/Input"
import { CiSearch } from "react-icons/ci";
import { FaEdit, FaEye, FaFilter, FaTimes, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PopUp from '../utils/PopUp';
import { toast } from 'react-toastify';
import Loader from '../utils/Loader';
import Drawer from '../utils/Drawwer';
import LabledInput from '../utils/LabeledInput';





export default function ClientUserComponent({ users }: { users: any[] }) {
  

  const [deleteInfo, setDeleteInfo] = useState({
    showDeletePopUp:false,
    selectedId: '',
    selectedName: ''
  }) 
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [usersData, setUsersData] = useState(users)
  const [currentPage, setCurrentPage] = useState(1)
  const userPerPage = 10;
  const [filtersData, setFilterData] = useState({
    email:'',
    phoneNumber: ""
  })

  const router = useRouter();

  const cancelDelete = () =>{
   setDeleteInfo({
    showDeletePopUp:false,
    selectedId:'',
    selectedName: ''
   })
  }

const deleteUser = async (id: string) => {
  try {
    
    setIsDeleteLoading(true)
    const response = await fetch(`/api/user/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()
    console.log(data)

    if (data.success) {
      console.log('nakppp')
      toast(data.message, { type: "success" })
      cancelDelete()
      router.refresh()
    } else {
      toast(data.message || 'Failed to delete user.', {type: "error"})
    }
    setIsDeleteLoading(false)
  } catch (error) {
    console.error('Delete failed:', error)
    toast('An unexpected error occurred.', {type: "error"})
    setIsDeleteLoading(false)
  }
}

const getUsers = async() =>{
  try{

    const response = await fetch(`/api/user/filter`,{
      method:"POST",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        email: filtersData.email,
        phoneNumber: filtersData.phoneNumber.toString()
      })
    })
    
    let data = await response.json();
    if(data.success){
      setUsersData(data?.data);
      setIsOpenDrawer(false)
    }

  } catch(err){
    console.error('Failed to Get Users: '+ err)
    toast('An unexpected error occurred.', {type: "error"})


  }
}

function clearFilter(){
  setUsersData(users);
  setFilterData({
    email:'',
    phoneNumber:""
  })
}



  return (
    <div className='flex flex-col gap-4 mt-4'>
      <div className='flex items-center justify-between'>
       
        <span className='text-[20px] font-semibold mb-4'>Users</span>
        <div className="flex gap-2 items-center">
          <button
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsOpenDrawer(true)}
          >
            <FaFilter />
            Filter
          </button>

          <button
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            onClick={clearFilter}
          >
            <FaTimes />
            Clear Filter
          </button>
        </div>

      </div>


      <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full bg-white">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-2 rounded-tl-2xl">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2 rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersData.length > 0 ? (
                usersData.map((user) => (
                  <tr key={user.id} className="text-center border">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phoneNumber}</td>
                    <td className="px-4 py-2">{new Date(user.updatedAt).toLocaleString()}</td>
                    <td className="px-4 py-2 flex justify-center items-center gap-1">
                      <FaEye
                        className="cursor-pointer text-blue-600"
                        onClick={() => router.push(`/admin/user/${user.id}`)}
                      />
                      <FaTrash
                        onClick={() => {
                          setDeleteInfo({
                            selectedId: user.id,
                            selectedName: user.name,
                            showDeletePopUp: true
                          });
                        }}
                        className="cursor-pointer"
                        color="red"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Users Found
                  </td>
                </tr>
              )}

             
            </tbody>
          </table>

        </div>

      {deleteInfo.showDeletePopUp && (
        <PopUp
          isOpen={deleteInfo.showDeletePopUp}
          title="Delete User"
          onClose={cancelDelete}
        >
          <div className="flex flex-col gap-4">
            {/* Message */}
            <p className="text-sm text-gray-700 text-center">
              Are you sure you want to delete{' '}
              <span className="text-red-600 font-semibold">
                {deleteInfo.selectedName}
              </span>
              ?
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition"
              >
                Cancel
              </button>
             {isDeleteLoading ? (
              <Loader />
             ) : (
               <button
                onClick={() => deleteUser(deleteInfo.selectedId)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Delete
              </button>
             )}
            </div>
          </div>
        </PopUp>
      )}


        <Drawer  isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} >
          <div className='flex flex-col gap-3'>
            <LabledInput label='Search By Email' InputType='text' placeholder='filter by email' value={filtersData.email} 
            onChange={e =>
              setFilterData(prev => ({
                ...prev,
                email: e.target.value
              }))
            }

            />
            <LabledInput label='Search By Phone Numver' InputType='number' placeholder='filter by phone number' value={filtersData.phoneNumber.toString()}
            onChange={e =>
              setFilterData(prev => ({
                ...prev,
                phoneNumber: e.target.value
              }))
              
            }
            />
            
            <div className='flex items-center justify-end'>
              <button className='float-right bg-blue-500 text-white px-2 py-1 rounded-md shadow-md flex gap-1 items-center'
              onClick={getUsers}
              >
                <FaFilter />
                Filter Users
              </button>
            </div>
          </div>
           

          
        </Drawer>

    </div>
  );
}