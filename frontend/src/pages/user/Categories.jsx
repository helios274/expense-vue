import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";

const Categories = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const editInputRef = useRef(null);
  const categoryListRef = useRef(null);

  // Fetch categories from API and populate select box
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/expenses/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      handleErrors(error);
    }
  }, []);

  const handleCreateCategory = async () => {
    try {
      await axios.post("/api/expenses/categories/", {
        name: newCategory,
      });
      toast.success("Category added successfully");
      fetchCategories();
      setNewCategory("");
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (editingCategoryId === id) {
      try {
        await axios.put(`/api/expenses/categories/${id}/`, {
          name: editedCategoryName,
        });
        toast.success("Category updated successfully");
        setEditingCategoryId(null);
        fetchCategories();
      } catch (error) {
        handleErrors(error);
      }
    } else {
      setEditingCategoryId(id);
      const category = categories.find((cat) => cat.id === id);
      setEditedCategoryName(category.name);
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 100); // Ensure the input is focused after enabling
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/expenses/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      handleErrors(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle click outside to disable edit mode
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editInputRef.current &&
        !editInputRef.current.contains(event.target) &&
        !categoryListRef.current.contains(event.target)
      ) {
        setEditingCategoryId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCategoryId]);

  return (
    <div className="flex justify-center">
      <ul
        ref={categoryListRef}
        className="w-full sm:w-10/12 md:w-6/12 xl:w-4/12"
      >
        <li className="flex my-3 shadow-md">
          <input
            type="text"
            className="p-2 sm:p-3 w-full focus:outline-none"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            onClick={handleCreateCategory}
            children="Add"
            className="ml-auto w-32 bg-tertiary text-primary font-medium hover:bg-quaternary hover:text-primary dark:bg-secondary dark:text-quaternary dark:hover:bg-secondary/75"
          />
        </li>
        {categories.map((category) => (
          <li key={category.id} className="flex my-3 shadow-md">
            <input
              type="text"
              className="w-full text-sm sm:text-base sm:font-medium bg-secondary 
              focus:bg-white p-2 sm:p-3 focus:outline-none disabled:cursor-default dark:bg-tertiary dark:text-primary"
              value={
                editingCategoryId === category.id
                  ? editedCategoryName
                  : category.name
              }
              onChange={(e) => setEditedCategoryName(e.target.value)}
              ref={editingCategoryId === category.id ? editInputRef : null}
              disabled={editingCategoryId !== category.id}
            />
            <Button
              onClick={() => handleUpdateCategory(category.id)}
              children={
                <>
                  <span className="sr-only">
                    {editingCategoryId === category.id
                      ? "Save Category"
                      : "Edit Category"}
                  </span>
                  <FaEdit />
                </>
              }
              className="flex justify-center items-center ml-auto font-medium w-16 bg-tertiary text-primary 
              hover:bg-quaternary hover:text-primary dark:bg-secondary dark:text-quaternary dark:hover:bg-secondary/75"
            />
            <Button
              onClick={() => handleDeleteCategory(category.id)}
              children={
                <>
                  <span className="sr-only">Delete Category</span>
                  <RiDeleteBin2Fill />
                </>
              }
              className="flex justify-center items-center font-medium w-16 bg-red-600 text-primary hover:bg-red-800 hover:text-primary"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
