import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Select from "react-select";
import axios from "axios";
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
  hasBrokenLinks: boolean;
}

const PartList: React.FC = () => {
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(50);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [imageCountFilter, setImageCountFilter] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        setSheetNames(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0]); // Default to the first sheet
        await loadSheetData(workbook, workbook.SheetNames[0]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSheetChange = async (selectedOption: any) => {
    setSelectedSheet(selectedOption.value);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput.files?.[0]) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        await loadSheetData(workbook, selectedOption.value);
      };
      reader.readAsArrayBuffer(fileInput.files[0]);
    }
  };

  const loadSheetData = async (workbook: XLSX.WorkBook, sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const transformedData = await transformJobberData(jsonData);
    setParts(transformedData);
    setFilteredParts(transformedData);
  };

  const transformJobberData = async (data: any[]): Promise<PartData[]> => {
    const headers = data[2]; // Use the 3rd row as headers (index 2)
    const rows = data.slice(3); // Use data starting from the 4th row (index 3)
    const headerIndex = (header: string): number => headers.indexOf(header);

    const partDataPromises = rows.map(async (row) => {
      const partNumber = row[headerIndex("Part Number")] || "";
      if (!partNumber) return null;

      const imageLinks = headers
        .filter((header: string) => header.startsWith("Image"))
        .map((header: string) => row[headerIndex(header)])
        .filter((link: any) => link);

      return {
        partNumber: partNumber,
        yearStart: parseInt(row[headerIndex("Start Year")]) || 0,
        yearEnd: parseInt(row[headerIndex("End Year")]) || 0,
        make: row[headerIndex("Make")] || "",
        model: row[headerIndex("Model")] || "",
        imageLinks: imageLinks,
        hasBrokenLinks: false, // Removed broken link logic
      };
    });

    return (await Promise.all(partDataPromises)).filter(Boolean) as PartData[];
  };

  useEffect(() => {
    let newFilteredParts = parts;

    if (searchTerm !== "") {
      newFilteredParts = newFilteredParts.filter((part) =>
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (imageCountFilter !== null) {
      newFilteredParts = newFilteredParts.filter(
        (part) => part.imageLinks.length === imageCountFilter
      );
    }

    setFilteredParts(newFilteredParts);
    setCurrentPage(1); // Reset to first page when search term or filter changes
  }, [searchTerm, parts, imageCountFilter]);

  const handleSearchChange = (selectedOption: any) => {
    setSearchTerm(selectedOption ? selectedOption.value : "");
  };

  const partOptions = parts.map((part) => ({
    value: part.partNumber,
    label: part.partNumber,
  }));

  const sheetOptions = sheetNames.map((sheetName) => ({
    value: sheetName,
    label: sheetName,
  }));

  const imageCountOptions = [
    { value: 0, label: "0 Images" },
    { value: 1, label: "1 Image" },
    { value: 2, label: "2 Images" },
    { value: 3, label: "3 Images" },
    { value: 4, label: "4 Images" },
    { value: 5, label: "5 Images" },
    // Add more options as needed
  ];

  const handleImageCountChange = (selectedOption: any) => {
    setImageCountFilter(selectedOption ? selectedOption.value : null);
  };

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
          accept=".csv, .xls, .xlsx"
          onChange={handleFileUpload}
        />
      </div>
      {sheetNames.length > 0 && (
        <div className="input-group mb-3">
          <Select
            options={sheetOptions}
            onChange={handleSheetChange}
            defaultValue={sheetOptions[0]}
            placeholder="Select a sheet..."
            classNamePrefix="Select"
            styles={{ control: (provided) => ({ ...provided, width: 300 }) }} // Apply custom styles here
          />
        </div>
      )}
      <div className="row mb-3">
        <div className="col">
          <Select
            options={partOptions}
            onChange={handleSearchChange}
            isClearable
            placeholder="Search for a part number..."
            classNamePrefix="Select"
          />
        </div>
        <div className="col">
          <Select
            options={imageCountOptions}
            onChange={handleImageCountChange}
            isClearable
            placeholder="Filter by image count..."
            classNamePrefix="Select"
          />
        </div>
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
