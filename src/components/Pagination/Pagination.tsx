import {useState, FC, ChangeEvent, useEffect} from 'react';
import chevronRight from "../../images/ChevronRight.svg";
import chevronLeft from "../../images/ChevronLeft.svg";
import chevronsRight from "../../images/ChevronsRight.svg";
import chevronsLeft from "../../images/ChevronsLeft.svg";
import {CustomSelect} from '../Pagination/CustomSelect/CustomSelect';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    tasksPerPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
    onTasksPerPageChange: (value: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
    currentPage,
    tasksPerPage,
    totalTasks,
    onPageChange,
    onTasksPerPageChange
}) => {
    const [pageInput, setPageInput] = useState<string>('');
    const totalPages = Math.ceil(totalTasks / tasksPerPage);

    useEffect(() => {
        setPageInput('');
    }, [currentPage]);

    if (totalPages === 0) {
        return <div className={styles.notFound}>Нет задач</div>;
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const handleFirstPage = () => {
        onPageChange(1);
    };

    const handleLastPage = () => {
        onPageChange(totalPages);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPageInput(value);

        const numericValue = Number(value);
        if (!isNaN(numericValue) && numericValue > 0 && numericValue <= totalPages) {
            onPageChange(numericValue);
        }
    };

    const handleTasksPerPageChange = (value: number) => {
        onTasksPerPageChange(value);
        onPageChange(1);
    };

    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            <div className={styles.taskOnPageContainer}>
                <label className={styles.labelTasksPerPage} htmlFor="tasksPerPage">
                    Task on page
                </label>
                <CustomSelect
                    options={[5, 10, 15]}
                    value={tasksPerPage}
                    onChange={handleTasksPerPageChange}
                />
            </div>

            <div className={styles.paginationPageNumber}>
                <button
                    className={styles.paginationButton}
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                >
                    <img
                        src={chevronsLeft}
                        alt="First Page"
                        className={currentPage === 1 ? styles.disabledArrow : ''}
                    />
                </button>

                <button
                    className={styles.paginationButton}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    <img
                        src={chevronLeft}
                        alt="Previous Page"
                        className={currentPage === 1 ? styles.disabledArrow : ''}
                    />
                </button>

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={
                            currentPage === page
                                ? `${styles.pageButton} ${styles.activePage}`
                                : styles.pageButton
                        }
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={styles.paginationButton}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    <img
                        src={chevronRight}
                        alt="Next Page"
                        className={currentPage === totalPages ? styles.disabledArrow : ''}
                    />
                </button>

                <button
                    className={styles.paginationButton}
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                >
                    <img
                        src={chevronsRight}
                        alt="Last Page"
                        className={currentPage === totalPages ? styles.disabledArrow : ''}
                    />
                </button>
            </div>

            <div className={styles.pageInputContainer}>
                <p className={styles.labelGoTo}>Go to page</p>
                <input
                    type="text"
                    value={pageInput}
                    onChange={handleInputChange}
                    placeholder={currentPage.toString()}
                    className={styles.taskOnPageInput}
                />
            </div>
        </div>
    );
};
