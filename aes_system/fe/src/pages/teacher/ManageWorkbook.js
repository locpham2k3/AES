import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTeacherWorkbooks,
  fetchTotalTeacherWorkbooks,
} from "../../redux/TeacherSlide";
import { useTable, usePagination } from "react-table";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./ManageWorkbook.css"; // Import CSS file
import LoadingBar from "../../components/LoadingBar";
import { useNavigate } from "react-router-dom";

const levelOptions = [
  { id: 1, name: "A1" },
  { id: 2, name: "A2" },
  { id: 3, name: "B1" },
  { id: 4, name: "B2" },
  { id: 5, name: "C1" },
  { id: 6, name: "C2" },
];

const ManageWorkbook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // New state to control the display of the loading indicator with delay
  const [showLoading, setShowLoading] = useState(false);

  // Form state for controlled inputs

  useEffect(() => {
    const tokens = {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
    const condition = {
      offset: page * pageSize,
      limit: pageSize,
      direction: "asc",
      sortBy: "ID",
    };
    dispatch(fetchTeacherWorkbooks({ tokens, condition }));
    dispatch(fetchTotalTeacherWorkbooks({ tokens }));
  }, [dispatch, page, pageSize]);

  // Renamed variables to avoid conflicts
  const {
    data: workbookData,
    loading: workbookLoading,
    error: workbookError,
    total,
  } = useSelector((state) => state.workbookTeacher);

  // Effect to handle the 2-second delay for loading indicator
  useEffect(() => {
    let timer;

    if (workbookLoading) {
      // Start a 2-second timer
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 2000);
    } else {
      // If not loading, ensure the loading indicator is hidden
      setShowLoading(false);
    }

    // Cleanup the timer when loading state changes or component unmounts
    return () => clearTimeout(timer);
  }, [workbookLoading]);

  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "description",
        accessor: "description",
      },
      {
        Header: "Level",
        accessor: "levelId",
        Cell: ({ value }) => {
          const level = levelOptions.find((lvl) => lvl.id === value);
          return level ? level.name : value;
        },
      },
      {
        Header: "createDate",
        accessor: "createDate",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const statusText = value === "0" ? "Active" : "Inactive";
          const statusStyle =
            value === "0"
              ? { color: "green", fontWeight: "bold" }
              : { color: "red", fontWeight: "bold" };
          return <span style={statusStyle}>{statusText}</span>;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "5px" }}
          >
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() =>
                navigate(`/teacher/manage-essay/detal-esaay/${row.original.id}`)
              }
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: workbookData || [], // Ensure data is an array
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(total / pageSize),
    },
    usePagination
  );

  useEffect(() => {
    setPage(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  return (
    <>
      <div className="table-container">
        <h2 style={{ textAlign: "center" }}>List Workbooks</h2>

        {/* Display LoadingBar only if showLoading is true */}
        {showLoading && (
          <div className="loading-container">
            <LoadingBar />
          </div>
        )}

        {/* Display errors immediately if any */}
        {workbookError && (
          <p style={{ color: "red" }}>Error: {workbookError}</p>
        )}

        {/* Display the table only when not loading */}
        {!showLoading && !workbookLoading && (
          <table {...getTableProps()} className="custom-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row); // Ensure row is prepared before using
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!showLoading && !workbookLoading && (
          <div className="pagination">
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              variant="outlined"
            >
              {"<<"}
            </Button>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="outlined"
            >
              {"<"}
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="outlined"
            >
              {">"}
            </Button>
            <Button
              onClick={() => gotoPage(pageOptions.length - 1)}
              disabled={!canNextPage}
              variant="outlined"
            >
              {">>"}
            </Button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageWorkbook;
