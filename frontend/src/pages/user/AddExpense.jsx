import React, { useEffect, useState, useCallback } from "react";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectBox";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardContainer from "../../components/cards/AuthCard";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";

const AddExpense = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [btnText, setBtnTxt] = useState("Add");
  const [spinner, setSpinner] = useState(false);

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

  // Add expense
  const handleAddExpense = async (data) => {
    setBtnTxt(`Adding`);
    setSpinner(true);

    try {
      await axios.post("/api/expenses/", data);
      toast.success("Expense added successfully");
      navigate("/expenses");
    } catch (error) {
      console.error(error);
      handleErrors(error);
    } finally {
      setBtnTxt("Add");
      setSpinner(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex justify-center">
      <CardContainer title="Add Expense" cardClass="mt-3">
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(handleAddExpense)}
        >
          <SelectBox
            label="Category"
            options={categories}
            {...register("category", { required: true })}
          />
          {errors.category && (
            <p className="field-error-msg">This field is required</p>
          )}
          <InputBox
            label="Amount"
            type="number"
            step={0.01}
            min={0}
            max={10000000.0}
            {...register("amount", { required: true })}
          />
          {errors.amount && (
            <p className="field-error-msg">This field is required</p>
          )}
          <InputBox
            label="Description"
            type="text"
            {...register("description")}
          />
          <InputBox
            label="Date"
            type="date"
            {...register("date", { required: true })}
          />
          {errors.date && (
            <p className="field-error-msg">This field is required</p>
          )}
          <Button
            className="btn-primary-outline mt-4"
            type="submit"
            spin={spinner}
          >
            {btnText}
          </Button>
        </form>
      </CardContainer>
    </div>
  );
};

export default AddExpense;
