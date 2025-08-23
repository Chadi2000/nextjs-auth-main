'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEye, FaFilter, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PopUp from '../../utils/PopUp';
import { toast } from 'react-toastify';
import Loader from '../../utils/Loader';
import Drawer from '../../utils/Drawwer';
import LabledInput from '../../utils/LabeledInput';

interface Category {
  category_id: number;
  name: string;
  description: string;
}

export default function CategoriesComponent({ categories }: { categories: Category[] }) {

  const [deleteInfo, setDeleteInfo] = useState({
    showDeletePopUp:false,
    selectedId: '',
  }) 
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [categoriesData, setCategoriesData] = useState(categories);
  const [selectAll, setSelectAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openAddCategoryPopUp, setOpenAddCategoryPopUp] = useState(false)
  const [filtersData, setFilterData] = useState({
    email:'',
    phoneNumber: ""
  })
  const [categoryReq, setCategoryReq ] = useState({
    id:"",
    name:"",
    description:""
  })
  const router = useRouter();

  const closeAddCategoryPopup = () =>{
    setCategoryReq({
        id:"",
        name:"",
        description:""
    })
    setOpenAddCategoryPopUp(false)
  } 

  const cancelDelete = () =>{
   setDeleteInfo({
    showDeletePopUp:false,
    selectedId:''
   })
  }

  const handleSelectAll = () =>{
    if(selectAll){
        setSelectedIds([])
    }else{
         setSelectedIds(categoriesData.map((c) => c.category_id));
    }
    setSelectAll(!selectAll)
  }

    function handleSelectCategory(categoryId: number) {
    if (selectedIds.includes(categoryId)) {
        setSelectedIds((prev) => prev.filter((id) => id !== categoryId));
    } else {
        setSelectedIds((prev) => [...prev, categoryId]);
    }
    }

    async function AddCategory() {
    if (categoryReq.name === "" || categoryReq.description === "") {
        toast("Please fill all inputs", { type: "error" });
        return;
    }

    try {
        const request = {
            name: categoryReq.name,
            description: categoryReq.description,
        };

        const response = await fetch("/api/category", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        });

        const data = await response.json();
        
        if (!response.ok) {
        toast(data.message || "Failed to add category", { type: "error" });
        return;
        }

        toast("Category Added Successfully", { type: "success" });
        closeAddCategoryPopup()

    } catch (err) {
        console.error(err);
        toast("Internal Server Error", { type: "error" });
    }
    }



  return (
    <div className='flex flex-col gap-4 mt-4'>
      <div className='flex items-center justify-between'>
       
        <span className='text-[20px] font-semibold mb-4'>Categories</span>
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
            // onClick={clearFilter}
          >
            <FaTimes />
            Clear Filter
          </button>
          <button onClick={() => setOpenAddCategoryPopUp(true)} className='flex items-center gap-1 text-white px-3 py-2 bg-green-400 hover:bg-green-500 transition duration-300'>
            <FaPlus />
            Add Category
          </button>
        </div>

      </div>


      <div className="overflow-x-auto mt-4">
        <table className="table-auto w-full bg-white">
            <thead>
              <tr className="bg-black text-white">
                <th className='px-4 py-2 rounded-tl-2xl'>
                    <input 
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                     />
                </th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Descriptiom</th>
                <th className="px-4 py-2 rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesData.length > 0 ? (
                categoriesData.map((category) => (
                  <tr key={category.category_id} className="text-center border">
                    <td>
                        <input 
                        type='checkbox' 
                        checked={selectedIds.includes(category.category_id)}
                        onChange={() => handleSelectCategory(category.category_id)}
                        />
                    </td>
                    <td className="px-4 py-2">{category.category_id}</td>
                    <td className="px-4 py-2">{category.name}</td>
                    <td className="px-4 py-2">{category.description}</td>
                    <td className="px-4 py-2 flex justify-center items-center gap-1">
                      <FaEdit
                        className="cursor-pointer text-blue-600"
                        onClick={() => router.push(`/admin/category/${category.category_id}`)}
                      />
                      <FaTrash
                        // onClick={() => {
                        //   setDeleteInfo({
                        //     selectedId: category.category_id,
                        //     showDeletePopUp: true,
                        //   });
                        // }}
                        className="cursor-pointer"
                        color="red"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Categories Found
                  </td>
                </tr>
              )}

             
            </tbody>
        </table>

        </div>

      {deleteInfo.showDeletePopUp && (
        <PopUp
          isOpen={deleteInfo.showDeletePopUp}
          title="Delete Category"
          onClose={cancelDelete}
        >
          <div className="flex flex-col gap-4">
            {/* Message */}
            <p className="text-sm text-gray-700 text-center">
              Are you sure you want to delete this categpry{' '}
              <span className="text-red-600 font-semibold">
                {/* {deleteInfo.selectedName} */}
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
                // onClick={() => deleteUser(deleteInfo.selectedId)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Deletee
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
            //   onClick={getUsers}
              >
                <FaFilter />
                Filter Users
              </button>
            </div>
          </div>
           

          
        </Drawer>

        <PopUp
        isOpen={openAddCategoryPopUp}
        onClose={closeAddCategoryPopup}
        title='Add New Category'

        >
            <input 
            type='text'
            placeholder='Category Name'
            value={categoryReq.name}
            onChange={(e) =>
                setCategoryReq((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input 
            type='text'
            placeholder='Category Description'
            value={categoryReq.description}
            onChange={(e) =>
                setCategoryReq((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2">
                <button
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                    onClick={closeAddCategoryPopup}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    onClick={AddCategory}
                >
                    Create
                </button>
            </div>


        </PopUp>

    </div>
  );
}