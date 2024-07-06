import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Select from "react-select";
import Part from "./Part";
import Pagination from "./Pagination";
import "../dark_theme.css"; // Import custom CSS file

interface PartData {
  partNumber: string;
  yearStart: number;
  yearEnd: number;
  make: string;
  model: string;
  imageLinks: string[];
}

const PartList: React.FC = () => {
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(100); // Set items per page to 100

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const formattedData = jsonData.slice(1).map((row) => ({
          partNumber: row[0] as string,
          yearStart: row[1] as number,
          yearEnd: row[2] as number,
          make: row[3] as string,
          model: row[4] as string,
          imageLinks: row.slice(5).filter((link: string) => link) as string[],
        }));

        setParts(formattedData);
        setFilteredParts(formattedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredParts(parts);
    } else {
      setFilteredParts(
        parts.filter((part) =>
          part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, parts]);

  const handleSearchChange = (selectedOption: any) => {
    setSearchTerm(selectedOption ? selectedOption.value : "");
  };

  const partOptions = parts.map((part) => ({
    value: part.partNumber,
    label: part.partNumber,
  }));

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>
      <div className="input-group mb-3">
        <Select
          options={partOptions}
          onChange={handleSearchChange} // Use onChange to handle selection
          isClearable
          placeholder="Search for a part number..."
          classNamePrefix="Select"
        />
      </div>
      {currentItems.map((part, index) => (
        <Part
          key={index}
          partNumber={part.partNumber}
          yearStart={part.yearStart}
          yearEnd={part.yearEnd}
          make={part.make}
          model={part.model}
          imageLinks={part.imageLinks}
        />
      ))}
      <Pagination
        totalPages={totalPages}
        paginate={paginate}
        currentPage={currentPage}
        maxVisibleButtons={5}
      />
    </div>
  );
};

export default PartList;
