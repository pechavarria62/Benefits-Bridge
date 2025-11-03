import React from 'react';
import * as FaIcons from 'react-icons/lia'; 

const  Iconz = ({ name }) => {
  const IconComponent = FaIcons[name];

  if (!IconComponent) {
    return '<span>Icon not found</span>';
  }

  return <IconComponent />;
};

export default Iconz;