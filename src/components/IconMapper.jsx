import React from 'react';
import * as FaIcons from 'react-icons/lia'; // Import all icons from the `fa` library

const  Iconz = ({ name }) => {
  // Use a dynamic key to get the correct icon component from the imported library
  const IconComponent = FaIcons[name];

  if (!IconComponent) {
    // Return a default icon or null if the icon name is not found
    return '<span>Icon not found</span>';
  }

  return <IconComponent />;
};

export default Iconz;