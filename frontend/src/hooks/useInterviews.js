import { useState, useCallback } from 'react';
import { interviewAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await interviewAPI.getAll(filters);
      setInterviews(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  }, []);

  const createInterview = async (formData) => {
    try {
      const { data } = await interviewAPI.create(formData);
      setInterviews((prev) => [data, ...prev]);
      toast.success('Interview added successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add interview');
      throw err;
    }
  };

  const updateInterview = async (id, formData) => {
    try {
      const { data } = await interviewAPI.update(id, formData);
      setInterviews((prev) => prev.map((i) => (i._id === id ? data : i)));
      toast.success('Interview updated successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update interview');
      throw err;
    }
  };

  const deleteInterview = async (id) => {
    try {
      await interviewAPI.remove(id);
      setInterviews((prev) => prev.filter((i) => i._id !== id));
      toast.success('Interview deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete interview');
      throw err;
    }
  };

  return { interviews, loading, fetchInterviews, createInterview, updateInterview, deleteInterview };
};
