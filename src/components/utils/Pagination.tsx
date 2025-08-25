import React, { useEffect, useState } from 'react'

interface Paginate{
    totalPages: number
    onChange: (page: number) => void;
    currentPage: number
}

function Pagination(PaginationInfo: Paginate) {

    let totalPages  = PaginationInfo.totalPages || 1
    const [currentPage, setCurrentPage] = useState(PaginationInfo.currentPage);

    function filterPages (visiblePages :number[], totalPages: number) {
        return visiblePages.filter(page => page <= totalPages);
    };

    function getVisiblePages (page: number, total: number)  {
        if (total < 7) {
        return filterPages([1, 2, 3], total);
        } else {
          if (page % 3 >= 0 && page > 2 && page + 2 < total) {
              //middles Pages
              return [1, page - 1, page, page + 1, total];
          } else if (page % 3 >= 0 && page > 2 && page + 2 >= total) {
              //end Pages
              return [1,total-3, total - 2, total - 1, total];
          } else {
              //first Pages
              return [1, 2, 3, total];
          }
        }
    };

    const [visiblePages, setVisiblePages] = useState(getVisiblePages(1, PaginationInfo.totalPages));

    function changePage(page: number) {
        const activePage = currentPage;

        if (page === activePage) {
            return;
        }
        setCurrentPage(page)
        let NewVisiblePages = getVisiblePages(page, PaginationInfo.totalPages)

        setVisiblePages(NewVisiblePages)
        PaginationInfo.onChange(page)
    }




 

  return (
       <div className="flex items-center gap-2">
        <div className="Table__prevPageWrapper">
          <button
            className={`${currentPage === 1 && "text-gray-400"}`}
            onClick={() => {
              if (currentPage === 1) return;
              changePage(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </div>
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index, array) => {
            return (
              <div className='flex items-center gap-1' key={index}>
                {array[index - 1] + 1 < page &&(
                   <span>...</span>
                )}
               
                  <button
                  key={page}
                  className={
                    `p-2 ${currentPage === page
                      ? "bg-blue-400 text-white rounded-md"
                      : "Table__pageButton"}`
                  }
                  onClick={() =>changePage(page)}
                >
                  {page}
                </button>
              </div>
             
            );
          })}
        </div>
        <div className="Table__nextPageWrapper">
          <button
            className={`${currentPage === totalPages && "text-gray-400"}`}
            onClick={() => {
              if (currentPage === totalPages) return;
              changePage(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
  )
}

export default Pagination