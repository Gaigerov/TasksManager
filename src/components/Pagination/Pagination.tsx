import {useState, FC, ChangeEvent} from 'react';
import chevronRight from "../../image/ChevronRight.svg";
import chevronLeft from "../../image/ChevronLeft.svg";
import chevronsRight from "../../image/ChevronsRight.svg";
import chevronsLeft from "../../image/ChevronsLeft.svg";
// import {CustomSelect} from '../CustomSelect/CustomSelect';
import {TaskItem} from '../../types/types';


interface Props {
    searchedTasks: TaskItem[];
    tasksPerPage: number;
    currentPage: number;
    setCurrentPage: (currentPage: number) => void;
}

export const Pagination: FC<Props> = ({searchedTasks, tasksPerPage, currentPage, setCurrentPage}) => {
    const [pageInput, setPageInput] = useState<string>('');
    const totalPages = Math.ceil(searchedTasks.length / tasksPerPage);

    if (totalPages === 0) {
        return <div>Tasks not found</div>;
    }


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const numericValue = Number(value);
        if (!isNaN(numericValue) && numericValue > 0 && numericValue <= totalPages) {
            setPageInput(value);
            setCurrentPage(numericValue); // Перейти на введенную страницу
        } else {
            setPageInput('');
        }
    };

    return (
        <div className='pagination'>
            <div className="taskOnPageContainer">
                <label className='labelTasksPerPage' htmlFor="tasksPerPage">Task on page</label>
                {/* <CustomSelect
                    options={[10, 25, 50, 100]}
                    value={tasksPerPage}
                /> */}
            </div>
            <div className="paginationPageNumber">
                <img
                    src={chevronsLeft}
                    onClick={handleFirstPage}
                    style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    alt="First Page"
                />
                <img
                    src={chevronLeft}
                    onClick={handlePrevPage}
                    style={{filter: currentPage === 1 ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    alt="Previous Page"
                />
                {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageClick(index + 1)}
                        className={currentPage === index + 1 ? 'active pageActiveNumberButton' : 'pageNumberButton'}
                    >
                        {index + 1}
                    </button>
                ))}
                <img
                    src={chevronRight} onClick={handleNextPage}
                    style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    alt="Next Page"
                />
                <img
                    src={chevronsRight} onClick={handleLastPage}
                    style={{filter: currentPage === totalPages ? 'invert(77%) sepia(8%) saturate(356%) hue-rotate(165deg) brightness(100%) contrast(83%)' : ''}}
                    alt="Last Page"
                />
            </div>
            <div className='pageInputContainer'>
                <p className='labelGoTo'>Go to page</p>
                <input
                    type="text"
                    value={pageInput}
                    onChange={handleInputChange}
                    min="1"
                    max={totalPages}
                    placeholder={currentPage.toString()}
                    className="taskOnPageInput"
                />
            </div>
        </div>
    );
};
