'use client';
import Pagination from '@/components/utils/Pagination';
import PopUp from '@/components/utils/PopUp';
import ShowingTotal from '@/components/utils/ShowingTotal';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { number } from 'zod'

interface Season {
    season_id: number
    name: string
}

interface SeasonsInfo {
    seasons: Season[]
    totalSeasons: number;
    totalPages: number;
}

function SeasonClientComponent(SeasonsInfoOrgin: SeasonsInfo) {
    const [seasonsInfo, setSeasonsInfo] = useState({
        totalPages: SeasonsInfoOrgin.totalPages,
        totalSeasons: SeasonsInfoOrgin.totalSeasons
    })
    const [isLoading, setIsLoading] = useState(false)
    const [openAddSeasonPopUp, setOpenAddSeasonPopUp] = useState(false)
    const [seasonsData, setSeasonsData] = useState(SeasonsInfoOrgin.seasons);
    const [selectAll, setSelectAll] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openDeleteSeasonPopUp, SetOpenDeleteSeasonPopUp] = useState(false)
    const [seasonReq, setSeasonReq] = useState({
        season_id: "",
        name: "",
      })
    console.log(SeasonsInfoOrgin.seasons)

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([])
        } else {
            setSelectedIds(seasonsData.map((s) => s.season_id));
        }
        setSelectAll(!selectAll)
    }

    function handleSelectSeason(seasonId: number) {
        if (selectedIds.includes(seasonId)) {
            setSelectedIds((prev) => prev.filter((id) => id !== seasonId));
        } else {
            setSelectedIds((prev) => [...prev, seasonId]);
        }
    }

    const closeAddSeasonPopup = () => {
        setSeasonReq({
        season_id: "",
        name: "",
        })
        setOpenAddSeasonPopUp(false)
    }

    return (
        <div className='flex flex-col gap-4 mt-4'>
            <div className='flex items-center justify-between'>
                <span className='text-[20px] font-semibold mb-4'>Seasons</span>
                <div className="flex gap-2 items-center">



                    <button className='flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                    // onClick={openDeleteCategory}
                    >
                        <FaTrash />
                        Delete Seasons
                    </button>

                    <button onClick={() => setOpenAddSeasonPopUp(true)} className='flex items-center gap-1 text-white px-3 py-2 bg-green-400 hover:bg-green-500 transition duration-300'>
                        <FaPlus />
                        Add Season
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
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
                                    <th className="px-4 py-2 rounded-tr-2xl">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasonsData.length > 0 ? (
                                    seasonsData.map((season) => (
                                        <tr key={season.season_id} className="text-center border">
                                            <td>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedIds.includes(season.season_id)}
                                                    onChange={() => handleSelectSeason(season.season_id)}
                                                />
                                            </td>
                                            <td className="px-4 py-2">{season.season_id}</td>
                                            <td className="px-4 py-2">{season.name}</td>

                                            <td className="px-4 py-2 flex justify-center items-center gap-1">
                                                <FaEdit
                                                    className="cursor-pointer text-blue-600"
                                                // onClick={() => openEditPopUp(season.season_id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            No Seasons Found
                                        </td>
                                    </tr>
                                )}


                            </tbody>
                        </table>
                    </div>
                    <div className='flex items-center justify-between'>
                        <ShowingTotal limit={seasonsData.length} total={seasonsInfo.totalSeasons} type='Seasons' />
                    </div>
                </div>
            )}

            <PopUp
                isOpen={openAddSeasonPopUp}
                onClose={closeAddSeasonPopup}
                title='Add New Season'

            >
                <input
                    type='text'
                    placeholder='Season Name'
                    value={seasonReq.name}
                    onChange={(e) =>
                        setSeasonReq((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                        onClick={closeAddSeasonPopup}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        // onClick={seasonReq.season_id ? EditCategory : AddCategory}
                    >
                        {
                            seasonReq.season_id ? "Update" : "Create"
                        }
                    </button>
                </div>


            </PopUp>

            <PopUp
                isOpen={openDeleteSeasonPopUp}
                onClose={() => SetOpenDeleteSeasonPopUp(false)}
                title='Delete Categories'
            >
                <p className="text-gray-700 text-base">
                    Are you sure you want to delete these categories?
                </p>

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => SetOpenDeleteSeasonPopUp(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                        // onClick={DeleteCategory}
                    >
                        Delete
                    </button>
                </div>

            </PopUp>

        </div>
    )
}

export default SeasonClientComponent