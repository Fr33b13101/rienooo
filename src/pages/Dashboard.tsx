import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import DashboardMain from './DashboardMain';
import AddEntry from './AddEntry';
import Categories from './Categories';
import DebtsAndCredits from './DebtsAndCredits';

export const Dashboard: React.FC = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Routes>
          <Route index element={<DashboardMain />} />
          <Route path="add-entry" element={<AddEntry />} />
          <Route path="categories" element={<Categories />} />
          <Route path="debts-credits" element={<DebtsAndCredits />} />
        </Routes>
      </motion.div>
    </Layout>
  );
};