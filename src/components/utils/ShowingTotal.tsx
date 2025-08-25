import React from 'react'

interface ShowingInfo {
    limit: number
    total: number
    type: string
}

function ShowingTotal(ShowingInfo: ShowingInfo) {
  return (
    <div className='font-semibold my-2'>
            Showing {ShowingInfo.limit} of {ShowingInfo.total} {ShowingInfo.type}
    </div>
  )
}

export default ShowingTotal