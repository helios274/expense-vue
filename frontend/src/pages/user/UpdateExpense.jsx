import React, { useState, useCallback, useEffect } from "react";
import InputBox from "../../components/InputBox";
import SelectBox from "../../components/SelectBox";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthCard from "../../components/cards/AuthCard";
import axios from "../../utils/axios";
import handleErrors from "../../utils/errors";

const AddExpense = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: state.category,
      amount: state.amount,
      description: state.description,
      date: state.date,
    },
  });
  const [categories, setCategories] = useState([]);
  const [btnText, setBtnTxt] = useState("Update");
  const [spinner, setSpinner] = useState(false);

  // Fetch categories from API and populate select box
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/expenses/categories");
      setCategories(response.data);
      reset({
        ...state,
        category: state.category,
      });
    } catch (error) {
      console.error(error);
      handleErrors(error);
    }
  }, [state, reset]);

  async function handleUpdateExpense(data) {
    setBtnTxt("Updating");
    setSpinner(true);

    try {
      await axios.put(`/api/expenses/${state.id}/`, data);
      toast.success("Expense updated successfully");
      navigate("/expenses");
    } catch (error) {
      handleErrors(error);
    } finally {
      setBtnTxt("Update");
      setSpinner(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex justify-center">
      <AuthCard title="Update Expense" cardClass="mt-3">
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(handleUpdateExpense)}
        >
          <SelectBox
            label="Category"
            options={categories}
            defaultValue={state.category}
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
            {...register("description", { required: false })}
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
      </AuthCard>
    </div>
  );
};

export default AddExpense;
