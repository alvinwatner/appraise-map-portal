import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChanged: (page: number) => void;
}

/**
 * Pagination component that handles displaying page navigation buttons.
 *
 * @param totalPages - Total number of pages.
 * @param initialPage - Initial page to start from, defaults to 1.
 *
 * Example behavior with totalPages = 8:
 *
 * - Initial State (currentPage = 1):
 *   - Buttons: `1` (current), `2`, `...`, `8`
 *
 * - Click Next (currentPage = 2):
 *   - Buttons: `1`, `2` (current), `3`, `...`, `8`
 *
 * - Click Next (currentPage = 3):
 *   - Buttons: `1`, `2`, `3` (current), `4`, `...`, `8`
 *
 * - Click Next (currentPage = 4):
 *   - Buttons: `1`, `...`, `3`, `4` (current), `5`, `...`, `8`
 *
 * - Click Next (currentPage = 5):
 *   - Buttons: `1`, `...`, `4`, `5` (current), `6`, `...`, `8`
 *
 * - Click Next (currentPage = 6):
 *   - Buttons: `1`, `...`, `5`, `6` (current), `7`, `8`
 *
 * - Click Next (currentPage = 7):
 *   - Buttons: `1`, `...`, `6`, `7` (current), `8`
 *
 * - Click Next (currentPage = 8):
 *   - Buttons: `1`, `...`, `7`, `8` (current)
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  initialPage = 1,
  onPageChanged,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [buttons, setButtons] = useState<JSX.Element[]>([]);

  /**
   * Handles page change when a button is clicked.
   * @param page - The page number to navigate to.
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Updates the pagination buttons based on the current page and total pages.
   */
  const renderButtons = useCallback(() => {
    const newButtons = [];
    // Always show the first page button unless it's the current page
    if (currentPage !== 1) {
      newButtons.push(
        <Button
          key="first"
          variant="outline"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
    }

    const prevPage = currentPage - 1;

    // Show ellipsis if there are pages between the first page and the current range
    if (prevPage > 2) {
      newButtons.push(<span key={prevPage}>...</span>);
    }

    // Show the previous page button if applicable
    if (currentPage > 2) {
      newButtons.push(
        <Button
          key="prev"
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </Button>
      );
    }

    // Show the current page button
    newButtons.push(
      <Button
        key={currentPage}
        className="bg-teal-600 hover:bg-teal-700 text-white w-full"
      >
        {currentPage}
      </Button>
    );

    // Show the next page button if applicable
    if (currentPage < totalPages - 1) {
      newButtons.push(
        <Button
          key="next"
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </Button>
      );
    }

    // Show ellipsis if there are pages between the current range and the last page
    if (currentPage < totalPages - 2) {
      newButtons.push(<span key={currentPage + 1}>...</span>);
    }

    // Always show the last page button unless it's the current page
    if (currentPage !== totalPages) {
      newButtons.push(
        <Button
          key="last"
          variant="outline"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    setButtons(newButtons);
  }, [currentPage, handlePageChange, totalPages]);

  // Update buttons whenever the current page changes
  useEffect(() => {
    onPageChanged(currentPage);
    renderButtons();
  }, [currentPage, onPageChanged, renderButtons]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdOutlineKeyboardArrowLeft size={20} />
      </Button>
      <div className="flex space-x-2">{buttons}</div>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardArrowRight size={20} />
      </Button>
    </div>
  );
};
