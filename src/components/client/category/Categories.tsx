'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEye, FaFilter, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PopUp from '../../utils/PopUp';
import { toast } from 'react-toastify';
import Loader from '../../utils/Loader';
import Drawer from '../../utils/Drawwer';
import LabledInput from '../../utils/LabeledInput';
import ShowingTotal from '@/components/utils/ShowingTotal';
import Pagination from '@/components/utils/Pagination';

interface Category {
  category_id: number;
  name: string;
  description: string;
}

interface CategoriesInfo {
  categories: Category[];
  totalCategories: number;
  totalPages: number;
}

export default function CategoriesComponent(CategoriesInfoOrgin: CategoriesInfo) {

  const [categoriesInfo, setCategoriesInfo] = useState({
    totalPages: CategoriesInfoOrgin.totalPages,
    totalCategories: CategoriesInfoOrgin.totalCategories
  })
  const [deleteInfo, setDeleteInfo] = useState({
    showDeletePopUp: false,
    selectedId: '',
  })
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [categoriesData, setCategoriesData] = useState(CategoriesInfoOrgin.categories);
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openAddCategoryPopUp, setOpenAddCategoryPopUp] = useState(false)
  const [openDeleteCategoryPopUp, SetOpenDeleteCategoryPopUp] = useState(false)
  const [categoryReq, setCategoryReq] = useState({
    category_id: "",
    name: "",
    description: ""
  })
  const [filterCategory, setFilterCategory] = useState({
    name: "",
    description: "",
    limit: 10,
    page: 1
  })
  const router = useRouter();
  const closeAddCategoryPopup = () => {
    setCategoryReq({
      category_id: "",
      name: "",
      description: ""
    })
    setOpenAddCategoryPopUp(false)
  }

  const cancelDelete = () => {
    setDeleteInfo({
      showDeletePopUp: false,
      selectedId: ''
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
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

  async function openEditPopUp (categoryId : number) {
    let response = await fetch(`/api/category/${categoryId}`,{
      method:"GET",
       headers: {
          "Content-Type": "application/json",
        },
    })
    const data = await response.json()

    if(data.success){
      setCategoryReq(data.category)
      setOpenAddCategoryPopUp(true)
    }else{
      toast("Category Not Found",{type:"error"})
      return
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
      FilterCategories()

    } catch (err) {
      console.error(err);
      toast("Internal Server Error", { type: "error" });
    }
  }

  async function FilterCategories(page = 0) {
    try {
      setIsLoading(true)
      let request = filterCategory;

      if (page !== 0) {
        request['page'] = page
      }

      const response = await fetch("/api/category/filtercategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const responseData = await response.json();
      if (!response.ok) {
        toast(responseData.message || "Failed to Get categories", { type: "error" });
        return;
      }
      setIsOpenDrawer(false)
      setCategoriesData(responseData.data)
      setCategoriesInfo((prev) => ({
        ...prev,
        totalPages: responseData?.meta.totalPages,
        totalCategories: responseData?.meta.total,
      }))
      setIsLoading(false)

    } catch (err) {
      console.error(err);
      toast("Internal Server Error", { type: "error" });
    }
  }

  async function clearFilter() {
    try {
      setIsLoading(true)
      let request = {
        name: "",
        description: "",
        limit: 10,
        page: 1
      }
      setFilterCategory(request)
      const response = await fetch("/api/category/filtercategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const responseData = await response.json();
      if (!response.ok) {
        toast(responseData.message || "Failed to Get categories", { type: "error" });
        return;
      }
      setCategoriesData(responseData.data)
      setCategoriesInfo((prev) => ({
        ...prev,
        totalPages: responseData?.meta.totalPages,
        totalCategories: responseData?.meta.total,
      }))

      setIsLoading(false)

    } catch (err) {
      console.error(err);
      toast("Internal Server Error", { type: "error" });
    }
  }

  async function EditCategory() {
    let request = categoryReq;
    if(!request.category_id){
      toast("Category Not Found",{type:"error"})
      return;
    }

    const response = await fetch(`/api/category/${categoryReq.category_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json()
    if(data.success){
      toast("Category Updated Successfully", {type:"success"})
      closeAddCategoryPopup()
      clearFilter();
    }
    
  }

  const openDeleteCategory = () =>{
    if (selectedIds.length === 0) {
      toast("Please Select At Least 1 Category To delete", {type:"error"})
    }else{
      SetOpenDeleteCategoryPopUp(true);
    }
  }

  async function DeleteCategory() {
    let request = {
      ids: selectedIds
    }
    console.log(selectedIds)
    if(selectedIds.length === 0){
       toast("Please Select At Least 1 Category To delete", {type:"error"})
       return
    }
    
    const response = await fetch("/api/category/deletcategories",{
      method:"POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request)
    })

    const data = await response.json();

    if(data.success){
      toast(`${data.deletedCount} Categories Have Been Deleted SuccessFully`,{type:"success"})
      SetOpenDeleteCategoryPopUp(false)
      clearFilter()
    }else{
      toast("Failed To Delete The Selected Categories")
    }

  }

  

  return (
    <div className='flex flex-col gap-4 mt-4'>
      <div className='flex items-center justify-between'>

        <span className='text-[20px] font-semibold mb-4'>Categories</span>
        <div className="flex gap-2 items-center">
           <button
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            onClick={clearFilter}
          >
            <FaTimes />
            Clear Filter
          </button>

          <button
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsOpenDrawer(true)}
          >
            <FaFilter />
            Filter
          </button>

          <button className='flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600' 
            onClick={openDeleteCategory}
          >
            <FaTrash />
            Delete Categories
          </button>
         
          <button onClick={() => setOpenAddCategoryPopUp(true)} className='flex items-center gap-1 text-white px-3 py-2 bg-green-400 hover:bg-green-500 transition duration-300'>
            <FaPlus />
            Add Category
          </button>
        </div>

      </div>

      {isLoading ? (
        <Loader />
      ) :(
        <div className='flex flex-col'>
          <div className="overflow-x-auto my-4">
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
                <th className="px-4 py-2">Description</th>
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
                        onClick={() => openEditPopUp(category.category_id)}
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
        <div className='flex items-center justify-between'>
          <ShowingTotal limit={categoriesData.length} total={categoriesInfo.totalCategories} type='Categories' />
          <Pagination totalPages={categoriesInfo.totalPages} currentPage={filterCategory.page} onChange={(newPage) => {
            setFilterCategory((prev) => ({
              ...prev,
              page: newPage
            }))
            FilterCategories(newPage)
          }} />
        </div>
        </div>
      )}
      
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


      <Drawer isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} >
        <div className='flex flex-col gap-3'>
          <LabledInput label='Search By Name' InputType='text' placeholder='filter by Name' value={filterCategory.name}
            onChange={e =>
              setFilterCategory(prev => ({
                ...prev,
                name: e.target.value
              }))
            }

          />
          <LabledInput label='Search By Description' InputType='text' placeholder='filter by Description' value={filterCategory.description}
            onChange={e =>
              setFilterCategory(prev => ({
                ...prev,
                description: e.target.value
              }))

            }
          />

          <div className='flex items-center justify-end'>
            <button className='float-right bg-blue-500 text-white px-2 py-1 rounded-md shadow-md flex gap-1 items-center'
              onClick={() => {
                FilterCategories()
              }}
            >
              <FaFilter />
              Filter Categories
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
            onClick={categoryReq.category_id? EditCategory : AddCategory}
          >
           {
            categoryReq.category_id ? "Update": "Create"
           }
          </button>
        </div>


      </PopUp>

      <PopUp
        isOpen={openDeleteCategoryPopUp}
        onClose={() => SetOpenDeleteCategoryPopUp(false)}
        title='Delete Categories'
      >
        <p className="text-gray-700 text-base">
          Are you sure you want to delete these categories?
        </p>

        <div className="flex justify-end gap-3 pt-6">
          <button
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={()=> SetOpenDeleteCategoryPopUp(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
            onClick={DeleteCategory}
          >
            Delete
          </button>
        </div>

      </PopUp>

    </div>
  );
}