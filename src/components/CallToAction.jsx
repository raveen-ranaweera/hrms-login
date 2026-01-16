import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <motion.h1
      className='w-full text-xl font-bold leading-8 text-white'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Let's turn your ideas into reality
    </motion.h1>
  );
};

export default CallToAction;